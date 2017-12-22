import { CurrencyID, Quantity, ExchangeRates } from "./types";

import { fiatIDs } from "./constants";

export const convertTo = (fx: ExchangeRates, opts: { from: CurrencyID, fromQuantity: Quantity, to: CurrencyID }): number => (
  fx[opts.from][opts.to] * opts.fromQuantity
)

// export const getCurrentPriceInBase = (p: IPortfolioRecord, c: CurrencyID) => (
//   isFiat(c) && c === p.baseCurrency
//     ? 1
//     : p.tickers[c].currentPrice * p.fxToBaseCurrency[c]
// )


// export const getProductsWithBaseCurrency = (p: IPortfolioRecord, productBase: CurrencyID): Array<ProductInfo> => (
//   Object.keys(p.products)
//     .map((pID: ProductID) => p.products[pID])
//     .filter((product: IProductInfo) => product.base === productBase)
// )

// export const getTradeableCurrencies = (p: IPortfolioRecord): Array<CurrencyID> =>
//   Object.keys(p.allocations).filter((c: CurrencyID) => !isFiat(c)) as Array<CurrencyID>

export const isFiat = (c: CurrencyID) => fiatIDs.includes(c)