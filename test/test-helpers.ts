import { Portfolio, ProductID, Quantity, CurrencyID, ExchangeSymbol } from "../src/types";

export type MockPositionInfo = {
  currencyID: CurrencyID,
  currentPrice: number,
  quantityAvailable: Quantity,
  fxToBaseCurrency: number,
  minimumOrderSize: Quantity
}

export const createMockPortfolio = (
  baseCurrency: CurrencyID,
  quoteCurrency: CurrencyID,
  mockPositionInfo: Array<MockPositionInfo>,
  baseCurrencyAmount: number = 0
): Portfolio => {
  const p: Portfolio = {
    exchangeID: 'GDAX',
    holdings: {},
    tickers: {},
    products: {},
    fxToBaseCurrency: {},
    quoteCurrency: baseCurrency,
    baseCurrency: quoteCurrency
  }

  p.holdings[baseCurrency] = {
    id: baseCurrency,
    quantityAvailable: baseCurrencyAmount
  }

  p.fxToBaseCurrency[baseCurrency] = 1

  mockPositionInfo.forEach((pos) => {
    p.holdings[pos.currencyID] = {
      id: pos.currencyID,
      quantityAvailable: pos.quantityAvailable
    }
    p.fxToBaseCurrency[pos.currencyID] = pos.fxToBaseCurrency
    p.tickers[pos.currencyID] = { currentPrice: pos.currentPrice }
    p.products[pos.currencyID] = {
      id: `${pos.currencyID}-${baseCurrency}` as ProductID,
      symbol: `${pos.currencyID}\/${baseCurrency}` as ExchangeSymbol,
      base: pos.currencyID,
      quote: baseCurrency,
      minimumOrderSize: pos.minimumOrderSize
    }
  })

  return p
}

// export const createGDAXMockPortfolio = (
// ): Portfolio => {
//   const p: Portfolio = {
//     baseCurrency: 'USD',
//     quoteCurrency: 'USD',
//     fxToBaseCurrency: {

//     },
//     holdings: {

//     },
//     products: {
//       'LTC/EUR': {
//         id: 'LTC-EUR',
//         base: 'LTC',
//         quote: 'EUR',
//         symbol: 'LTC/EUR',
//         minimumOrderSize: '0.01'
//       },
//       'LTC/USD': {
//         id: 'LTC-USD',
//         base: 'LTC',
//         quote: 'USD',
//         symbol: 'LTC/USD',
//         minimumOrderSize: '0.01'
//       },
//       'LTC/BTC': {
//         id: 'LTC-BTC',
//         base: 'LTC',
//         quote: 'BTC',
//         symbol: 'LTC/BTC',
//         minimumOrderSize: '0.01'
//       },
//       'ETH/EUR': {
//         id: 'ETH-EUR',
//         base: 'ETH',
//         quote: 'EUR',
//         symbol: 'ETH/EUR',
//         minimumOrderSize: '0.001'
//       },
//       'ETH/USD': {
//         id: 'ETH-USD',
//         base: 'ETH',
//         quote: 'USD',
//         symbol: 'ETH/USD',
//         minimumOrderSize: '0.001'
//       },
//       'ETH/BTC': {
//         id: 'ETH-BTC',
//         base: 'ETH',
//         quote: 'BTC',
//         symbol: 'ETH/BTC',
//         minimumOrderSize: '0.001'
//       },
//       'BTC/GBP': {
//         id: 'BTC-GBP',
//         base: 'BTC',
//         quote: 'GBP',
//         symbol: 'BTC/GBP',
//         minimumOrderSize: '0.0001'
//       },
//       'BTC/EUR': {
//         id: 'BTC-EUR',
//         base: 'BTC',
//         quote: 'EUR',
//         symbol: 'BTC/EUR',
//         minimumOrderSize: '0.0001'
//       },
//       'BTC/USD': {
//         id: 'BTC-USD',
//         base: 'BTC',
//         quote: 'USD',
//         symbol: 'BTC/USD',
//         minimumOrderSize: '0.0001'
//       }
//     },
//     tickers: {

//     }
//   }

//   return p
// }