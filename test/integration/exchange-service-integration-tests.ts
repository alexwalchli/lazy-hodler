import * as exchangeService from '../../src/exchange-service'
import {exchangeAuthData} from '../../exclude/exchange-auth-data'
import { expect } from 'chai';

describe('exchange-service', () => {
  describe('getPortfolio', () => {
    it('should retrieve portfolio data', async () => {
      const p = await exchangeService.getPortfolio(exchangeAuthData.gdax);

      expect(p.baseCurrency).to.equal('USD', 'only supporting USD base at the moment')
      expect(p.quoteCurrency).to.equal('USD', 'only supporting USD quote at the moment')

      expect(Object.keys(p.tickers).length)
        .to.equal(3, "retrieves current price for each allocation")  
      Object.keys(p.tickers).forEach((k) => {
        expect(Number.isNaN(p.tickers[k].currentPrice)).to.be.false
      })

      expect(Object.keys(p.fxToBaseCurrency).length).to.equal(3)
      Object.keys(p.fxToBaseCurrency).forEach((k) => {
        expect(p.fxToBaseCurrency[k]).to.equal(
          1,
          'all fx rates should be 1 while we only support coins denominated in USD and a portfolio denominated in USD'
        )
      })
    }).timeout(5000)
  })
})