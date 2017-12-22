import { ExchangeID, ProductID, CurrencyID, IProductInfo, ExchangeRates, ExchangeSymbol } from "../shared/types";
import { BotState } from "./bot-reducer";

export const getProductIDsByExchange =
  (botState, e: ExchangeID): Array<ProductID> => 
    (Object.keys(botState.productsByExchange[e])
      .map(symbol => botState.productsByExchange[e][symbol].id) as Array<ProductID>)

export const getProduct = (botState: BotState, exch: ExchangeID, base: CurrencyID, quote: CurrencyID) => (
  Object.keys(botState.productsByExchange[exch])
    .map((pID: ProductID) => botState.productsByExchange[exch][pID])
    .find((product: IProductInfo) => product.base === base && product.quote === quote)
)

export const getCurrentPrice = (s: BotState, pr: ProductID): number => s.prices.GDAX[pr].lastPrice

export const getCurrentFXRates = (s: BotState, e: ExchangeID) => {
  return Object.keys(s.productsByExchange[e]).reduce((fx: ExchangeRates, symbol: ExchangeSymbol) => {
    const productInfo = s.productsByExchange[e][symbol] as IProductInfo
    const currentPrice = s.prices[e][symbol].lastPrice
    fx[productInfo.base] = fx[productInfo.base] || {}
    fx[productInfo.base][productInfo.quote] = currentPrice
    fx[productInfo.base][productInfo.base] = 1
    fx[productInfo.quote] = fx[productInfo.quote] || {}
    fx[productInfo.quote][productInfo.base] = 1/currentPrice
    fx[productInfo.quote][productInfo.quote] = 1
    return fx
  }, {})
}

export const getAllProductCrossesFor = (s: BotState, e: ExchangeID, c: CurrencyID) => {
  return Object.keys(s.productsByExchange[e]).reduce((crosses, pr: ProductID) => {
    const product = s.productsByExchange[e][pr]
    if (product.base === c || product.quote === c) {
      crosses.push(product)
    }

    return crosses
  }, [])
}