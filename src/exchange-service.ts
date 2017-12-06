import * as ccxt from 'ccxt'
import {
  UserExchangeAuthData,
  CurrencyID,
  Portfolio
} from "./types";

export const getPortfolio = async (exchangeAuthInfo: UserExchangeAuthData): Promise<Portfolio> => {

  // assume GDAX for now
  const gdax = new ccxt.gdax({
    apiKey: exchangeAuthInfo.authInfo.apiKey,
    secret: exchangeAuthInfo.authInfo.secret,
    password: exchangeAuthInfo.authInfo.passphrase
  }) as any
  gdax.urls['api'] = 'https://api-public.sandbox.gdax.com'

  // TODO

  const p: Portfolio = {
    baseCurrency: 'USD',
    quoteCurrency: 'USD',
    fxToBaseCurrency: {},
    holdings: {},
    tickers: {},
    products: {}
  }
  // const markets = await gdax.loadMarkets();
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

  return p
}

// const getMarket = (markets: ccxt.Market[], base: string, quote: string): ccxt.Market => {
//   return Object.keys(markets).map((k) => markets[k])
//     .find(m => m.base === base && m.quote === quote)
// }

export const sellAtMarket = (c: CurrencyID, qty: number): Promise<Boolean> => {
  return Promise.resolve(true);
}
export const buyAtMarket = (c: CurrencyID, qty: number): Promise<Boolean> => {
  return Promise.resolve(true);
}