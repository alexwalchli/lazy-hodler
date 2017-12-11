import * as portfolioService from '../../src/portfolio-service'
import {exchangeAuthData} from '../../exclude/exchange-auth-data'
import { expect } from 'chai';

describe('portfolio-service integrates with exchanges over HTTP', () => {
  describe('getPortfolio', () => {
    it('should retrieve portfolio data', async () => {
      const p = await portfolioService.getPortfolio(exchangeAuthData.sandbox.gdax);

      expect(p.baseCurrency).to.equal('USD', 'only supporting USD base at the moment')
      expect(p.quoteCurrency).to.equal('USD', 'only supporting USD quote at the moment')

      expect(Object.keys(p.tickers).length)
        .to.equal(3, "retrieves current price for each allocation")  
      Object.keys(p.tickers).forEach((k) => {
        expect(Number.isNaN(p.tickers[k].currentPrice)).to.be.false
      })

      expect(Object.keys(p.fxToBaseCurrency).length).to.equal(3, 'should only contain allocated currencies')
      Object.keys(p.fxToBaseCurrency).forEach((k) => {
        expect(p.fxToBaseCurrency[k]).to.equal(
          1,
          'all fx rates should be 1 while we only support coins denominated in USD and a portfolio denominated in USD'
        )
      })

      expect(Object.keys(p.products).length).to.equal(3, 'should only contain allocated currencies')
      Object.keys(p.products).forEach((productID) => {
        expect(Number.isNaN(p.products[productID].minimumOrderSize)).to.be.false
      })

      Object.keys(p.holdings).forEach((k) => {
        expect(p.holdings[k].id).to.equal(k)
        expect(Number.isNaN(p.holdings[k].quantityAvailable)).to.be.false
      })

    }).timeout(8000)
  })
})