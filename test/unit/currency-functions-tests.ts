import * as currencyFunctions from '../../src/currency-functions'
import { Portfolio, CurrencyID } from '../../src/types';
import { expect } from 'chai';
import { createMockPortfolio } from '../test-helpers'

describe('currency-functions unit tests', () => {
  describe('roundToMinimumOrderSize', () => {
    describe('when a cryptocurrency', () => {
      const mockPositionInfo = [
        { 
          currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1
        }
      ]
      const p = createMockPortfolio('USD', 'USD', mockPositionInfo)
  
      it('should round a quantity smaller than the minimum tradable size to 0', () => {
        const quantity = currencyFunctions.roundToMinimumOrderSize(p, 'BTC', 0.0001)
        expect(quantity).to.equal(0)
      })
      it('should round down a quantity with a smaller decimal than the minimum tradable size', () => {
        const quantity = currencyFunctions.roundToMinimumOrderSize(p, 'BTC', 10.0001)
        expect(quantity).to.equal(10)
      })
      it('should round up a quantity', () => {
        const quantity = currencyFunctions.roundToMinimumOrderSize(p, 'BTC', 10.0009)
        expect(quantity).to.equal(10.001)
      })
      it('should not round if the quantity is above the minimum size', () => {
        const quantity = currencyFunctions.roundToMinimumOrderSize(p, 'BTC', 10.1)
        expect(quantity).to.equal(10.1)
      })
    })
    describe('when fiat', () => {
      const mockPositionInfo = [
        { 
          currencyID: 'BTC' as CurrencyID, currentPrice: 10000,
          minimumOrderSize: 0.001, fxToBaseCurrency: 1, quantityAvailable: 1
        }
      ]
      const p = createMockPortfolio('USD', 'USD', mockPositionInfo, 1000)
      it('should not round', () => {
        const quantity = currencyFunctions.roundToMinimumOrderSize(p, 'USD', 1000)
        expect(quantity).to.equal(1000)
      })
    })
  })
  describe('convertToBalanceInBaseCurrency', () => {
    it('should use the fxToBaseCurrency rate and quantity to determine the balance in base', () => {
      const p: Portfolio = {
        holdings: {},
        products: {},
        tickers: {
          'BTC': { currentPrice: 11500 }
        },
        fxToBaseCurrency: {
          'BTC': 1
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD'
      }

      const balanceInBase = currencyFunctions.convertToBalanceInBaseCurrency(p, 'BTC', 2)

      expect(balanceInBase).to.equal(23000)
    })
    describe('when base currency', () => {
      it('should return the same value back', () => {
        const p: Portfolio = {
          holdings: {},
          products: {},
          tickers: {
            'BTC': { currentPrice: 11500 }
          },
          fxToBaseCurrency: {
            'BTC': 1,
            'USD': 1
          },
          baseCurrency: 'USD',
          quoteCurrency: 'USD'
        }
  
        const balanceInBase = currencyFunctions.convertToBalanceInBaseCurrency(p, 'USD', 2000)
  
        expect(balanceInBase).to.equal(2000)
      })
    })
  })
})