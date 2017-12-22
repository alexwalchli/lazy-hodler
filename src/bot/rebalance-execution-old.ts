// import * as portfolioService from '../portfolio-service'
// import { 
//   CurrencyID,
//   Allocations,
//   QuantityAdjustments,
//   UserExchangeAuthData,
//   Portfolio,
//   ProductInfo,
//   RebalanceOrderExecution,
//   ProductID
// } from '../types';
// import * as portfolioCalculators from '../portfolio-calculators'
// import { getProductsWithBaseCurrency } from '../currency-functions'
// import { PriceFeedManager } from '../price-feed-manager'
// import * as exchangeClientFactory from '../exchange-client-factory'
// import { buildExchangeClient } from '../exchange-client-factory';

// export const reduceAdjustmentsToOrderExecution = (
//   p: Portfolio,
//   quantityAdjustments: QuantityAdjustments,
//   auth: UserExchangeAuthData,
//   useLive: boolean = false
// ): RebalanceOrderExecution => {
//   const roe: RebalanceOrderExecution = {
//     sell: [],
//     buy: []
//   }
//   quantityAdjustments.forEach((adjustment) => {
//     if (adjustment.quantity === 0) {
//       return;
//     }

//     const allProductsBasedInCurrency = getProductsWithBaseCurrency(p, adjustment.currencyID)
//     const crossProducts = allProductsBasedInCurrency.filter((p) => p.quote === adjustment.currencyID)
//     crossProducts.forEach((crossedProduct: ProductInfo) => {
//       const crossedQuantityAdjustment = quantityAdjustments.find((a) => a.currencyID === crossedProduct.base)
//       if (adjustment.quantity > 0 && crossedQuantityAdjustment.quantity < 0) {
//         roe.sell.push({ symbol: crossedProduct.symbol, quantity: 1 }) // TODO: Correct QTY
//       } else {
//         // roe.
//       }
//     })

//     // find the adjustments for the other currencies that are used as the QUOTE
//     // currency in allProductsBasedInCurrency

//   })

//   return roe
// }

// export const executeRebalance = async (re: RebalanceOrderExecution): Promise<Boolean> => {
//   // execute sells first so we have a balance to buy underachievers with
//   // TODO: Clean this up
//   // for (let sell of re.sell) {
//   //   try {
//   //     await sell()
//   //   } catch (error) {
//   //     return false
//   //   }
//   // }
//   // for (let buy of re.buyOrders) {
//   //   try {
//   //     await buy()
//   //   } catch (error) {
//   //     return false
//   //   }
//   // }
//   return true
// }

// export const startRebalancingPortfolios = async () => {
// // 1. Get portfolio allocations from Firebase
// await dispatch(actions.loadAllAllocations())
// await dispatch(actions.subscribeToPrices())

// // 2. Get all exchanges from portfolio allocations
// const allExchangeIDs = ['GDAX'] // only supporting GDAX at the moment
// // 3. Create HTTP clients for each exchange
// // 4. Create Websocket clients for each exchange
// // 5. Start price feed managers for each exchange and all their markets
// const priceFeedManagers = allExchangeIDs.map(exchID => new PriceFeedManager())
// await Promise.all(())
// // 4. For each portfolio allocation
//   const exchangeClient = buildExchangeClient(auth)
//   // 1. get current user holdings
//   // 2. calculate basic qty adjustments
//   // 3. determine order execution plan from qty adjustments
//   // 4. execute execution plan

// }

// export const maybeRebalancePortfolio = async (auth: UserExchangeAuthData, allocations: Allocations, useLive: boolean = false) => {
//   try {
//     const exchangeHttpClient = exchangeClientFactory.buildExchangeClient(auth, useLive)
//     updateState(exchangeActions.loadMarkets())

//     const exchangeMarkets = await exchangeService.getAllMarkets(exchangeHttpClient)
//     const userHoldings = await exchangeService.getHoldings(exchangeHttpClient)


//     const allProductIDsForExchange = Object.keys(exchangeMarkets) as Array<ProductID>
//     const priceFeedManager = new PriceFeedManager()
//     const subscriptionResult = await priceFeedManager.maybeSubscribeTo(allProductIDsForExchange)
//     if (subscriptionResult) {
//       const p = await portfolioService.getPortfolio(auth)
//       const quantityAdjustments = reduceCurrentHoldingsToRebalancedQuantities(p, allocations)
//       const orders = reduceAdjustmentsToOrderExecution(p, quantityAdjustments, auth, useLive)
//       const result = await executeRebalance(orders)
//       return result
//     } else {

//     }
//   } catch (error) {
//     // TODO: Error notifications
//     return false
//   }
// }

// export const reduceCurrentHoldingsToRebalancedQuantities = (
//   p: Portfolio,
//   a: Allocations
// ): QuantityAdjustments  => (
//   Object.keys(p.holdings).reduce((quantityAdjustments: QuantityAdjustments, currencyID: CurrencyID) => {
//     const adjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, currencyID)
//     quantityAdjustments.push({
//       currencyID, quantity: adjustment
//     })
//     return quantityAdjustments
//   }, [])
// )