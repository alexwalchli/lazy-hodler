export type UserID = string
export type SecretKey = string
export type APIKey = string
export type Passphrase = string
export type ExchangeID = string
export type CurrencyID = 'BTC' | 'USD' | 'USDT' | 'LTC' | 'ETH' | 'GBP' | 'EUR'
export type ProductID = 'BTC-USD' | 'ETH-USD' | 'LTC-USD'
export type ExchangeSymbol = 'BTC/USD' | 'ETH/USD' | 'LTC/USD'
export type Quantity = number

export type ProductTicker = {
  currentPrice: number
}
export type ProductTickers = {
  [k: string]: ProductTicker
}

export type Holding = {
  id: CurrencyID,
  quantityAvailable: number
}

export type Holdings = {
  [k: string]: Holding
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
  id: ProductID,
  symbol: ExchangeSymbol,
  base: CurrencyID,
  quote: CurrencyID,
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