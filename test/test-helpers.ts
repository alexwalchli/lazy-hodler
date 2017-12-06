import { Portfolio, ProductID, Quantity, CurrencyID } from "../src/types";

export type MockPositionInfo = {
  productID: ProductID,
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
    p.holdings[pos.productID] = {
      id: pos.productID,
      quantityAvailable: pos.quantityAvailable
    }
    p.fxToBaseCurrency[pos.productID] = pos.fxToBaseCurrency
    p.tickers[pos.productID] = { currentPrice: pos.currentPrice }
    p.products[pos.productID] = { minimumOrderSize: pos.minimumOrderSize }
  })

  return p
}