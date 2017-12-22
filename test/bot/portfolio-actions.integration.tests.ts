import { Store } from 'redux'

import * as portfolioRepository from '../../src/shared/portfolio-repository'
import * as portfolioActions from '../../src/bot/portfolio-actions'
import { createBotStore } from '../../src/bot/store'
import { BotState } from '../../src/bot/bot-reducer'
import { expect } from 'chai';
import { firebaseDb } from '../../src/shared/firebase-singletons';

describe('portfolio actions integration tests', () => {
  let store: Store<BotState>
  beforeEach(async () => {
    await firebaseDb.ref('/portfolios').remove()
    store = createBotStore()
  })
  describe('loadAllPortfolios', () => {
    it('should retrieve all portfolios from a DB and load them into state', async () => {
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

      await store.dispatch(portfolioActions.loadAllPortfolios())

      const state = store.getState()
      expect(state.portfolios.length).to.equal(2)
      expect(state.portfolios.find(x => x.name === 'test portfolio 1')).to.exist
      expect(state.portfolios.find(x => x.name === 'test portfolio 2')).to.exist
      expect(state.portfoliosQueuedForRebalance.length).to.equal(2)
    })
  })
  describe('rebalancePortfolios', () => {
    it('should execute orders to rebalance each portfolio in state', async () => {
      // TODO
      // await portfolioRepository.createPortfolio(
      //   'test portfolio 1', 'userABC', 'GDAX',
      //   {
      //     'BTC': .2, 'ETH': .4, 'USD': .4
      //   }
      // )
      // await portfolioRepository.createPortfolio(
      //   'test portfolio 2', 'userABC', 'GDAX',
      //   {
      //     'BTC': .2, 'ETH': .4, 'USD': .4
      //   }
      // )
      // await store.dispatch(portfolioActions.loadAllPortfolios())

      // await store.dispatch(portfolioActions.rebalancePortfolios())
    })
  })
})