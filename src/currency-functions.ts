import { CurrencyID, Allocations, Portfolio, Quantity, ProductInfo, ProductID } from "./types";
import { fiatIDs } from "./constants";

export const convertToBalanceInBaseCurrency = (p: Portfolio, currencyID: CurrencyID, quantity: Quantity): number => (
  p.fxToBaseCurrency[currencyID] * (getCurrentPriceInBase(p, currencyID) * quantity)
)

export const getCurrentPriceInBase = (p: Portfolio, c: CurrencyID) => (
  isFiat(c) && c === p.baseCurrency
    ? 1
    : p.tickers[c].currentPrice * p.fxToBaseCurrency[c]
)

export const roundToMinimumOrderSize = (p: Portfolio, currencyID: CurrencyID, q: Quantity) => {
  if (isFiat(currencyID)) {
    return q
  }
  const minimumOrderSize = getProductFrom(p, currencyID, p.baseCurrency).minimumOrderSize
  if (Math.abs(q) < minimumOrderSize) {
    q = 0
    return q
  }
  q = +q.toFixed(decimalPlaces(minimumOrderSize))
  return q
}

export const getProductFrom = (p: Portfolio, productBase: CurrencyID, productQuote: CurrencyID) => 
  Object.keys(p.products)
    .map((pID: ProductID) => p.products[pID])
    .find((product: ProductInfo) => product.base === productBase && product.quote === productQuote)


export const getTradeableCurrencies = (a: Allocations): Array<CurrencyID> =>
  Object.keys(a).filter((c: CurrencyID) => !isFiat(c)) as Array<CurrencyID>

export const isFiat = (c: CurrencyID) => fiatIDs.includes(c)

const decimalPlaces = (n: number) => {
  const strNumber = n.toString()
  var match = (''+strNumber).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0))
}