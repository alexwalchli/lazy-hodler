import { expect } from "chai"

import * as rebalancingCalculators from "../../src/bot/rebalancing-calculators"
import { BotState } from "../../src/bot/bot-reducer";
import { IPortfolioRecord, PortfolioHoldings, QuantityAdjustments } from "../../src/shared/types";
import { reduceAdjustmentsToAnOrderExecutionPlan } from '../../src/bot/order-actions'
import * as selectors from '../../src/bot/selectors'


describe('order-actions unit tests', () => {
  describe("reduceAdjustmentsToAnOrderExecutionPlan", () => {
    const s: BotState = {
      prices: {
        GDAX: {
          'BTC/USD': { productID: 'BTC-USD', lastPrice: 10000 },
          'ETH/USD': { productID: 'ETH-USD', lastPrice: 1000 },
          'LTC/USD': { productID: 'LTC-USD', lastPrice: 100 },
          'ETH/BTC': { productID: 'ETH-BTC', lastPrice: 1000/10000 }, 
          'LTC/BTC': { productID: 'LTC-BTC', lastPrice: 100/10000 }, 
        }
      },
      portfolios: [],
      portfoliosQueuedForRebalance: [],
      productsByExchange: {
        GDAX: {
          'BTC/USD': { id: 'BTC-USD', base: 'BTC', quote: 'USD', symbol: 'BTC/USD', minimumOrderSize: 0.001 },
          'ETH/USD': { id: 'ETH-USD', base: 'ETH', quote: 'USD', symbol: 'ETH/USD', minimumOrderSize: 0.01 },
          'LTC/USD': { id: 'LTC-USD', base: 'LTC', quote: 'USD', symbol: 'LTC/USD', minimumOrderSize: 0.01 },
          'ETH/BTC': { id: 'ETH-BTC', base: 'ETH', quote: 'BTC', symbol: 'ETH/BTC', minimumOrderSize: 0.01 },
          'LTC/BTC': { id: 'LTC-BTC', base: 'LTC', quote: 'BTC', symbol: 'LTC/BTC', minimumOrderSize: 0.01 },
        }
      }
    }
    const fx = selectors.getCurrentFXRates(s, 'GDAX')

    it('should execute no orders if no adjustments are necessary', () => {
      const p: IPortfolioRecord = {
        id: 'abc',
        name: 'abc',
        userID: 'abc',
        allocations: {
          'BTC': .3,
          'ETH': .3,
          'USD': .4
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD',
        exchangeID: 'GDAX'
      }
      const h: PortfolioHoldings = {
        'BTC': {
          id: 'BTC', quantityAvailable: 1
        },
        'ETH': {
          id: 'ETH', quantityAvailable: 10
        },
        'USD': {
          id: 'USD', quantityAvailable: 10000
        }
      }
      const q: QuantityAdjustments = {
         'BTC': 0,
         'ETH': 0,
         'USD': 0
      }
      const fx = selectors.getCurrentFXRates(s, 'GDAX')

      const plan = reduceAdjustmentsToAnOrderExecutionPlan(s, p, q, h, fx)

      expect(plan.buys).to.be.empty
      expect(plan.sells).to.be.empty
    })
    it('should use the base portfolio currency and each currency adjustment to find an exchange symbol for the orders', () => {
  
    })
    describe('when inventory from more than 1 currency needs to be sold to increase another', () => {
      
    })
    describe('various portfolios', () => {
      describe('with desired portfolio allocations: 50% BTC / 50% ETH', () => {
        describe('with current holdings: 60% BTC / 40% ETH', () => {
          const p: IPortfolioRecord = {
            id: 'abc',
            name: 'abc',
            userID: 'abc',
            allocations: {
              'BTC': .5,
              'ETH': .5
            },
            baseCurrency: 'USD',
            quoteCurrency: 'USD',
            exchangeID: 'GDAX'
          }
          const h: PortfolioHoldings = {
            'BTC': {
              id: 'BTC', quantityAvailable: .6
            },
            'ETH': {
              id: 'ETH', quantityAvailable: 4
            }
          }
          const q: QuantityAdjustments = {
            'BTC': -0.1,
            'ETH': 1
          }
          it('should buy ETH with BTC via product ETH/BTC', () => {
            const plan = reduceAdjustmentsToAnOrderExecutionPlan(s, p, q, h, fx)
            expect(plan.buys.length).to.equal(1)
            expect(plan.sells.length).to.equal(0)
            expect(plan.buys[0].symbol).to.equal('ETH/BTC')
            expect(plan.buys[0].qty).to.equal(1)
          })
        })
        describe('with current holdings: 40% BTC / 60% ETH', () => {
          const p: IPortfolioRecord = {
            id: 'abc',
            name: 'abc',
            userID: 'abc',
            allocations: {
              'BTC': .5,
              'ETH': .5
            },
            baseCurrency: 'USD',
            quoteCurrency: 'USD',
            exchangeID: 'GDAX'
          }
          const h: PortfolioHoldings = {
            'BTC': {
              id: 'BTC', quantityAvailable: .4
            },
            'ETH': {
              id: 'ETH', quantityAvailable: 6
            }
          }
          const q: QuantityAdjustments = {
            'BTC': 0.1,
            'ETH': -1
          }
          it('should sell ETH for BTC via product ETH/BTC', () => {
            const plan = reduceAdjustmentsToAnOrderExecutionPlan(s, p, q, h, fx)
            console.log(plan)
            expect(plan.buys.length).to.equal(0)
            expect(plan.sells.length).to.equal(1)
            expect(plan.sells[0].symbol).to.equal('ETH/BTC')
            expect(plan.sells[0].qty).to.equal(1)
          })
        })
      })
      describe('with desired portfolio allocations: 25% BTC / 25% ETH / 25% USD / 25% LTC', () => {
        const p: IPortfolioRecord = {
          id: 'abc',
          name: 'abc',
          userID: 'abc',
          allocations: {
            'BTC': .25,
            'ETH': .25,
            'LTC': .25,
            'USD': .25
          },
          baseCurrency: 'USD',
          quoteCurrency: 'USD',
          exchangeID: 'GDAX'
        }
        describe('with current holdings: 25% BTC / 25% ETH / 40% USD / 10% LTC', () => {
          const h: PortfolioHoldings = {
            'BTC': { id: 'BTC', quantityAvailable: 2.5 }, // $25,000
            'ETH': { id: 'ETH', quantityAvailable: 25 }, // $25,000
            'LTC': { id: 'LTC', quantityAvailable: 100 }, // $10,000
            'USD': { id: 'USD', quantityAvailable:  40000 }
          }
          const q = rebalancingCalculators.reduceHoldingsToRebalancingAdjustments(fx, p, h)
          const plan = reduceAdjustmentsToAnOrderExecutionPlan(s, p, q, h, fx)
          it('should buy LTC with USD via LTC/USD', () => {
            const ltcUsdOrder = plan.buys.find(b => b.symbol === 'LTC/USD')
            expect(ltcUsdOrder).to.exist
            expect(ltcUsdOrder.qty).to.equal(150)
          })
          it('should not plan any other orders', () => {
            expect(plan.buys.length).to.equal(1)
            expect(plan.sells.length).to.equal(0)
          })
        })
        describe('with current holdings: 50% BTC / 10% ETH / 20% USD / 20% LTC', () => {
          const h: PortfolioHoldings = {
            'BTC': { id: 'BTC', quantityAvailable: 5 }, // $50,000
            'ETH': { id: 'ETH', quantityAvailable: 10 }, // $10,000
            'LTC': { id: 'LTC', quantityAvailable: 200 }, // $20,000
            'USD': { id: 'USD', quantityAvailable:  20000 }
          }
          const q = rebalancingCalculators.reduceHoldingsToRebalancingAdjustments(fx, p, h)
          const plan = reduceAdjustmentsToAnOrderExecutionPlan(s, p, q, h, fx)
          console.log('-----')
          console.log(q)
          console.log(plan)
          it('should buy ETH with BTC via ETH/BTC', () => {
            const ethBtcOrder = plan.buys.find(b => b.symbol === 'ETH/BTC')
            expect(ethBtcOrder).to.exist
          })
          it('should sell BTC for USD via BTC/USD', () => {
            const btcUsdOrder = plan.sells.find(b => b.symbol === 'BTC/USD')
            expect(btcUsdOrder).to.exist
          })
          it('should sell BTC for LTC via LTC/BTC', () => {
            const ltcBtcOrder = plan.sells.find(b => b.symbol === 'LTC/BTC')
            expect(ltcBtcOrder).to.exist
          })
          it('should not plan any other orders', () => {

          })
        })
        // describe('with current holdings: 50% BTC / 40% ETH / 10% USD ', () => {
        //   it('should sell BTC for USD via BTC/USD', () => {
  
        //   })
        //   it('should sell ETH for USD via ETH/USD', () => {
  
        //   })
        // })
        // describe('with current holdings: 20% BTC / 70% ETH / 10% USD', () => {
        //   it('should sell ETH for BTC via ETH/BTC', () => {
  
        //   })
        //   it('should sell ETH for USD via ETH/USD', () => {
  
        //   })
        // })
        // describe('with current holdings: 40% BTC / 40% ETH / 20% USD', () => {
        //   it('should sell BTC for USD via BTC/USD', () => {
  
        //   })
        //   it('should sell ETH for USD via ETH/USD', () => {
  
        //   })
        // })
      })
    })
  })
})