import {stub} from 'sinon'
// import {expect} from 'chai'

import * as exchangeService from '../../src/exchange-service'
import * as rebalanceExecution from '../../src/rebalance-execution'
import { Allocations, UserExchangeAuthData, Portfolio } from '../../src/types';

describe('rebalance-execution integration', () => {
  const fakeExchangeAuthData: UserExchangeAuthData = {
    authInfo: {apiKey: '123', passphrase: '123', secret: '123'},
    exchangeID: 'GDAX', userID: 'user123'
  }
  const allocations: Allocations = {
    'BTC': .5,
    'ETH': .3,
    'LTC': .1,
    'USD': .1
  }
  const portfolio: Portfolio = {
    tickers: {
      'BTC': { currentPrice: 15000 },
      'ETH': { currentPrice: 450 },
      'LTC': { currentPrice: 100 }
    },
    products: {
      'BTC/USD': {base: 'BTC', minimumOrderSize: 0.01, id: 'BTC-USD', symbol: 'BTC/USD', quote: 'USD'},
      'ETH/USD': {base: 'ETH', minimumOrderSize: 0.01, id: 'ETH-USD', symbol: 'ETH/USD', quote: 'USD'},
      'LTC/USD': {base: 'LTC', minimumOrderSize: 0.01, id: 'LTC-USD', symbol: 'LTC/USD', quote: 'USD'}
    },
    holdings: {
      'BTC': {id: 'BTC', quantityAvailable: 1},
      'ETH': {id: 'ETH', quantityAvailable: 1},
      'LTC': {id: 'LTC', quantityAvailable: 1}
    },
    baseCurrency: 'USD',
    quoteCurrency: 'USD',
    fxToBaseCurrency: {
      'BTC': 1,
      'ETH': 1,
      'LTC': 1
    }
  }
  let getPortfolio
  let sellAtMarket
  let buyAtMarket
  beforeEach(() => {
    getPortfolio = stub(exchangeService, 'getPortfolio')
      .returns(Promise.resolve(portfolio))
    sellAtMarket = stub(exchangeService, 'sellAtMarket')
      .returns(Promise.resolve(true))
    buyAtMarket = stub(exchangeService, 'buyAtMarket')
      .returns(Promise.resolve(true))
  })
  describe('with rebalancing calculations and placing correct orders', () => {
    it('should retrieve a portfolio and use specified allocations to execute a rebalance', () => {
      rebalanceExecution.maybeRebalancePortfolio(fakeExchangeAuthData, allocations)
    })
  })
  afterEach(() => {
    getPortfolio.restore()
    sellAtMarket.restore()
    buyAtMarket.restore()
  })
})