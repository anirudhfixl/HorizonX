import { handleCryptoRankRequest } from './cryptorank-handler';

export default async function handler(req: any, res: any) {
  return handleCryptoRankRequest(req, res);
}

