import * as portfolioCalculators from '../../src/portfolio-calculators'
import { Portfolio, Allocations, ProductID } from '../../src/types';
import { expect } from 'chai';
import { createMockPortfolio } from '../test-helpers'

describe('portfolio-calculator unit tests', () => {
  describe('roundToMinimumOrderSize', () => {
    const mockPositionInfo = [
      { 
        productID: 'BTC-USD' as ProductID, currentPrice: 10000,
        minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1
      }
    ]
    const p = createMockPortfolio('USD', 'USD', mockPositionInfo)

    it('should round a quantity smaller than the minimum tradable size to 0', () => {
      const quantity = portfolioCalculators.roundToMinimumOrderSize(p, 'BTC-USD', 0.0001)
      expect(quantity).to.equal(0)
    })
    it('should round down a quantity with a smaller decimal than the minimum tradable size', () => {
      const quantity = portfolioCalculators.roundToMinimumOrderSize(p, 'BTC-USD', 10.0001)
      expect(quantity).to.equal(10)
    })
    it('should round up a quantity', () => {
      const quantity = portfolioCalculators.roundToMinimumOrderSize(p, 'BTC-USD', 10.0009)
      expect(quantity).to.equal(10.001)
    })
    it('should not round if the quantity is above the minimum size', () => {
      const quantity = portfolioCalculators.roundToMinimumOrderSize(p, 'BTC-USD', 10.1)
      expect(quantity).to.equal(10.1)
    })
  })
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
        'BTC-USD': 0.5,
        'ETH-USD': 0.25
      }

      const desiredBtcBalance = portfolioCalculators.desiredBalanceInBaseCurrency(p, a, 'BTC-USD', 10000)
      const desiredEthBalance = portfolioCalculators.desiredBalanceInBaseCurrency(p, a, 'ETH-USD', 10000)

      expect(desiredBtcBalance).to.be.equal(5000)
      expect(desiredEthBalance).to.be.equal(2500)
    })
  })
  describe('convertToBalanceInBaseCurrency', () => {
    it('should use the fxToBaseCurrency rate and quantity to determine the balance in base', () => {
      const p: Portfolio = {
        holdings: {},
        products: {},
        tickers: {
          'BTC-USD': { currentPrice: 11500 }
        },
        fxToBaseCurrency: {
          'BTC-USD': 1
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD'
      }

      const balanceInBase = portfolioCalculators.convertToBalanceInBaseCurrency(p, 'BTC-USD', 2)

      expect(balanceInBase).to.equal(23000)
    })
  })
  describe('quantityAdjustmentForRebalancing', () => {
    const mockPositionInfo = [
      { 
        productID: 'BTC-USD' as ProductID, currentPrice: 10000,
        minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 2 
      },
      { 
        productID: 'ETH-USD' as ProductID, currentPrice: 500,
        minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 10
      }
    ]
    const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
    const a: Allocations = {
      'BTC-USD': .5,
      'ETH-USD': .5
    }
    it('should return a negative quantity if the position is currently over allocated', () => {
      const adjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, 'BTC-USD')
      expect(adjustment).to.equal(-0.75)
    })
    it('should return a positive quantity if the position is currently under allocated', () => {
      const adjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p, a, 'ETH-USD')
      expect(adjustment).to.equal(15)
    })
    it('should return a 0 adjustment if the position is currently allocated correctly', () => {
      const mockPositionInfo1 = [
        { 
          productID: 'BTC-USD' as ProductID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1.25
        },
        { 
          productID: 'ETH-USD' as ProductID, currentPrice: 500,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 25
        }
      ]
      const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1)
      const a1: Allocations = {
        'BTC-USD': .5,
        'ETH-USD': .5
      }

      const ethAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'ETH-USD')
      const btcAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'BTC-USD')

      expect(ethAdjustment).to.equal(0, 'ETH should need no adjustment')
      expect(btcAdjustment).to.equal(0, 'BTC should need no adjustment')
    })
    it('should return a 0 adjustment if the adjustment would be less than the minimum order size', () => {
      const mockPositionInfo1 = [
        { 
          productID: 'BTC-USD' as ProductID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1.250001
        },
        { 
          productID: 'ETH-USD' as ProductID, currentPrice: 500,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 25.005
        }
      ]
      const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1)
      const a1: Allocations = {
        'BTC-USD': .5,
        'ETH-USD': .5
      }

      const ethAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'ETH-USD')
      const btcAdjustment = portfolioCalculators.quantityAdjustmentForRebalancing(p1, a1, 'BTC-USD')

      expect(ethAdjustment).to.equal(0, 'ETH should need no adjustment')
      expect(btcAdjustment).to.equal(0, 'BTC should need no adjustment')
    })
  })
  describe('calculateTotalPortfolioValueInBaseCurrency', () => {
    it('should convert each position balance to base currency and add them up', () => {
      const mockPositionInfo1 = [
        { 
          productID: 'BTC-USD' as ProductID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 2
        },
        { 
          productID: 'ETH-USD' as ProductID, currentPrice: 500,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 10
        },
        { 
          productID: 'LTC-USD' as ProductID, currentPrice: 100,
          minimumOrderSize: 0.01, fxToBaseCurrency: 1, quantityAvailable: 50
        }
      ]
      const p1 = createMockPortfolio('USD', 'USD', mockPositionInfo1)

      const totalValue = portfolioCalculators.calculateTotalPortfolioValueInBaseCurrency(p1)

      expect(totalValue).to.equal(30000)
    })
  })
})