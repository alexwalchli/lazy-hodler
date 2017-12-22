import * as ccxt from 'ccxt'
import * as gdax from 'gdax'

import {
  ProductID,
  IExchangeAuthRecord
} from './types'

export const buildPublicHTTPClient = () => (new ccxt.gdax())

export const buildPrivateHTTPClient = (a: IExchangeAuthRecord) => {
  const gdax = new ccxt.gdax({
    apiKey: a.authInfo.apiKey,
    secret: a.authInfo.secret,
    password: a.authInfo.passphrase
  })
  return gdax
}

export const buildPublicWebsocketClient = (productIDs: Array<ProductID>) => {
  const wsClient = gdax.WebsocketClient as any // GDAX typings are off
  const websocket = new wsClient(productIDs, 'wss://ws-feed.gdax.com', null, {
    "channels": [
      "ticker",
    ]
  })
  return websocket
}