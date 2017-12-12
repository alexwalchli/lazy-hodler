import * as portfolioService from '../portfolio-service'
import * as orderExecution from '../order-execution'
import { 
  CurrencyID,
  Allocations,
  QuantityAdjustments,
  UserExchangeAuthData,
  Portfolio
} from '../types';
import * as portfolioCalculators from '../portfolio-calculators'
import { getProductFrom } from '../currency-functions'


export type RebalanceExecution = {
  sellOrders: Array<() => Promise<Boolean>>,
  buyOrders: Array<() => Promise<Boolean>>
}

export const createBuyAndSells = (p: Portfolio, quantityAdjustments: QuantityAdjustments, auth: UserExchangeAuthData, useLive: boolean = false) => {
  // IMPORTANT TODO: This should be smarter.
  // For example if we need more ETH and less BTC. We should just buy ETH with 
  // ETH/BTC(selling BTC for more ETH) instead of selling ETH to USD and then buying
  // BTC with the new USD

  const re: RebalanceExecution = {
    sellOrders: [],
    buyOrders: [] 
  }
  Object.keys(p.holdings).forEach((currencyID: CurrencyID) => {
    const adjustment = quantityAdjustments[currencyID]
    const product = getProductFrom(p, currencyID, p.baseCurrency)
    if (adjustment < 0) {
      re.sellOrders.push(
        () => { return orderExecution.sellAtMarket(product.symbol, adjustment, auth, useLive); }
      );
    } else if (adjustment > 0) {
      re.buyOrders.push(
        () => { return orderExecution.buyAtMarket(product.symbol, adjustment, auth, useLive); }
      );
    }
  })

  return re
}

export const executeRebalance = async (re: RebalanceExecution): Promise<Boolean> => {
  // execute sells first so we have a balance to buy underachievers with
  // TODO: Clean this up
  for (let sell of re.sellOrders) {
    try {
      await sell()
    } catch (error) {
      return false
    }
  }
  for (let buy of re.buyOrders) {
    try {
      await buy()
    } catch (error) {
      return false
    }
  }
  return true
}

export const maybeRebalancePortfolio = async (auth: UserExchangeAuthData, allocations: Allocations, useLive: boolean = false) => {
  try {
    const p = await portfolioService.getPortfolio(auth)
    const quantityAdjustments = calculatePortfolioQuantityAdjustments(p, allocations)
    const orders = createBuyAndSells(p, quantityAdjustments, auth, useLive)
    const result = await executeRebalance(orders)
    return result
  } catch (error) {
    // TODO: Error notifications
    return false
  }
}

export const calculatePortfolioQuantityAdjustments = (
  p: Portfolio,
  a: Allocations
): QuantityAdjustments  => (
  Object.keys(p.holdings).reduce((quantityAdjustments: QuantityAdjustments, currencyID: CurrencyID) => {
    quantityAdjustments[currencyID] = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, currencyID)
    return quantityAdjustments
  }, {})
)