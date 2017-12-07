import * as ccxt from 'ccxt'
import {
  UserExchangeAuthData,
  CurrencyID,
  Portfolio,
  UserID,
  Allocations,
  ExchangeSymbol,
  ProductTickers
} from "./types";
import { fiatIDs } from './constants';

export const getAllocations = async (userID: UserID): Promise<Allocations> => {
  // TODO: Make a call to Firebase. Stubbed for now
  return Promise.resolve({
    'BTC': .4,
    'ETH': .3,
    'USD': .2,
    'LTC': .1,
  })
}

export const getPortfolio = async (exchangeAuthInfo: UserExchangeAuthData, useLive: Boolean = false): Promise<Portfolio> => {
  const allocations = await getAllocations(exchangeAuthInfo.userID)
  const tradeableCurrencies = getTradeableCurrencies(allocations)

  // assume GDAX for now
  const gdax = new ccxt.gdax({
    apiKey: exchangeAuthInfo.authInfo.apiKey,
    secret: exchangeAuthInfo.authInfo.secret,
    password: exchangeAuthInfo.authInfo.passphrase
  }) as any // TODO: Exchange class doesn't define urls in type def

  // TODO: GDAX is the only exchange I know of that has a sandbox so this
  // need to be removed or changed when more exchanges are supported
  useLive
    ? gdax.urls['api'] = 'https://api.gdax.com'
    : gdax.urls['api'] = 'https://api-public.sandbox.gdax.com'

  const p: Portfolio = {
    baseCurrency: 'USD',
    quoteCurrency: 'USD',
    fxToBaseCurrency: {},
    holdings: {},
    tickers: {},
    products: {}
  }

  p.tickers = await getTickers(tradeableCurrencies, p.baseCurrency, gdax)
  p.fxToBaseCurrency = await getFxRatesTo(p.baseCurrency, tradeableCurrencies)

  const markets = await gdax.loadMarkets()
  Object.keys(markets).forEach((s: ExchangeSymbol) => {
    const m: ccxt.Market = markets[s]
    if (productHasAllocation(allocations, p.baseCurrency, s)) {
      p.products[s] = {
        minimumOrderSize: m.info.base_min_size 
      }
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

export const getTickers = async (currencies: Array<CurrencyID>, baseCurrency: CurrencyID, exchangeClient: ccxt.Exchange): Promise<ProductTickers> => {  
  const tickers: ProductTickers = {}
  for (const s of currencies) {
    // TODO: Exchanges may be format symbols differently so this will have to change
    // to support more exchanges 
    const exchangeSymbol = `${s}/${baseCurrency}` 
    // Some exchanges like GDAX don't support getting multiple tickers
    const exchangeTicker = await exchangeClient.fetchTicker(exchangeSymbol)
    tickers[s] = { currentPrice: exchangeTicker.last }
  }

  return tickers
}

export const sellAtMarket = (c: CurrencyID, qty: number): Promise<Boolean> => {
  return Promise.resolve(true);
}
export const buyAtMarket = (c: CurrencyID, qty: number): Promise<Boolean> => {
  return Promise.resolve(true);
}

const getTradeableCurrencies = (a: Allocations): Array<CurrencyID> =>
  Object.keys(a).filter((c: CurrencyID) => !isFiat(c)) as Array<CurrencyID>

const isFiat = (c: CurrencyID) => fiatIDs.includes(c)

// TODO: This will need to change for different exchanges
// allocations contains the currency and it is denominated in the portfolio's base
const productHasAllocation = (a: Allocations, b: CurrencyID, s: ExchangeSymbol) =>
  a[s.split('/')[0]] && s.includes(b)