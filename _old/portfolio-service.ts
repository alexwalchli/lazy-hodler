import * as ccxt from 'ccxt'
import {
  UserExchangeAuthData,
  CurrencyID,
  Portfolio,
  UserID,
  Allocations,
  ExchangeSymbol,
  ProductTickers,
  ProductID
} from "./types";
import { buildExchangeClient } from "./exchange-client-factory";
import { getTradeableCurrencies } from './currency-functions';

export const getAllocations = async (userID: UserID): Promise<Allocations> => {
  // TODO: Make a call to Firebase. Stubbed for now
  return Promise.resolve({
    'BTC': .4,
    'ETH': .4,
    'USD': .2
  })
}

export const getPortfolio = async (exchangeAuthInfo: UserExchangeAuthData, useLive: Boolean = false): Promise<Portfolio> => {
  const gdax = buildExchangeClient(exchangeAuthInfo, useLive)
  const allocations = await getAllocations(exchangeAuthInfo.userID)
  const tradeableCurrencies = getTradeableCurrencies(allocations)

  const p: Portfolio = {
    exchangeID: exchangeAuthInfo.exchangeID,
    baseCurrency: 'USD',
    quoteCurrency: 'USD',
    fxToBaseCurrency: {},
    holdings: {},
    tickers: {},
    products: {}
  }

  p.fxToBaseCurrency = await getFxRatesTo(p.baseCurrency, tradeableCurrencies)
  
  const markets = await gdax.loadMarkets()
  const allExchangeSymbols = []
  Object.keys(markets).forEach((s: ExchangeSymbol) => {
    allExchangeSymbols.push(s)
    const m: ccxt.Market = markets[s]
    p.products[s] = {
      id: m.id as ProductID,
      base: m.base as CurrencyID,
      quote: m.quote as CurrencyID,
      symbol: m.symbol as ExchangeSymbol,
      minimumOrderSize: m.info.base_min_size 
    }
  })
  
  const balances = await gdax.fetchBalance()
  Object.keys(balances.free).forEach((c: CurrencyID) => {
    const available = balances.free[c]
    p.holdings[c] = {
      id: c,
      quantityAvailable: available
    }
  })
  console.log(p)
  return p
}

export const getFxRatesTo = (baseCurrency: CurrencyID, currencies: Array<CurrencyID>) =>
  // TODO: Since we're only support GDAX AND USD for now just return 1
  currencies.reduce((fxRates, c: CurrencyID) => {
    fxRates[c] = 1
    return fxRates 
  }, {})