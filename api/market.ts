import { handleMarketRequest } from '../frontend/api/market-handler';

export default async function handler(req: any, res: any) {
  return handleMarketRequest(req, res);
}

