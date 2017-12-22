// import { ThunkAction } from "redux-thunk";
import { BotState } from "./bot-reducer";
import { QuantityAdjustments, IProductInfo, PortfolioHoldings, ExchangeRates, IPortfolioRecord, CurrencyID } from "../shared/types";
import * as currencyOps from '../shared/currency-operations'
import * as selectors from './selectors'

// export const executeRebalance = (q: QuantityAdjustments): ThunkAction<Promise<void>, BotState, ExtraArgument> =>
// async (dispatch, getState) => {
//     const orderPlan = reduceAdjustmentsToAnOrderExecutionPlan(q)


//   }

// const sellAtMarket = (s: ExchangeSymbol, qty: number, auth: ExchangeAuthData): Promise<Boolean> => {
//   const gdax = buildPrivateHTTPClient(auth)
//   return gdax.createOrder(s, "market", "sell", qty.toString())
// }
// const buyAtMarket = (s: ExchangeSymbol, qty: number, auth: ExchangeAuthData): Promise<Boolean> => {
//   const gdax = buildPrivateHTTPClient(auth)
//   return gdax.createOrder(s, "market", "buy", qty.toString())
// }

export const reduceAdjustmentsToAnOrderExecutionPlan = (s: BotState, p: IPortfolioRecord, q: QuantityAdjustments, h: PortfolioHoldings, fx: ExchangeRates) => {
  const adjustmentsLeft = Object.assign({}, q)
  return Object.keys(q).reduce((orderPlan, c: CurrencyID) => {

    // work in progress:

    const adjustment = q[c]
    console.log('adjustments left:')
    console.log(adjustmentsLeft)
    // since the adjustments are all proportional to current prices
    // we should be able to do this planning in a single loop

    // find all products quoted or based in current currency
    // console.log(`${p.exchangeID} ${c}`)  
    const crosses = selectors.getAllProductCrossesFor(s, p.exchangeID, c)
    // for each product based or quoted in current currency
    // console.log(crosses)
    crosses.forEach((cross: IProductInfo) => {
      // if current currency is base
      if (cross.base === c) {
        // see if there are needed adjustments for the quote side (BTC/USD)
        const oppositeAdjustment = adjustmentsLeft[cross.quote]
        // if there is
        if (oppositeAdjustment) {
          // if adjustment is > 0 && and oppositeAdjustment is < 0
          if (adjustment > 0 && oppositeAdjustment < 0) {
            const neededForAdjustmentInQuote = currencyOps.convertTo(fx, { from: c, fromQuantity: adjustment, to: cross.quote})
            const availableOppositeInventory = h[cross.quote].quantityAvailable
            const inventoryToUseFromQuote = Math.min(availableOppositeInventory, neededForAdjustmentInQuote)
            const quantityToBuyInBase = currencyOps.convertTo(fx, { from: cross.quote, fromQuantity: inventoryToUseFromQuote, to: cross.base})
            orderPlan.buys.push({ symbol: cross.symbol, qty: quantityToBuyInBase })
            adjustmentsLeft[cross.quote] += inventoryToUseFromQuote
            adjustmentsLeft[cross.base] -=  quantityToBuyInBase
          } else if (adjustment < 0 && oppositeAdjustment > 0) {
            const neededForAdjustmentInQuote = currencyOps.convertTo(fx, { from: c, fromQuantity: adjustment, to: cross.quote})
            const availableOppositeInventory = h[cross.quote].quantityAvailable
            const inventoryToUseFromQuote = Math.min(availableOppositeInventory, neededForAdjustmentInQuote)
            const quantityToSellInBase = Math.abs(currencyOps.convertTo(fx, { from: cross.quote, fromQuantity: inventoryToUseFromQuote, to: cross.base}))
            orderPlan.sells.push({ symbol: cross.symbol, qty: quantityToSellInBase })
            adjustmentsLeft[cross.quote] -= inventoryToUseFromQuote
            adjustmentsLeft[cross.base] += quantityToSellInBase
          }
        }
      } else if (cross.quote === c) {
        // base is BTC
        // quote is USD
        const oppositeAdjustment = adjustmentsLeft[cross.base]
        if (oppositeAdjustment) {
          if (adjustment > 0 && oppositeAdjustment < 0) {
            console.log(`sell ${cross.base} for ${cross.quote}`)
            // need to sell base btc for quote USD
            const neededForAdjustmentInBase = currencyOps.convertTo(fx, { from: c, fromQuantity: adjustment, to: cross.base}) // btc
            const availableOppositeInventoryInBase = h[cross.base].quantityAvailable // btc
            const inventoryToUseFromBase = Math.min(availableOppositeInventoryInBase, neededForAdjustmentInBase) // btc
            const quantityToBuyInQuote = currencyOps.convertTo(fx, { from: cross.base, fromQuantity: inventoryToUseFromBase, to: cross.quote}) // usd
            orderPlan.sells.push({ symbol: cross.symbol, qty: inventoryToUseFromBase })
            adjustmentsLeft[cross.base] += inventoryToUseFromBase
            adjustmentsLeft[cross.quote] -=  quantityToBuyInQuote
          } else if (adjustment < 0 && oppositeAdjustment > 0) {
            const neededForAdjustmentInBase = currencyOps.convertTo(fx, { from: c, fromQuantity: adjustment, to: cross.base})
            const availableOppositeInventory = h[cross.base].quantityAvailable
            const inventoryToUseFromBase = Math.min(availableOppositeInventory, neededForAdjustmentInBase)
            const quantityToSellInQuote = Math.abs(currencyOps.convertTo(fx, { from: cross.base, fromQuantity: inventoryToUseFromBase, to: cross.quote}))
            orderPlan.sells.push({ symbol: cross.symbol, qty: quantityToSellInQuote })
            adjustmentsLeft[cross.base] -= inventoryToUseFromBase
            adjustmentsLeft[cross.quote] += quantityToSellInQuote
          }
        }
      }
      // console.log('crosses loop ---')
    })

    // console.log('RETURN -----------')
    return orderPlan
  }, {
    buys: [],
    sells: []
  })
}