
import {spy} from 'sinon'
import {expect} from 'chai'

import {RebalanceExecution, executeRebalance} from '../../src/rebalance-execution'
import * as rebalancing from '../../src/rebalance-execution'
import { Allocations, CurrencyID } from '../../src/types';
import { createMockPortfolio } from '../test-helpers';

describe("rebalance-execution unit tests", () => {
  describe("calculatePortfolioQuantityAdjustments", () => {
    describe("portfolio that needs rebalancing", () => {
      it("evenly split allocations", () => {
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

        const adjustments = rebalancing.calculatePortfolioQuantityAdjustments(p, allocations);

        expect(adjustments['BTC']).to.be.equal(-0.6667)
        expect(adjustments['ETH']).to.be.equal(8.333)
        expect(adjustments['LTC']).to.be.equal(33.33)
      })
      it("unevenly split allocations", () => {
        const mockPositionInfo = [
          { 
            currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
            minimumOrderSize: 0.0001, fxToBaseCurrency: 1, quantityAvailable: 1
          },
          { 
            currencyID: 'ETH' as CurrencyID, currentPrice: 400,
            minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 20
          },
          { 
            currencyID: 'LTC' as CurrencyID, currentPrice: 90,
            minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 100
          }
        ]
        const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
        const allocations: Allocations = {
          'BTC': 0.5,
          'LTC': 0.1,
          'ETH': 0.4
        }

        const adjustments = rebalancing.calculatePortfolioQuantityAdjustments(p, allocations)
        
        expect(adjustments['BTC']).to.equal(0.35)
        expect(adjustments['ETH']).to.equal(7)
        expect(adjustments['LTC']).to.equal(-70)
      })
    })
    describe("portfolio that does not need rebalancing", () => {
      it("evenly split allocations", () => {
        const mockPositionInfo = [
          { 
            currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
            minimumOrderSize: 0.0001, fxToBaseCurrency: 1, quantityAvailable: 1
          },
          { 
            currencyID: 'ETH' as CurrencyID, currentPrice: 400,
            minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 25
          },
          { 
            currencyID: 'LTC' as CurrencyID, currentPrice: 90,
            minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 111.11
          }
        ]
        const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
        const allocations: Allocations = {
          'BTC': 0.333333,
          'LTC': 0.333333,
          'ETH': 0.333333
        }

        const adjustments = rebalancing.calculatePortfolioQuantityAdjustments(p, allocations);

        expect(adjustments['BTC']).to.be.equal(0)
        expect(adjustments['ETH']).to.be.equal(0)
        expect(adjustments['LTC']).to.be.equal(0)
      })
    })
  })
  describe("createBuyAndSells", () => {
    const mockPositionInfo = [
      { 
        currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
        minimumOrderSize: 0.0001, fxToBaseCurrency: 1, quantityAvailable: 1
      },
      { 
        currencyID: 'ETH' as CurrencyID, currentPrice: 400,
        minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 20
      },
      { 
        currencyID: 'LTC' as CurrencyID, currentPrice: 90,
        minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 100
      }
    ]
    const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
  
    const allocations: Allocations = {
      'BTC': 0.5,
      'LTC': 0.1,
      'ETH': 0.4
    }

    const adjustments = rebalancing.calculatePortfolioQuantityAdjustments(p, allocations)
    const orders = rebalancing.createBuyAndSells(p, adjustments)

    it("should create sell orders for positions that are over its allocation", () => {
      expect(orders.sellOrders.length).to.be.equal(1)
      expect(orders.sellOrders['LTC']).to.not.be.null
    })
    it("should create buy orders for positions that are under its allocation", () => {
      expect(orders.buyOrders.length).to.be.equal(2)
      expect(orders.sellOrders['BTC']).to.not.be.null
      expect(orders.sellOrders['ETH']).to.not.be.null
    })
  })
  describe("executeRebalance", () => {
    it("should execute sell orders first then buy orders", (done) => {
      const sellOrder1 = spy(() => Promise.resolve(true))
      const sellOrder2 = spy(() => Promise.resolve(true))
      const buyOrder1 = spy(() => Promise.resolve(true))
      const buyOrder2 = spy(() => Promise.resolve(true))
      const re: RebalanceExecution = {
        sellOrders: [
          sellOrder1, sellOrder2
        ],
        buyOrders: [
          buyOrder1, buyOrder2
        ]
      }
  
      const p = executeRebalance(re)

      p.then((sellResponses) => {
        expect(sellOrder1).to.be.calledOnce
        expect(sellOrder2).to.be.calledOnce
        expect(sellOrder1).to.be.calledBefore(buyOrder1)
        expect(sellOrder2).to.be.calledBefore(buyOrder2)
        expect(buyOrder1).to.be.called
        expect(buyOrder2).to.be.called
        done()
      })
    })
  })
})