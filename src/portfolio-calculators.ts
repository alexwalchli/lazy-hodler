import { Portfolio, Allocations, Quantity, CurrencyID } from "./types";
import { convertToBalanceInBaseCurrency, roundToMinimumOrderSize, getCurrentPriceInBase } from "./currency-functions";

export const desiredBalanceInBaseCurrency = (p: Portfolio, a: Allocations, currencyID: CurrencyID, totalPortfolioValueInBase: number) =>
  (a[currencyID] * totalPortfolioValueInBase)

export const quantityAdjustmentForRebalancing = (p: Portfolio, a: Allocations, currencyID: CurrencyID): Quantity => {
  const totalPortfolioValueInBase = calculateTotalPortfolioValueInBaseCurrency(p)
  const desiredBalanceInBase = desiredBalanceInBaseCurrency(p, a, currencyID, totalPortfolioValueInBase)
  const currentBalanceInBase = convertToBalanceInBaseCurrency(p, currencyID, p.holdings[currencyID].quantityAvailable);
  const currentPriceInBase = getCurrentPriceInBase(p, currencyID)
  let adjustment = (desiredBalanceInBase - currentBalanceInBase) / currentPriceInBase
  adjustment = roundToMinimumOrderSize(p, currencyID, adjustment)

  return adjustment
}


export const calculateTotalPortfolioValueInBaseCurrency = (p: Portfolio) => (
  Object.keys(p.holdings).reduce((total: number, currencyID: CurrencyID) => {
    return total + convertToBalanceInBaseCurrency(p, currencyID, p.holdings[currencyID].quantityAvailable)
  }, 0)
)


