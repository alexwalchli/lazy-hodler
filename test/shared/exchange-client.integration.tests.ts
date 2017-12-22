import { expect } from 'chai'

import * as exchangeClient from '../../src/shared/exchange-client'
import * as testAuthData from '../../exclude/exchange-auth-data'
import { PortfolioHoldings, IExchangeAuthRecord } from '../../src/shared/types'

describe('exchange-client integration tests', () => {
  describe('getHoldings', () => {
    it('should retrieve balances over HTTPS and normalize them', (done) => {
      const auth: IExchangeAuthRecord = testAuthData.exchangeAuthData.live.gdax
      exchangeClient.getHoldings(auth).then((h: PortfolioHoldings) => {
        Object.keys(h).forEach((k) => {
          expect(h[k].id).to.equal(k)
          expect(Number.isNaN(h[k].quantityAvailable)).to.be.false
        })
        done()
      }).catch((e) => {
        throw new Error(e)
      })
    })
  })
  describe('getExchangeProducts', () => {
    it('should retreive products over HTTPS and normalize them', (done) => {
      exchangeClient.getExchangeProducts().then((products) => {
        expect(Object.keys(products).length).to.equal(9, 'should contain all products(9 for GDAX)')
        Object.keys(products).forEach((symbol) => {
          expect(products[symbol].symbol).to.equal(symbol)
          expect(products[symbol].base).to.be.string
          expect(products[symbol].quote).to.be.string
          expect(products[symbol].id).to.be.string
          expect(Number.isNaN(products[symbol].minimumOrderSize)).to.be.false
        })
        done()
      }).catch((e) => {
        throw new Error(e)
      })
    })
  })
})