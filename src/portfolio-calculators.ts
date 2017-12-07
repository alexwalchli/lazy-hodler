import { Portfolio, ProductID, Allocations, Quantity, CurrencyID, ProductInfo } from "./types";

export const convertToBalanceInBaseCurrency = (p: Portfolio, currencyID: CurrencyID, quantity: Quantity) =>
  (p.fxToBaseCurrency[currencyID] * (p.tickers[currencyID].currentPrice * quantity))

export const desiredBalanceInBaseCurrency = (p: Portfolio, a: Allocations, currencyID: CurrencyID, totalPortfolioValueInBase: number) =>
  (a[currencyID] * totalPortfolioValueInBase)

export const quantityAdjustmentForRebalancing = (p: Portfolio, a: Allocations, currencyID: CurrencyID): Quantity => {
  const totalPortfolioValueInBase = calculateTotalPortfolioValueInBaseCurrency(p)
  const desiredBalanceInBase = desiredBalanceInBaseCurrency(p, a, currencyID, totalPortfolioValueInBase)
  const currentBalanceInBase = convertToBalanceInBaseCurrency(p, currencyID, p.holdings[currencyID].quantityAvailable);
  const currentPriceInBase = p.tickers[currencyID].currentPrice * p.fxToBaseCurrency[currencyID]
  let adjustment = (desiredBalanceInBase - currentBalanceInBase) / currentPriceInBase
  adjustment = roundToMinimumOrderSize(p, currencyID, adjustment)

  return adjustment
}

export const roundToMinimumOrderSize = (p: Portfolio, currencyID: CurrencyID, q: Quantity) => {
  const minimumOrderSize = getProductFrom(p, currencyID, p.baseCurrency).minimumOrderSize
  if (Math.abs(q) < minimumOrderSize) {
    q = 0
    return q
  }
  q = +q.toFixed(decimalPlaces(minimumOrderSize))
  return q
}

export const calculateTotalPortfolioValueInBaseCurrency = (p: Portfolio) => (
  Object.keys(p.holdings).reduce((total: number, currencyID: CurrencyID) => {
    return total + convertToBalanceInBaseCurrency(p, currencyID, p.holdings[currencyID].quantityAvailable)
  }, 0)
)

const getProductFrom = (p: Portfolio, quote: CurrencyID, base: CurrencyID) => 
  Object.keys(p.products).map((pID: ProductID) => p.products[pID])
    .find((product: ProductInfo) => product.base === base && product.quote === quote)

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