import * as currencyOps from '../../src/shared/currency-operations'
import { expect } from 'chai'
import { ExchangeRates } from '../../src/shared/types'

describe('currency-operations unit tests', () => {
  describe('convertTo', () => {
    const fx: ExchangeRates = {
      USD: {
        BTC: 1/19000,
        USD: 1
      },
      BTC: {
        USD: 19000,
        BTC: 1
      }
    }
    it('should use the exchange rate and quantity to determine the balance in base', () => {
      const amountInUSD = currencyOps.convertTo(fx, { from: 'BTC', to: 'USD', fromQuantity: 2})
      expect(amountInUSD).to.equal(38000)
    })
    describe('when from and to are the same', () => {
      it('should return the entered quantity back', () => {
        const amountInUSD = currencyOps.convertTo(fx, { from: 'USD', fromQuantity: 1000, to: 'USD'})
        expect(amountInUSD).to.equal(1000)
      })
    })
  })
})