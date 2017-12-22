
// import {spy} from 'sinon'
import {expect} from 'chai'

// import {executeRebalance} from '../../src/bot/rebalance-execution'
import * as rebalancing from '../../src/bot/rebalance-execution'
import { Allocations, CurrencyID, UserExchangeAuthData } from '../../src/types';
import { createMockPortfolio } from '../test-helpers';

describe("rebalance-execution unit tests", () => {
  const fakeAuth: UserExchangeAuthData = {
    authInfo: { apiKey: '123', passphrase: '123', secret: 'abc' },
    exchangeID: 'GDAX', userID: 'user123'
  }
  
  describe("reduceAdjustmentsToOrderExecution", () => {
    it('should use the base portfolio currency and each currency adjustment to find an exchange symbol for the orders', () => {
      const mockPositionInfo = [
        { 
          currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
          minimumOrderSize: 0.0001, fxToBaseCurrency: 1, quantityAvailable: 2
        },
        { 
          currencyID: 'ETH' as CurrencyID, currentPrice: 400,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 25
        },
        { 
          currencyID: 'LTC' as CurrencyID, currentPrice: 100,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 100
        }
      ]
      const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
      const allocations: Allocations = {
        'BTC': 0.333333,
        'LTC': 0.333333,
        'ETH': 0.333333
      }
      const adjustments = rebalancing.reduceCurrentHoldingsToRebalancedQuantities(p, allocations)

      const orderExecution = rebalancing.reduceAdjustmentsToOrderExecution(p, adjustments, fakeAuth)

      // TODO

      expect(orderExecution).to.exist
    })
    describe('with desired portfolio allocations: 50% BTC / 50% ETH', () => {
      describe('with current holdings: 60% BTC / 40% ETH', () => {
        it('should buy ETH with BTC via product ETH/BTC', () => {
          
        })
      })
      describe('with current holdings: 40% BTC / 60% ETH', () => {
        it('should sell ETH for BTC via product ETH/BTC', () => {
          
        })
      })
      describe('no rebalancing adjustments are necessary', () => {
        it('should not create any orders', () => {

        })
      })
    })
    describe('with desired portfolio allocations: 33% BTC / 33% ETH / 33% USD', () => {
      describe('with current holdings: 25% BTC / 25% ETH / 50% USD', () => {
        it('should buy ETH with USD via ETH/USD', () => {

        })
        it('should buy BTC with USD via BTC/USD', () => {

        })
      })
      describe('with current holdings: 50% BTC / 25% ETH / 25% USD', () => {
        it('should buy ETH with BTC via ETH/BTC', () => {

        })
        it('should sell BTC for USD via BTC/USD', () => {

        })
      })
      describe('with current holdings: 50% BTC / 40% ETH / 10% USD ', () => {
        it('should sell BTC for USD via BTC/USD', () => {

        })
        it('should sell ETH for USD via ETH/USD', () => {

        })
      })
      describe('with current holdings: 20% BTC / 70% ETH / 10% USD', () => {
        it('should sell ETH for BTC via ETH/BTC', () => {

        })
        it('should sell ETH for USD via ETH/USD', () => {

        })
      })
      describe('with current holdings: 40% BTC / 40% ETH / 20% USD', () => {
        it('should sell BTC for USD via BTC/USD', () => {

        })
        it('should sell ETH for USD via ETH/USD', () => {

        })
      })
    })
    // describe("executeRebalance", () => {
  })
  //   it("should execute sell orders first then buy orders", (done) => {
  //     const sellOrder1 = spy(() => Promise.resolve(true))
  //     const sellOrder2 = spy(() => Promise.resolve(true))
  //     const buyOrder1 = spy(() => Promise.resolve(true))
  //     const buyOrder2 = spy(() => Promise.resolve(true))
  //     const re: RebalanceExecution = {
  //       sellOrders: [
  //         sellOrder1, sellOrder2
  //       ],
  //       buyOrders: [
  //         buyOrder1, buyOrder2
  //       ]
  //     }
  
  //     const p = executeRebalance(re)

  //     p.then((sellResponses) => {
  //       expect(sellOrder1).to.be.calledOnce
  //       expect(sellOrder2).to.be.calledOnce
  //       expect(sellOrder1).to.be.calledBefore(buyOrder1)
  //       expect(sellOrder2).to.be.calledBefore(buyOrder2)
  //       expect(buyOrder1).to.be.called
  //       expect(buyOrder2).to.be.called
  //       done()
  //     })
  //   })
  // })
})