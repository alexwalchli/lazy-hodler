import * as exchangeService from './exchange-service'
import { CurrencyID, Allocations, QuantityAdjustments, UserExchangeAuthData, Portfolio, ProductID } from './types';
import * as portfolioCalculators from './portfolio-calculators'


export type RebalanceExecution = {
  sellOrders: Array<() => Promise<Boolean>>,
  buyOrders: Array<() => Promise<Boolean>>
}

export const createBuyAndSells = (p: Portfolio, quantityAdjustments: QuantityAdjustments) => {
  const re: RebalanceExecution = {
    sellOrders: [],
    buyOrders: [] 
  }
  Object.keys(p.holdings).forEach((currencyID: CurrencyID) => {
    const holding = p.holdings[currencyID]
    const adjustment = quantityAdjustments[currencyID]
    if (adjustment < 0) {
      re.sellOrders.push(
        () => { return exchangeService.sellAtMarket(holding.id as CurrencyID, adjustment); }
      );
    } else if (adjustment > 0) {
      re.buyOrders.push(
        () => { return exchangeService.buyAtMarket(holding.id as CurrencyID, adjustment); }
      );
    }
  })

  return re
}

export const executeRebalance = (re: RebalanceExecution): Promise<Boolean> => {
  // execute sells first so we have a balance to buy underachievers with
  return Promise.all(re.sellOrders.map(s => s()))
    .then((responses) => {
      return Promise.all(re.buyOrders.map(b => b()))
        .then((responses) => {
          return true;
        })
    })
}

export const maybeRebalancePortfolio = (exchangeAuthInfo: UserExchangeAuthData, allocations: Allocations) => {
  exchangeService.getPortfolio(exchangeAuthInfo)
    .then((p: Portfolio) => {
      const quantityAdjustments = calculatePortfolioQuantityAdjustments(p, allocations)
      const orders = createBuyAndSells(p, quantityAdjustments)
      executeRebalance(orders)
    })
}

export const calculatePortfolioQuantityAdjustments = (
  p: Portfolio,
  a: Allocations
): QuantityAdjustments  => (
  Object.keys(p.holdings).reduce((quantityAdjustments: QuantityAdjustments, productID: ProductID) => {
    quantityAdjustments[productID] = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, productID)
    return quantityAdjustments
  }, {})
)