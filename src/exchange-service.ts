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
    'BTC/USD': .4,
    'ETH/USD': .3,
    'USD': .2,
    'LTC/USD': .1,
  })
}

export const getPortfolio = async (exchangeAuthInfo: UserExchangeAuthData): Promise<Portfolio> => {
  const allocations = await getAllocations(exchangeAuthInfo.userID)
  const exchangeSymbols = getTradeableSymbols(allocations)

  // assume GDAX for now
  const gdax = new ccxt.gdax({
    apiKey: exchangeAuthInfo.authInfo.apiKey,
    secret: exchangeAuthInfo.authInfo.secret,
    password: exchangeAuthInfo.authInfo.passphrase
  }) as any // TODO: Exchange class doesn't define urls in type def
  gdax.urls['api'] = 'https://api.gdax.com'

  const p: Portfolio = {
    baseCurrency: 'USD',
    quoteCurrency: 'USD',
    fxToBaseCurrency: {},
    holdings: {},
    tickers: {},
    products: {}
  }

  p.tickers = await getTickers(exchangeSymbols, gdax)
  p.fxToBaseCurrency = await getFxRatesTo(p.baseCurrency, exchangeSymbols)

  console.log(p.tickers)
  return p


  // console.log(markets)
  // const balances = await gdax.fetchBalance();
  // console.log(balances)

  // balances.

  // // const tickers = await (gdax as ccxt.gdax).fetchTicker('BTC/USD')
  // // console.log(tickers)
  // balances.info.forEach((balance) => {
  //   if (balance.currency === 'USD') {
  //     const p: Position = {
  //       id: balance.currency,
  //       size: balance.available,
  //       minimumOrderSize: 0,
  //       amountInBaseCurrency: balance.available,
  //       currentPrice: 1
  //     }
  //     h[balance.currency] = p
  //   } else {
  //     // TODO: assuming USD for now
  //     const market = getMarket(markets, balance.currency, 'USD')
  //     const p: Position = {
  //       id: market.symbol,
  //       size: balance.available,
  //       minimumOrderSize: market.info.base_min_size,
  //       amountInBaseCurrency: 0,
  //       currentPrice: 0
  //     }
  //     h[balance.currency] = p
  //   }
  // })

  // console.log(h)

}

// const getMarket = (markets: ccxt.Market[], base: string, quote: string): ccxt.Market => {
//   return Object.keys(markets).map((k) => markets[k])
//     .find(m => m.base === base && m.quote === quote)
// }

export const getFxRatesTo = (baseCurrency: CurrencyID, exchangeSymbols: Array<ExchangeSymbol>) =>
  // TODO: Since we're only support GDAX AND USD for now just return 1
  exchangeSymbols.reduce((fxRates, s: ExchangeSymbol) => {
    fxRates[s] = 1
    return fxRates 
  }, {})

export const getTickers = async (products: Array<ExchangeSymbol>, exchangeClient: ccxt.Exchange): Promise<ProductTickers> => {
  const tickers: ProductTickers = {}
  for (const s of products) {
    // GDAX doesn't support getting multiple tickers through ccxt yet
    const exchangeTicker = await exchangeClient.fetchTicker(s)
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

const getTradeableSymbols = (a: Allocations): Array<ExchangeSymbol> =>
  Object.keys(a).filter((c: ExchangeSymbol | CurrencyID) => !isFiat(c)) as Array<ExchangeSymbol>
const isFiat = (c: CurrencyID | ExchangeSymbol) => fiatIDs.includes(c)