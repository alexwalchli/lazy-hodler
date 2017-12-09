import * as portfolioService from './portfolio-service'
import { 
  CurrencyID,
  Allocations,
  QuantityAdjustments,
  UserExchangeAuthData,
  Portfolio
} from './types';
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
        () => { return portfolioService.sellAtMarket(holding.id as CurrencyID, adjustment); }
      );
    } else if (adjustment > 0) {
      re.buyOrders.push(
        () => { return portfolioService.buyAtMarket(holding.id as CurrencyID, adjustment); }
      );
    }
  })

  return re
}

export const executeRebalance = async (re: RebalanceExecution): Promise<Boolean> => {
  // execute sells first so we have a balance to buy underachievers with
  for (let sell of re.sellOrders) {
    await sell()
  }
  for (let buy of re.buyOrders) {
    await buy()
  }
  return true
}

export const maybeRebalancePortfolio = (exchangeAuthInfo: UserExchangeAuthData, allocations: Allocations) => {
  // TODO: better error handling and promise handling
  return portfolioService.getPortfolio(exchangeAuthInfo)
    .then((p: Portfolio) => {
      const quantityAdjustments = calculatePortfolioQuantityAdjustments(p, allocations)
      const orders = createBuyAndSells(p, quantityAdjustments)
      executeRebalance(orders).then(() => Promise.resolve(true))
    }).catch(() => Promise.resolve(false))
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