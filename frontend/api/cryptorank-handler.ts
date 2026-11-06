/**
 * Serverless API proxy handler for CryptoRank v3.
 * Executes on Node.js / Vercel Serverless runtime.
 * Protects CRYPTORANK_API_KEY environment variable from ever reaching the browser.
 */

interface CacheEntry {
  data: any;
  cachedAt: number;
  expiresAt: number;
  staleUntil: number;
}

const cryptoRankServerCache = new Map<string, CacheEntry>();

const CRYPTORANK_BASE_URL = 'https://api.cryptorank.io/v3';

function getQueryParams(req: any): Record<string, string> {
  const params: Record<string, string> = {};
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      params[key] = Array.isArray(value) ? value[0] : String(value ?? '');
    }
    return params;
  }
  try {
    const parsed = new URL(req.url || '/', 'http://localhost');
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } catch {
    // fallback if URL parsing fails
  }
  return params;
}

function sendResponse(
  res: any,
  status: number,
  body: any,
  headers: Record<string, string> = {}
) {
  for (const [key, value] of Object.entries(headers)) {
    try {
      res.setHeader(key, value);
    } catch {
      // ignore header errors on closed sockets
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (typeof res.status === 'function') {
    res.status(status);
  } else {
    res.statusCode = status;
  }

  if (typeof res.json === 'function') {
    res.json(body);
  } else {
    res.end(JSON.stringify(body));
  }
}

async function fetchFromCryptoRank(
  endpoint: string,
  apiKey: string,
  cacheKey: string,
  ttlMs = 300000, // 5 minutes
  staleMs = 600000 // 10 minutes
): Promise<{ data: any; fromCache: boolean; isStale: boolean }> {
  const now = Date.now();
  const cached = cryptoRankServerCache.get(cacheKey);

  // Return fresh cache
  if (cached && now < cached.expiresAt) {
    return { data: cached.data, fromCache: true, isStale: false };
  }

  try {
    const url = `${CRYPTORANK_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/json',
      },
    });

    if (response.status === 429) {
      if (cached && now < cached.staleUntil) {
        return { data: cached.data, fromCache: true, isStale: true };
      }
      const errBody = await response.json().catch(() => ({}));
      throw { status: 429, message: 'CryptoRank rate limit exceeded', details: errBody };
    }

    if (response.status === 401 || response.status === 403) {
      const errBody = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        code: response.status === 403 ? 'PLAN_RESTRICTED' : 'AUTH_FAILED',
        message: response.status === 403
          ? 'Endpoint is not available on CryptoRank Free Sandbox plan (HTTP 403).'
          : 'CryptoRank API key missing, invalid, or subscription tier restricted.',
        details: errBody,
      };
    }

    if (!response.ok) {
      if (cached && now < cached.staleUntil) {
        return { data: cached.data, fromCache: true, isStale: true };
      }
      const errBody = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: `CryptoRank API responded with status ${response.status}`,
        details: errBody,
      };
    }

    const payload = await response.json();
    cryptoRankServerCache.set(cacheKey, {
      data: payload,
      cachedAt: now,
      expiresAt: now + ttlMs,
      staleUntil: now + staleMs,
    });

    return { data: payload, fromCache: false, isStale: false };
  } catch (err: any) {
    if (cached && now < cached.staleUntil) {
      return { data: cached.data, fromCache: true, isStale: true };
    }
    throw err;
  }
}

export async function handleCryptoRankRequest(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.statusCode = 204;
    res.end();
    return;
  }

  const params = getQueryParams(req);
  const action = params.action || 'airdrops';
  const rawApiKey = process.env.CRYPTORANK_API_KEY;
  const isKeyValid = Boolean(rawApiKey && rawApiKey.trim().length > 0 && !rawApiKey.includes('your_') && rawApiKey !== 'undefined');
  const apiKey = isKeyValid ? (rawApiKey as string) : '';

  if (action === 'status') {
    return sendResponse(res, 200, {
      success: true,
      configured: isKeyValid,
      planRestricted: isKeyValid,
      plan: 'Free Sandbox',
      provider: 'CryptoRank v3',
      timestamp: new Date().toISOString(),
    });
  }

  // If no API key configured, return clean non-crashing response
  if (!isKeyValid) {
    return sendResponse(
      res,
      200,
      {
        success: false,
        configured: false,
        planRestricted: false,
        provider: 'CryptoRank v3',
        error: 'CRYPTORANK_API_KEY_NOT_CONFIGURED',
        message: 'Server-side CRYPTORANK_API_KEY environment variable is not configured.',
        data: [],
        meta: { total: 0 },
        timestamp: new Date().toISOString(),
      },
      {
        'Cache-Control': 'no-store',
      }
    );
  }

  try {
    switch (action) {
      // 1. Airdrops / Drophunting list
      case 'airdrops':
      case 'drophunting': {
        const limit = Math.min(Math.max(Number(params.limit || 50), 1), 100);
        const page = Math.max(Number(params.page || 1), 1);
        const status = params.status;

        let query = `?limit=${limit}&page=${page}`;
        if (status) query += `&status=${encodeURIComponent(status)}`;

        const cacheKey = `cryptorank:drophunting:${page}:${limit}:${status || 'all'}`;
        const { data: rawPayload, isStale } = await fetchFromCryptoRank(
          `/drophunting/list${query}`,
          apiKey,
          cacheKey,
          300000,
          600000
        );

        const items = rawPayload?.data || [];
        const meta = rawPayload?.meta || { total: items.length };

        return sendResponse(
          res,
          200,
          {
            success: true,
            configured: true,
            source: 'CryptoRank Drophunting',
            data: items,
            meta,
            pagination: {
              page,
              limit,
              total: meta.total || items.length,
            },
            isStale,
          },
          {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'X-Cache-Status': isStale ? 'STALE' : 'LIVE',
          }
        );
      }

      // 2. Airdrop detail
      case 'airdrop-detail':
      case 'drophunting-detail': {
        const id = params.id;
        if (!id) {
          return sendResponse(res, 400, {
            success: false,
            error: 'MISSING_ID',
            message: 'Parameter "id" is required for airdrop detail.',
          });
        }

        const cacheKey = `cryptorank:drophunting-detail:${id}`;
        const { data: rawPayload, isStale } = await fetchFromCryptoRank(
          `/drophunting/${encodeURIComponent(id)}`,
          apiKey,
          cacheKey,
          300000,
          600000
        );

        return sendResponse(
          res,
          200,
          {
            success: true,
            configured: true,
            source: 'CryptoRank Drophunting',
            data: rawPayload?.data || null,
            isStale,
          },
          {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        );
      }

      // 3. Public Sales list (IDOs, ICOs, IEOs)
      case 'public-sales':
      case 'sales': {
        const limit = Math.min(Math.max(Number(params.limit || 50), 1), 100);
        const page = Math.max(Number(params.page || 1), 1);
        const status = params.status;

        let query = `?limit=${limit}&page=${page}`;
        if (status) query += `&status=${encodeURIComponent(status)}`;

        const cacheKey = `cryptorank:public-sales:${page}:${limit}:${status || 'all'}`;
        const { data: rawPayload, isStale } = await fetchFromCryptoRank(
          `/public-sales/list${query}`,
          apiKey,
          cacheKey,
          300000,
          600000
        );

        const items = rawPayload?.data || [];
        const meta = rawPayload?.meta || { total: items.length };

        return sendResponse(
          res,
          200,
          {
            success: true,
            configured: true,
            source: 'CryptoRank Public Sales',
            data: items,
            meta,
            pagination: {
              page,
              limit,
              total: meta.total || items.length,
            },
            isStale,
          },
          {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'X-Cache-Status': isStale ? 'STALE' : 'LIVE',
          }
        );
      }

      // 4. Public sale detail
      case 'public-sale-detail': {
        const id = params.id;
        if (!id) {
          return sendResponse(res, 400, {
            success: false,
            error: 'MISSING_ID',
            message: 'Parameter "id" is required for public sale detail.',
          });
        }

        const cacheKey = `cryptorank:public-sale-detail:${id}`;
        const { data: rawPayload, isStale } = await fetchFromCryptoRank(
          `/public-sales/${encodeURIComponent(id)}`,
          apiKey,
          cacheKey,
          300000,
          600000
        );

        return sendResponse(
          res,
          200,
          {
            success: true,
            configured: true,
            source: 'CryptoRank Public Sales',
            data: rawPayload?.data || null,
            isStale,
          },
          {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        );
      }

      // 5. Launchpads directory
      case 'launchpads': {
        const limit = Math.min(Math.max(Number(params.limit || 50), 1), 100);
        const page = Math.max(Number(params.page || 1), 1);

        const cacheKey = `cryptorank:launchpads:${page}:${limit}`;
        const { data: rawPayload, isStale } = await fetchFromCryptoRank(
          `/launchpads?limit=${limit}&page=${page}`,
          apiKey,
          cacheKey,
          300000,
          600000
        );

        const items = rawPayload?.data || [];
        const meta = rawPayload?.meta || { total: items.length };

        return sendResponse(
          res,
          200,
          {
            success: true,
            configured: true,
            source: 'CryptoRank Launchpads',
            data: items,
            meta,
            isStale,
          },
          {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        );
      }

      // 6. Launchpad detail
      case 'launchpad-detail': {
        const id = params.id;
        if (!id) {
          return sendResponse(res, 400, {
            success: false,
            error: 'MISSING_ID',
            message: 'Parameter "id" is required for launchpad detail.',
          });
        }

        const cacheKey = `cryptorank:launchpad-detail:${id}`;
        const { data: rawPayload, isStale } = await fetchFromCryptoRank(
          `/launchpads/${encodeURIComponent(id)}`,
          apiKey,
          cacheKey,
          300000,
          600000
        );

        return sendResponse(
          res,
          200,
          {
            success: true,
            configured: true,
            source: 'CryptoRank Launchpads',
            data: rawPayload?.data || null,
            isStale,
          },
          {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        );
      }

      default:
        return sendResponse(res, 400, {
          success: false,
          error: 'INVALID_ACTION',
          message: `Unknown action '${action}'. Supported actions: airdrops, airdrop-detail, public-sales, public-sale-detail, launchpads, launchpad-detail, status.`,
        });
    }
  } catch (err: any) {
    if (err?.code === 'AUTH_FAILED' || err?.code === 'PLAN_RESTRICTED' || err?.status === 403 || err?.status === 401) {
      const isPlanRestricted = err?.status === 403 || err?.code === 'PLAN_RESTRICTED';
      return sendResponse(
        res,
        200,
        {
          success: false,
          configured: isKeyValid,
          planRestricted: isPlanRestricted,
          provider: 'CryptoRank v3',
          error: isPlanRestricted ? 'CRYPTORANK_PLAN_RESTRICTED' : 'CRYPTORANK_API_RESTRICTED',
          message: isPlanRestricted
            ? 'Endpoint is not available on CryptoRank Free Sandbox plan (HTTP 403).'
            : (err?.message || 'CryptoRank API key missing or invalid.'),
          data: [],
          meta: { total: 0 },
        },
        {
          'Cache-Control': 'no-store',
        }
      );
    }

    const statusCode = err?.status || 500;
    return sendResponse(
      res,
      statusCode,
      {
        success: false,
        error: 'CRYPTORANK_API_ERROR',
        message: err?.message || 'Error occurred communicating with CryptoRank API.',
        details: err?.details || null,
      },
      {
        'Cache-Control': 'no-store',
      }
    );
  }
}

