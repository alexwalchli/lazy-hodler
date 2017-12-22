import * as ccxt from 'ccxt'

import {
  IExchangeAuthRecord,
  CurrencyID,
  IProductInfoDictionary,
  ExchangeSymbol,
  ProductID
} from '../shared/types'
import { buildPrivateHTTPClient, buildPublicHTTPClient, buildPublicWebsocketClient } from './exchange-client-factory';

export const getHoldings = async (a: IExchangeAuthRecord) => {
  const privateGdaxClient = buildPrivateHTTPClient(a)
  const balancesAtExchange = await privateGdaxClient.fetchBalance()
  const holdings = {}
  Object.keys(balancesAtExchange.free).forEach((c: CurrencyID) => {
    const available = balancesAtExchange.free[c]
    holdings[c] = {
      id: c,
      quantityAvailable: available
    }
  })
  return holdings
}

export const getExchangeProducts = async () => {
  const publicGdaxClient = buildPublicHTTPClient()
  const gdaxMarkets = await publicGdaxClient.loadMarkets()
  // normalize markets into a dictionary of products of our type
  const products: IProductInfoDictionary = {}
  Object.keys(gdaxMarkets).forEach((s: ExchangeSymbol) => {
    const m: ccxt.Market = gdaxMarkets[s]
    products[s] = {
      id: m.id as ProductID,
      base: m.base as CurrencyID,
      quote: m.quote as CurrencyID,
      symbol: m.symbol as ExchangeSymbol,
      minimumOrderSize: m.info.base_min_size 
    }
  })

  return products
}

export const subscribeToGDAXPriceFeed = (productIDs: Array<ProductID>) => buildPublicWebsocketClient(productIDs)