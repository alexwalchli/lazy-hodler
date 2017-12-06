export type UserID = string
export type SecretKey = string
export type APIKey = string
export type Passphrase = string
export type ExchangeID = string
export type CurrencyID = 'BTC' | 'USD' | 'USDT'
export type ProductID = 'BTC-USD' | 'ETH-USD' | 'LTC-USD'
export type ExchangeSymbol = 'BTC/USD' | 'ETH/USD' | 'LTC/USD'
export type Quantity = number

export type ProductTicker = {
  currentPrice: number
}
export type ProductTickers = {
  [k: string]: ProductTicker
}

export type Position = {
  id: ProductID,
  quantityAvailable: number
}

export type Holdings = {
  [k: string]: Position
}

export type Portfolio = {
  tickers: ProductTickers,
  fxToBaseCurrency: {
    [k: string]: number
  },
  baseCurrency: CurrencyID,
  quoteCurrency: CurrencyID
  holdings: Holdings,
  products: Products
}

export type Products = {
  [k: string]: ProductInfo
}

export type ProductInfo = {
  minimumOrderSize: Quantity
}

export type Allocations = {
  [key: string]: number
}

export type QuantityAdjustments = {
  [key: string]: Quantity
}

export type GDAXAuthInfo = {
  secret: SecretKey,
  apiKey: APIKey,
  passphrase: Passphrase
}

export type UserExchangeAuthData = {
  userID: UserID,
  exchangeID: ExchangeID,
  authInfo: GDAXAuthInfo
}