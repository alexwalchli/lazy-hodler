import { PriceFeedManager } from '../../src/price-feed-manager'
import {stub} from 'sinon'
import { expect } from 'chai'
import * as exchangeClientFactory from '../../src/exchange-client-factory';
import { ProductID } from '../../src/types';

describe('price-feed-manager unit tests', () => {
  describe('maybeSubscribeTo', () => {
    let priceFeedManager: PriceFeedManager
    let websocketClientFactoryStub
    beforeEach(() => {
      priceFeedManager = new PriceFeedManager()
      websocketClientFactoryStub = 
        stub(exchangeClientFactory, 'buildWebsocketClient').returns({ on: (s: String) => {}})
    })
    afterEach(() => {
      websocketClientFactoryStub.restore()
    })
    it('should create a single websocket client for all products to subscribe to', () => {
      const productIDs = ['BTC-USD', 'ETH-USD'] as Array<ProductID>
      priceFeedManager.maybeSubscribeTo(productIDs)

      expect(websocketClientFactoryStub).calledWith(productIDs)
    })
    it('should add a price subscription to priceFeedManagerState if one already exists', () => {
      priceFeedManager.maybeSubscribeTo(['BTC-USD', 'ETH-USD'])

      const btcUsdSub = priceFeedManager.state.subscriptions['BTC-USD']
      const ethUsdSub = priceFeedManager.state.subscriptions['ETH-USD']

      expect(btcUsdSub).to.exist
      expect(ethUsdSub).to.exist
      expect(btcUsdSub.productID).to.equal('BTC-USD')
      expect(ethUsdSub.productID).to.equal('ETH-USD')
    })
    it('should not create a new price subscription to priceFeedManagerState if it already exists', () => {
      priceFeedManager.maybeSubscribeTo(['BTC-USD'])
      const btcUsdSub = priceFeedManager.state.subscriptions['BTC-USD']
      priceFeedManager.maybeSubscribeTo(['BTC-USD'])
      expect(priceFeedManager.state.subscriptions['BTC-USD']).to.equal(btcUsdSub)
    })
    it('should resolve its promise after all price feeds have received at least 1 ticker', () => {

    })
    it('should reject its promise if not all price feeds have received a ticker after 1 minute', () => {
      
    })
  })
})