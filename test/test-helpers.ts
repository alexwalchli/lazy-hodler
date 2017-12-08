import { Portfolio, ProductID, Quantity, CurrencyID, ExchangeSymbol } from "../src/types";

export type MockPositionInfo = {
  currencyID: CurrencyID,
  currentPrice: number,
  quantityAvailable: Quantity,
  fxToBaseCurrency: number,
  minimumOrderSize: Quantity
}

export const createMockPortfolio = (baseCurrency: CurrencyID, quoteCurrency: CurrencyID, mockPositionInfo: Array<MockPositionInfo>): Portfolio => {
  const p: Portfolio = {
    holdings: {},
    tickers: {},
    products: {},
    fxToBaseCurrency: {},
    quoteCurrency: baseCurrency,
    baseCurrency: quoteCurrency
  }

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