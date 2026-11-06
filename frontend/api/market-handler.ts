/**
 * Serverless API proxy handler for CoinMarketCap.
 * Executes on Node.js / Vercel Serverless runtime.
 * Protects the COINMARKETCAP_API_KEY environment variable from ever reaching the browser.
 */

import { handleCryptoRankRequest } from './cryptorank-handler';

interface CacheEntry {
  data: any;
  cachedAt: number;
  expiresAt: number;
  staleUntil: number;
  contentType?: string;
  cacheControl?: string;
}

const serverCache = new Map<string, CacheEntry>();

const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com';

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

async function fetchFromCmc(
  path: string,
  apiKey: string,
  cacheKey: string,
  ttlMs = 60000,
  staleMs = 600000
): Promise<{ data: any; fromCache: boolean; isStale: boolean }> {
  const now = Date.now();
  const cached = serverCache.get(cacheKey);

  // Return fresh cache
  if (cached && now < cached.expiresAt) {
    return { data: cached.data, fromCache: true, isStale: false };
  }

  try {
    const url = `${CMC_BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        Accept: 'application/json',
      },
    });

    if (response.status === 429) {
      if (cached && now < cached.staleUntil) {
        return { data: cached.data, fromCache: true, isStale: true };
      }
      const errBody = await response.json().catch(() => ({}));
      throw { status: 429, message: 'CoinMarketCap rate limit exceeded', details: errBody };
    }

    if (!response.ok) {
      if (cached && now < cached.staleUntil) {
        return { data: cached.data, fromCache: true, isStale: true };
      }
      const errBody = await response.json().catch(() => ({}));
      throw { status: response.status, message: `CoinMarketCap API responded with status ${response.status}`, details: errBody };
    }

    const payload = await response.json();
    serverCache.set(cacheKey, {
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

export async function handleMarketRequest(req: any, res: any) {
  // Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.statusCode = 204;
    res.end();
    return;
  }

  const params = getQueryParams(req);
  const action = params.action || 'overview';

  // Support cryptorank delegation through market proxy
  if (action.startsWith('cryptorank') || action === 'drophunting' || action === 'public-sales') {
    const forwardAction = action.replace(/^cryptorank-?/, '') || 'airdrops';
    const modifiedReq = {
      ...req,
      query: {
        ...params,
        action: forwardAction,
      },
    };
    return handleCryptoRankRequest(modifiedReq, res);
  }

  const apiKey = process.env.COINMARKETCAP_API_KEY;

  if (action === 'status') {
    return sendResponse(res, 200, {
      success: true,
      configured: Boolean(apiKey && apiKey.trim().length > 0),
      provider: 'CoinMarketCap',
      timestamp: new Date().toISOString(),
    });
  }

  // If no API key configured, return clean non-crashing response
  if (!apiKey || apiKey.trim().length === 0) {
    return sendResponse(res, 200, {
      success: false,
      error: 'COINMARKETCAP_API_KEY_NOT_CONFIGURED',
      message: 'Server-side COINMARKETCAP_API_KEY environment variable is not configured.',
      configured: false,
      timestamp: new Date().toISOString(),
    }, {
      'Cache-Control': 'no-store',
    });
  }

  try {
    switch (action) {
      case 'overview': {
        const { data: globalData, isStale } = await fetchFromCmc(
          '/v1/global-metrics/quotes/latest?convert=USD',
          apiKey,
          'cmc:global-metrics',
          60000,
          600000
        );

        // Fetch top gainers for overview highlight
        let topGainer = {
          symbol: 'BTC',
          changePercent: 0,
          name: 'Bitcoin',
          tokenId: 'bitcoin',
        };

        try {
          const { data: listingsData } = await fetchFromCmc(
            '/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=USD&sort=percent_change_24h&sort_dir=desc',
            apiKey,
            'cmc:top-gainers',
            60000,
            600000
          );
          const rawItems = listingsData?.data || [];
          // Filter out suspicious micro-cap outliers (>1000% spike or negligible volume < $50,000)
          const validCandidates = rawItems.filter((item: any) => {
            const ch = item.quote?.USD?.percent_change_24h ?? 0;
            const vol = item.quote?.USD?.volume_24h ?? 0;
            return ch > 0 && ch <= 1000 && vol >= 50000;
          });
          const candidate = validCandidates[0] || rawItems.find((item: any) => {
            const ch = item.quote?.USD?.percent_change_24h ?? 0;
            return ch > 0 && ch <= 1000;
          }) || rawItems[0];

          if (candidate) {
            topGainer = {
              symbol: candidate.symbol,
              changePercent: Number((candidate.quote?.USD?.percent_change_24h ?? 0).toFixed(2)),
              name: candidate.name,
              tokenId: candidate.slug || String(candidate.id),
            };
          }
        } catch {
          // fallback to default
        }

        const quote = globalData?.data?.quote?.USD;
        const totalMarketCap = quote?.total_market_cap ?? 0;
        const volume24h = quote?.total_volume_24h ?? 0;
        const activePairs = globalData?.data?.active_market_pairs ?? 0;

        const overview = {
          volume24h,
          totalLiquidity: totalMarketCap ? totalMarketCap * 0.04 : 0,
          topGainer,
          activeMarketsCount: activePairs,
          lastUpdated: quote?.last_updated || new Date().toISOString(),
          btcDominance: globalData?.data?.btc_dominance ?? 0,
          ethDominance: globalData?.data?.eth_dominance ?? 0,
          totalMarketCap,
        };

        return sendResponse(res, 200, {
          success: true,
          source: 'CoinMarketCap',
          data: overview,
          isStale,
        }, {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'X-Cache-Status': isStale ? 'STALE' : 'LIVE',
        });
      }

      case 'listings': {
        const limit = Math.min(Math.max(Number(params.limit || 50), 1), 200);
        const start = Math.max(Number(params.start || 1), 1);
        const sort = params.sort || 'market_cap';
        const sortDir = params.sort_dir || 'desc';

        const cacheKey = `cmc:listings:${start}:${limit}:${sort}:${sortDir}`;
        const path = `/v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}&convert=USD&sort=${encodeURIComponent(sort)}&sort_dir=${encodeURIComponent(sortDir)}`;

        const { data: rawListings, isStale } = await fetchFromCmc(path, apiKey, cacheKey, 60000, 600000);

        const items = (rawListings?.data || []).map((item: any) => {
          const usd = item.quote?.USD;
          const id = item.slug || String(item.id);
          const price = usd?.price ?? 0;
          const priceChange24h = usd?.percent_change_24h ?? 0;
          const marketCap = usd?.market_cap ?? 0;
          const volume24h = usd?.volume_24h ?? 0;
          const circulatingSupply = item.circulating_supply ?? 0;

          return {
            id,
            cmcId: item.id,
            name: item.name,
            symbol: item.symbol,
            slug: item.slug,
            cmcRank: item.cmc_rank,
            logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
            logoUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
            image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
            network: item.platform?.name ? item.platform.name.toLowerCase() : 'mainnet',
            blockchain: item.platform?.name || 'Ethereum',
            category: item.tags?.[0] || (item.platform ? 'Ecosystem' : 'Layer 1'),
            contractAddress: item.platform?.token_address,
            totalSupply: item.total_supply ? String(item.total_supply) : undefined,
            maxSupply: item.max_supply ? String(item.max_supply) : undefined,
            circulatingSupply,
            price,
            priceChange24h,
            marketCap,
            volume24h,
            status: 'active',
            verificationStatus: 'verified',
            market: {
              tokenId: id,
              price,
              priceChange24h,
              volume24h,
              liquidity: volume24h * 0.45,
              marketCap,
              circulatingSupply,
              source: 'CoinMarketCap',
              lastUpdated: usd?.last_updated || new Date().toISOString(),
              isLive: true,
            },
            createdAt: item.date_added || new Date().toISOString(),
            updatedAt: usd?.last_updated || new Date().toISOString(),
          };
        });

        return sendResponse(res, 200, {
          success: true,
          source: 'CoinMarketCap',
          data: items,
          pagination: {
            start,
            limit,
            count: items.length,
          },
          isStale,
        }, {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'X-Cache-Status': isStale ? 'STALE' : 'LIVE',
        });
      }

      case 'metadata': {
        const symbols = params.symbols;
        const ids = params.ids;
        const slugs = params.slugs;

        let queryParam = '';
        if (ids) queryParam = `id=${encodeURIComponent(ids)}`;
        else if (slugs) queryParam = `slug=${encodeURIComponent(slugs)}`;
        else if (symbols) queryParam = `symbol=${encodeURIComponent(symbols)}`;
        else queryParam = 'symbol=BTC,ETH,SOL,BNB,USDT';

        const cacheKey = `cmc:meta:${queryParam}`;
        const path = `/v2/cryptocurrency/info?${queryParam}`;

        const { data: rawMeta, isStale } = await fetchFromCmc(path, apiKey, cacheKey, 86400000, 604800000);

        return sendResponse(res, 200, {
          success: true,
          source: 'CoinMarketCap',
          data: rawMeta?.data || {},
          isStale,
        }, {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        });
      }

      case 'quotes': {
        const symbols = params.symbols;
        const ids = params.ids;
        const slugs = params.slugs;

        let queryParam = '';
        if (ids) queryParam = `id=${encodeURIComponent(ids)}`;
        else if (slugs) queryParam = `slug=${encodeURIComponent(slugs)}`;
        else if (symbols) queryParam = `symbol=${encodeURIComponent(symbols)}`;
        else queryParam = 'symbol=BTC,ETH';

        const cacheKey = `cmc:quotes:${queryParam}`;
        const path = `/v2/cryptocurrency/quotes/latest?${queryParam}&convert=USD`;

        const { data: rawQuotes, isStale } = await fetchFromCmc(path, apiKey, cacheKey, 30000, 300000);

        return sendResponse(res, 200, {
          success: true,
          source: 'CoinMarketCap',
          data: rawQuotes?.data || {},
          isStale,
        }, {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        });
      }

      case 'detail': {
        const idOrSymbol = params.id || params.symbol || 'bitcoin';
        const isNumeric = /^\d+$/.test(idOrSymbol);
        const queryParam = isNumeric ? `id=${idOrSymbol}` : (idOrSymbol.length <= 5 ? `symbol=${idOrSymbol.toUpperCase()}` : `slug=${idOrSymbol.toLowerCase()}`);

        const cacheKey = `cmc:detail:${idOrSymbol.toLowerCase()}`;
        const now = Date.now();
        const cached = serverCache.get(cacheKey);
        if (cached && now < cached.expiresAt) {
          return sendResponse(res, 200, {
            success: true,
            source: 'CoinMarketCap',
            data: cached.data,
            fromCache: true,
          }, {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          });
        }

        // Fetch quote and metadata in parallel
        const [quoteRes, metaRes] = await Promise.allSettled([
          fetchFromCmc(`/v2/cryptocurrency/quotes/latest?${queryParam}&convert=USD`, apiKey, `cmc:q:${queryParam}`, 30000, 300000),
          fetchFromCmc(`/v2/cryptocurrency/info?${queryParam}`, apiKey, `cmc:m:${queryParam}`, 86400000, 604800000),
        ]);

        let rawQuoteData: any = null;
        let rawMetaData: any = null;

        if (quoteRes.status === 'fulfilled') {
          const qObj = quoteRes.value.data?.data;
          if (qObj) {
            rawQuoteData = Object.values(qObj)[0];
            if (Array.isArray(rawQuoteData)) rawQuoteData = rawQuoteData[0];
          }
        }

        if (metaRes.status === 'fulfilled') {
          const mObj = metaRes.value.data?.data;
          if (mObj) {
            rawMetaData = Object.values(mObj)[0];
            if (Array.isArray(rawMetaData)) rawMetaData = rawMetaData[0];
          }
        }

        if (!rawQuoteData && !rawMetaData) {
          return sendResponse(res, 404, {
            success: false,
            error: 'TOKEN_NOT_FOUND',
            message: `Cryptocurrency '${idOrSymbol}' was not found on CoinMarketCap.`,
          });
        }

        const usd = rawQuoteData?.quote?.USD;
        const price = usd?.price ?? 0;
        const priceChange24h = usd?.percent_change_24h ?? 0;
        const marketCap = usd?.market_cap ?? 0;
        const volume24h = usd?.volume_24h ?? 0;
        const circulatingSupply = rawQuoteData?.circulating_supply ?? 0;
        const name = rawQuoteData?.name || rawMetaData?.name || idOrSymbol;
        const symbol = rawQuoteData?.symbol || rawMetaData?.symbol || idOrSymbol.toUpperCase();
        const cmcId = rawQuoteData?.id || rawMetaData?.id;
        const logo = rawMetaData?.logo || (cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcId}.png` : undefined);
        const slug = rawQuoteData?.slug || rawMetaData?.slug || idOrSymbol.toLowerCase();

        const token = {
          id: slug,
          cmcId,
          name,
          symbol,
          slug,
          description: rawMetaData?.description,
          logo,
          logoUrl: logo,
          image: logo,
          network: rawQuoteData?.platform?.name ? rawQuoteData.platform.name.toLowerCase() : 'mainnet',
          blockchain: rawQuoteData?.platform?.name || 'Ethereum',
          category: rawMetaData?.category || 'Cryptocurrency',
          contractAddress: rawQuoteData?.platform?.token_address || rawMetaData?.platform?.token_address,
          totalSupply: rawQuoteData?.total_supply ? String(rawQuoteData.total_supply) : undefined,
          maxSupply: rawQuoteData?.max_supply ? String(rawQuoteData.max_supply) : undefined,
          circulatingSupply,
          price,
          priceChange24h,
          marketCap,
          volume24h,
          website: rawMetaData?.urls?.website?.[0],
          twitter: rawMetaData?.urls?.twitter?.[0],
          technicalDoc: rawMetaData?.urls?.technical_doc?.[0],
          explorer: rawMetaData?.urls?.explorer?.[0],
          status: 'active',
          verificationStatus: 'verified',
          market: {
            tokenId: slug,
            price,
            priceChange24h,
            volume24h,
            liquidity: volume24h * 0.45,
            marketCap,
            circulatingSupply,
            source: 'CoinMarketCap',
            lastUpdated: usd?.last_updated || new Date().toISOString(),
            isLive: true,
          },
          createdAt: rawQuoteData?.date_added || new Date().toISOString(),
          updatedAt: usd?.last_updated || new Date().toISOString(),
        };

        serverCache.set(cacheKey, {
          data: token,
          cachedAt: now,
          expiresAt: now + 30000,
          staleUntil: now + 300000,
        });

        return sendResponse(res, 200, {
          success: true,
          source: 'CoinMarketCap',
          data: token,
        }, {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        });
      }

      default:
        return sendResponse(res, 400, {
          success: false,
          error: 'INVALID_ACTION',
          message: `Unknown action '${action}'. Supported actions: overview, listings, metadata, quotes, detail, status.`,
        });
    }
  } catch (err: any) {
    const statusCode = err?.status || 500;
    return sendResponse(res, statusCode, {
      success: false,
      error: 'CMC_API_ERROR',
      message: err?.message || 'Error occurred communicating with CoinMarketCap API.',
      details: err?.details || null,
    }, {
      'Cache-Control': 'no-store',
    });
  }
}

