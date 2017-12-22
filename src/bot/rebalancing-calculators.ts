import { IPortfolioRecord, Quantity, CurrencyID, PortfolioHoldings, ExchangeRates } from "../shared/types";
import * as currencyOps from '../shared/currency-operations'
import { QuantityAdjustments } from "../shared/types"

export const reduceHoldingsToRebalancingAdjustments = (
  fx: ExchangeRates,
  p: IPortfolioRecord,
  h: PortfolioHoldings
): QuantityAdjustments  => {
  const total = reduceHoldingsToTotalInBaseCurrency(p, h, fx)
  return Object.keys(h).reduce((quantityAdjustments: QuantityAdjustments, currencyID: CurrencyID) => {
    const adjustment = calculateAdjustment(p, total, h, fx, currencyID)
    quantityAdjustments[currencyID] = adjustment
    return quantityAdjustments
  }, {})
}

export const desiredBalanceInBaseCurrency = (p: IPortfolioRecord, currencyID: CurrencyID, totalPortfolioValueInBase: number) =>
  (p.allocations[currencyID] * totalPortfolioValueInBase)

export const calculateAdjustment = (
  p: IPortfolioRecord,
  portfolioTotalInBase: number,
  h: PortfolioHoldings,
  fx: ExchangeRates,
  currencyID: CurrencyID
): Quantity => {
  const totalPortfolioValueInBase = reduceHoldingsToTotalInBaseCurrency(p, h, fx)
  const quantity = h[currencyID].quantityAvailable
  const currentBalanceInBase = currencyOps.convertTo(
    fx, { from: currencyID, fromQuantity: quantity, to: p.baseCurrency }
  );
  const desiredBalanceInBase = desiredBalanceInBaseCurrency(p, currencyID, totalPortfolioValueInBase)
  const currentPriceInBase = currencyOps.convertTo(fx, { from: currencyID, fromQuantity: 1, to: p.baseCurrency })
  let adjustment = (desiredBalanceInBase - currentBalanceInBase) / currentPriceInBase

  return adjustment
}

export const reduceHoldingsToTotalInBaseCurrency = (p: IPortfolioRecord, h: PortfolioHoldings, fx: ExchangeRates) => (
  Object.keys(h).reduce((total: number, currencyID: CurrencyID) => {
    return total + currencyOps.convertTo(fx, { from: currencyID, fromQuantity: h[currencyID].quantityAvailable, to: p.baseCurrency })
  }, 0)
)


