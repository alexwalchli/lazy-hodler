import * as portfolioRepository from '../../src/shared/portfolio-repository'
import { expect } from 'chai';
import { firebaseDb } from '../../src/shared/firebase-singletons'

describe('portfolio-repository', () => {
  beforeEach(async () => {
    await firebaseDb.ref('/portfolios').remove()
  })
  describe('getAllPortfolios', async () => {
    it('should return portfolios as an array', async () => {
      await portfolioRepository.createPortfolio(
        'test portfolio 1', 'userABC', 'GDAX',
        {
          'BTC': .2, 'ETH': .4, 'USD': .4
        }
      )
      await portfolioRepository.createPortfolio(
        'test portfolio 2', 'userABC', 'GDAX',
        {
          'BTC': .2, 'ETH': .4, 'USD': .4
        }
      )

      const portfolios = await portfolioRepository.getAllPortfolios()
      
      const p = portfolios[0]
      expect(portfolios.length).to.equal(2)
      expect(p).to.exist
      expect(Object.keys(p.allocations).length).to.equal(3)
      expect(p.allocations['BTC']).to.equal(.2)
      expect(p.allocations['ETH']).to.equal(.4)
      expect(p.allocations['USD']).to.equal(.4)
      expect(p.baseCurrency).to.equal('USD')
      expect(p.quoteCurrency).to.equal('USD')
      expect(p.exchangeID).to.equal('GDAX')
      expect(p.userID).to.equal('userABC')
    })
  })
  describe('createPortfolio', () => {
    it('should create a portfolio in the database', async () => {
      const portfolioID = await portfolioRepository.createPortfolio(
        'test portfolio', 'userABC', 'GDAX',
        {
          'BTC': .2, 'ETH': .4, 'USD': .4
        }
      )
      const portfolios = await portfolioRepository.getAllPortfolios()
      const p = portfolios.find(x => x.id === portfolioID)
      expect(p).to.exist
      expect(Object.keys(p.allocations).length).to.equal(3)
      expect(p.allocations['BTC']).to.equal(.2)
      expect(p.allocations['ETH']).to.equal(.4)
      expect(p.allocations['USD']).to.equal(.4)
      expect(p.baseCurrency).to.equal('USD')
      expect(p.quoteCurrency).to.equal('USD')
      expect(p.exchangeID).to.equal('GDAX')
      expect(p.id).to.equal(portfolioID)
      expect(p.userID).to.equal('userABC')
    })
  })
})