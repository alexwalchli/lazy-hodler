import * as exchangeActions from '../../src/bot/exchange-actions'
import { createBotStore } from '../../src/bot/store'
import { BotState } from '../../src/bot/bot-reducer';
import { Store } from 'redux';
import { expect } from 'chai';

describe('exchange-actions unit tests', () => {
  let store: Store<BotState>;
  beforeEach(() => {
    store = createBotStore()
  })
  describe('loadAllGDAXMarkets', () => {
    it('should retrieve and load all GDAX markets into the store', async () => {
      await store.dispatch(exchangeActions.loadAllGDAXMarkets())
      const state = store.getState()
      expect(state.productsByExchange.GDAX).to.exist
    })
  })
  describe('subscribeAndManageGDAXPriceFeed', () => {
    it('should subscribe to prices and update the store with the latest', async () => {
      await store.dispatch(exchangeActions.loadAllGDAXMarkets())
      await store.dispatch(exchangeActions.subscribeAndManageGDAXPriceFeed())

      const state = store.getState()
      const btcUsdSub = state.prices['GDAX']['BTC-USD']
      const ethUsdSub = state.prices['GDAX']['ETH-USD']
      expect(btcUsdSub).to.exist
      expect(ethUsdSub).to.exist
      expect(Number.isNaN(btcUsdSub.lastPrice)).to.be.false
      expect(Number.isNaN(ethUsdSub.lastPrice)).to.be.false
    }).timeout(8000)
  })
})