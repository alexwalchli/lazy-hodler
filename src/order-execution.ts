import { ExchangeSymbol } from "./types";

export const sellAtMarket = (s: ExchangeSymbol, qty: number): Promise<Boolean> => {
  return Promise.resolve(true);
}
export const buyAtMarket = (s: ExchangeSymbol, qty: number): Promise<Boolean> => {
  return Promise.resolve(true);
}