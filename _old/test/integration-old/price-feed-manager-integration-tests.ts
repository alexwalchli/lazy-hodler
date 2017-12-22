import { expect } from 'chai';
import { PriceFeedManager } from '../../src/price-feed-manager';

describe('price feed manager integrates with exchanges over web sockets', () => {
  it('should connect to GDAX and update last price for each product', (done) => {
    const priceFeedManager = new PriceFeedManager()
    priceFeedManager
      .maybeSubscribeTo(['BTC-USD', 'ETH-USD'])
      .then(() => {
        const btcUsdSub = priceFeedManager.state.subscriptions['BTC-USD']
        const ethUsdSub = priceFeedManager.state.subscriptions['ETH-USD']
        expect(btcUsdSub).to.exist
        expect(ethUsdSub).to.exist
        expect(btcUsdSub.productID).to.equal('BTC-USD')
        expect(ethUsdSub.productID).to.equal('ETH-USD')
        expect(Number.isNaN(btcUsdSub.lastPrice)).to.be.false
        expect(Number.isNaN(ethUsdSub.lastPrice)).to.be.false
        done()
      })
  }).timeout(10000)
})