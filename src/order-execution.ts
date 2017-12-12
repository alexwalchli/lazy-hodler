import { ExchangeSymbol, UserExchangeAuthData } from "./types";
import { buildExchangeClient } from "./exchange-client-factory";

export const sellAtMarket = (s: ExchangeSymbol, qty: number, auth: UserExchangeAuthData, useLive: boolean = false): Promise<Boolean> => {
  const gdax = buildExchangeClient(auth, useLive)
  return gdax.createOrder(s, "market", "sell", qty.toString())
}
export const buyAtMarket = (s: ExchangeSymbol, qty: number, auth: UserExchangeAuthData, useLive: boolean = false): Promise<Boolean> => {
  const gdax = buildExchangeClient(auth, useLive)
  return gdax.createOrder(s, "market", "buy", qty.toString())
}