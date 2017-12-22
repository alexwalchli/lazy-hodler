export type UserID = string
export type SecretKey = string
export type APIKey = string
export type Passphrase = string
export type ExchangeID = 'GDAX'
export type CurrencyID = 'BTC' | 'USD' | 'USDT' | 'LTC' | 'ETH' | 'GBP' | 'EUR'
export type ProductID = 'BTC-USD' | 'ETH-USD' | 'LTC-USD' | 'ETH-BTC' | 'LTC-BTC' 
export type ExchangeSymbol = 'BTC/USD' | 'ETH/USD' | 'LTC/USD' | 'ETH/BTC' | 'LTC/BTC'
export type Quantity = number

export interface IPortfolioDictionary {
  [k: string]: IPortfolioRecord
}
export interface IPortfolioRecord {
  id: string,
  name: string,
  userID: string,
  baseCurrency: CurrencyID,
  quoteCurrency: CurrencyID,
  exchangeID: ExchangeID,
  allocations: PortfolioAllocations
}
export interface IProductInfoDictionary {
  [k: string]: IProductInfo
}

export type IExchangeAuthRecord = {
  userID: UserID,
  exchangeID: ExchangeID,
  authInfo: GDAXAuthInfo
}

export type PortfolioHolding = {
  id: CurrencyID,
  quantityAvailable: number
}

export type PortfolioHoldings = {
  [k: string]: PortfolioHolding
}

export interface ITicker {
  productID: ProductID,
  lastPrice: number
}
export interface IPriceTickerDictionary {
  [k: string]: ITicker
}

export type PortfolioAllocations = {
  [k: string]: number
}

export interface IProductInfo {
  id: ProductID,
  symbol: ExchangeSymbol,
  base: CurrencyID,
  quote: CurrencyID,
  minimumOrderSize: Quantity
}

export type GDAXAuthInfo = {
  secret: SecretKey,
  apiKey: APIKey,
  passphrase: Passphrase
}

export type ExchangeRates = {
  [from: string]: {
    [to: string]: number
  }
}

export type QuantityAdjustments = {
  [c: string]: number
}

export type ExtraArgument = any