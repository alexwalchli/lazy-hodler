import { Portfolio, ProductID, Allocations, Quantity } from "./types";

export const convertToBalanceInBaseCurrency = (p: Portfolio, productID: ProductID, quantity: Quantity) =>
  (p.fxToBaseCurrency[productID] * (p.tickers[productID].currentPrice * quantity))

export const desiredBalanceInBaseCurrency = (p: Portfolio, a: Allocations, productID: ProductID, totalPortfolioValueInBase: number) =>
  (a[productID] * totalPortfolioValueInBase)

export const quantityAdjustmentForRebalancing = (p: Portfolio, a: Allocations, productID: ProductID): Quantity => {
  const totalPortfolioValueInBase = calculateTotalPortfolioValueInBaseCurrency(p)
  const desiredBalanceInBase = desiredBalanceInBaseCurrency(p, a, productID, totalPortfolioValueInBase)
  const currentBalanceInBase = convertToBalanceInBaseCurrency(p, productID, p.holdings[productID].quantityAvailable);
  const currentPriceInBase = p.tickers[productID].currentPrice * p.fxToBaseCurrency[productID]
  let adjustment = (desiredBalanceInBase - currentBalanceInBase) / currentPriceInBase
  adjustment = roundToMinimumOrderSize(p, productID, adjustment)

  return adjustment
}

export const roundToMinimumOrderSize = (p: Portfolio, productID: ProductID, q: Quantity) => {
  const minimumOrderSize = p.products[productID].minimumOrderSize
  if (Math.abs(q) < minimumOrderSize) {
    q = 0
    return q
  }
  q = +q.toFixed(decimalPlaces(minimumOrderSize))
  return q
}

export const calculateTotalPortfolioValueInBaseCurrency = (p: Portfolio) => (
  Object.keys(p.holdings).reduce((total: number, productID: ProductID) => {
    return total + convertToBalanceInBaseCurrency(p, productID, p.holdings[productID].quantityAvailable)
  }, 0)
)

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