import * as portfolioCalculators from '../../src/portfolio-calculators'
import { Portfolio, Allocations, CurrencyID } from '../../src/types';
import { expect } from 'chai';
import { createMockPortfolio } from '../test-helpers'

describe('portfolio-calculator unit tests', () => {
  describe('desiredBalanceInBaseCurrency', () => {
    it('should use the allocations and current total portfolio balance to determine new desired balnce', () => {
      const p: Portfolio = {
        holdings: {},
        products: {},
        tickers: {},
        fxToBaseCurrency: {},
        baseCurrency: 'USD',
        quoteCurrency: 'USD'
      }
      const a: Allocations = {
        'BTC': 0.5,
        'ETH': 0.25
      }

      const desiredBtcBalance = portfolioCalculators.desiredBalanceInBaseCurrency(p, a, 'BTC', 10000)
      const desiredEthBalance = portfolioCalculators.desiredBalanceInBaseCurrency(p, a, 'ETH', 10000)

      expect(desiredBtcBalance).to.be.equal(5000)
      expect(desiredEthBalance).to.be.equal(2500)
    })
    it('base currency should not convert', () => {
      const p: Portfolio = {
        holdings: {},
        products: {},
        tickers: {},
        fxToBaseCurrency: {},
        baseCurrency: 'USD',
        quoteCurrency: 'USD'
      }
      const a: Allocations = {
        'BTC': 0.5,
        'ETH': 0.25,
        'USD': 0.25
      }

      const desiredUsdBalance = portfolioCalculators.desiredBalanceInBaseCurrency(p, a, 'USD', 10000)

      expect(desiredUsdBalance).to.be.equal(2500)
    })
  })
  describe('quantityAdjustmentForRebalancing', () => {
    const mockPositionInfo = [
      { 
        currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
        minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 2 
      },
      { 
        currencyID: 'ETH' as CurrencyID, currentPrice: 500,
        minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 10
      }
    ]
    const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
    const a: Allocations = {
      'BTC': .5,
      'ETH': .5
    }
    it('should return a negative quantity if the position is currently over allocated', () => {
      const adjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, 'BTC')
      expect(adjustment).to.equal(-0.75)
    })
    it('should return a positive quantity if the position is currently under allocated', () => {
      const adjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, 'ETH')
      expect(adjustment).to.equal(15)
    })
    it('should return a 0 adjustment if the position is currently allocated correctly', () => {
      const mockPositionInfo1 = [
        { 
          currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1.25
        },
        { 
          currencyID: 'ETH' as CurrencyID, currentPrice: 500,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 25
        }
      ]
      const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1)
      const a1: Allocations = {
        'BTC': .5,
        'ETH': .5
      }

      const ethAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'ETH')
      const btcAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'BTC')

      expect(ethAdjustment).to.equal(0, 'ETH should need no adjustment')
      expect(btcAdjustment).to.equal(0, 'BTC should need no adjustment')
    })
    it('should return a 0 adjustment if the adjustment would be less than the minimum order size', () => {
      const mockPositionInfo1 = [
        { 
          currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1.250001
        },
        { 
          currencyID: 'ETH' as CurrencyID, currentPrice: 500,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 25.005
        }
      ]
      const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1)
      const a1: Allocations = {
        'BTC': .5,
        'ETH': .5
      }

      const ethAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'ETH')
      const btcAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'BTC')

      expect(ethAdjustment).to.equal(0, 'ETH should need no adjustment')
      expect(btcAdjustment).to.equal(0, 'BTC should need no adjustment')
    })
    describe('when allocations contain fiat', () => {
      it('should adjust correctly', () => {
        const mockPositionInfo1 = [
          { 
            currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
            minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1
          },
          { 
            currencyID: 'ETH' as CurrencyID, currentPrice: 500,
            minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 25
          }
        ]
        const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1, 2000)
        const a1: Allocations = {
          'BTC': .4,
          'ETH': .4,
          'USD': .2
        }
  
        const ethAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'ETH')
        const btcAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'BTC')
        const usdAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'USD')
  
        expect(ethAdjustment).to.equal(-5.4)
        expect(btcAdjustment).to.equal(-0.02)
        expect(usdAdjustment).to.equal(2900)
      })
    })
  })
  describe('calculateTotalPortfolioValueInBaseCurrency', () => {
    it('should convert each position balance to base currency and add them up', () => {
      const mockPositionInfo1 = [
        { 
          currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 2
        },
        { 
          currencyID: 'ETH' as CurrencyID, currentPrice: 500,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 10
        },
        { 
          currencyID: 'LTC' as CurrencyID, currentPrice: 100,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 50
        }
      ]
      const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1, 10000)

      const totalValue = portfolioCalculators.calculateTotalPortfolioValueInBaseCurrency(p1)

      expect(totalValue).to.equal(40000)
    })
  })
})