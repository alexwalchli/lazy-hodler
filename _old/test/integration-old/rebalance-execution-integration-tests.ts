// import {stub} from 'sinon'
// // import {expect} from 'chai'

// import * as orderExecution from '../../src/order-execution'
// import * as portfolioService from '../../src/portfolio-service'
// import * as rebalanceExecution from '../../src/bot/rebalance-execution'
// import { Allocations, UserExchangeAuthData, Portfolio } from '../../src/types';
// import { expect } from 'chai';

// describe('rebalance-execution integration', () => {
//   const fakeExchangeAuthData: UserExchangeAuthData = {
//     authInfo: {apiKey: '123', passphrase: '123', secret: '123'},
//     exchangeID: 'GDAX', userID: 'user123'
//   }
//   const allocations: Allocations = {
//     'BTC': .5,
//     'ETH': .3,
//     'LTC': .1,
//     'USD': .1
//   }
//   const portfolio: Portfolio = {
//     tickers: {
//       'BTC': { currentPrice: 15000 },
//       'ETH': { currentPrice: 450 },
//       'LTC': { currentPrice: 100 }
//     },
//     products: {
//       'BTC/USD': {base: 'BTC', minimumOrderSize: 0.01, id: 'BTC-USD', symbol: 'BTC/USD', quote: 'USD'},
//       'ETH/USD': {base: 'ETH', minimumOrderSize: 0.01, id: 'ETH-USD', symbol: 'ETH/USD', quote: 'USD'},
//       'LTC/USD': {base: 'LTC', minimumOrderSize: 0.01, id: 'LTC-USD', symbol: 'LTC/USD', quote: 'USD'}
//     },
//     holdings: {
//       'BTC': {id: 'BTC', quantityAvailable: 1},
//       'ETH': {id: 'ETH', quantityAvailable: 1},
//       'LTC': {id: 'LTC', quantityAvailable: 1}
//     },
//     baseCurrency: 'USD',
//     quoteCurrency: 'USD',
//     fxToBaseCurrency: {
//       'BTC': 1,
//       'ETH': 1,
//       'LTC': 1
//     }
//   }
//   describe('with rebalancing calculations and placing correct orders', () => { 
//     let getPortfolio
//     let sellAtMarket
//     let buyAtMarket
//     afterEach(() => {
//       getPortfolio.restore()
//       sellAtMarket.restore()
//       buyAtMarket.restore()
//     })
//     it('should retrieve a portfolio and use specified allocations to execute a rebalance', (done) => {
//       getPortfolio = stub(portfolioService, 'getPortfolio')
//         .returns(Promise.resolve(portfolio))
//       sellAtMarket = stub(orderExecution, 'sellAtMarket')
//         .returns(Promise.resolve(true))
//       buyAtMarket = stub(orderExecution, 'buyAtMarket')
//         .returns(Promise.resolve(true))

//       rebalanceExecution.maybeRebalancePortfolio(fakeExchangeAuthData, allocations).then((result) => {
//         expect(buyAtMarket).to.be.called
//         expect(buyAtMarket).to.be.calledWith('ETH/USD', 9.37)
//         expect(buyAtMarket).to.be.calledWith('LTC/USD', 14.55)
//         expect(sellAtMarket).to.be.calledWith('BTC/USD', -0.48)
//         expect(result).to.be.true
//         done()
//       })
//     })
//     it('should handle an exchange error, halt rebalancing and return false', (done) => {
//       getPortfolio = stub(portfolioService, 'getPortfolio')
//         .returns(Promise.resolve(portfolio))
//       sellAtMarket = stub(orderExecution, 'sellAtMarket')
//         .returns(Promise.resolve(true))
//       buyAtMarket = stub(orderExecution, 'buyAtMarket').throws('error at exchange')

//       rebalanceExecution.maybeRebalancePortfolio(fakeExchangeAuthData, allocations).then((result) => {
//         expect(sellAtMarket).to.be.calledOnce
//         expect(buyAtMarket).to.be.calledOnce

//         expect(result).to.be.false

//         done()
//       })
//     })
//     it('should catch non-exchange errors and return false', (done) => {
//       getPortfolio = stub(portfolioService, 'getPortfolio')
//         .throws("some error")

//       rebalanceExecution.maybeRebalancePortfolio(fakeExchangeAuthData, allocations).then((result) => {
//         expect(result).to.be.false
//         done()
//       })
//     })
//   })
// })