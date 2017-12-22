
import * as exchangeClient from '../shared/exchange-client'
import { ProductID, ExtraArgument, IProductInfoDictionary } from "../shared/types"
import { getProductIDsByExchange } from "./selectors"

import { ThunkAction } from "redux-thunk";
import { BotState } from "./bot-reducer";

export const loadAllGDAXMarkets = (): ThunkAction<Promise<void>, BotState, ExtraArgument> => 
  async dispatch => {
    const products = await exchangeClient.getExchangeProducts()
    dispatch(productsLoad(products))
  }

export const subscribeAndManageGDAXPriceFeed = () => (dispatch, getState) => (
  new Promise((resolve, reject) => {
    const gdaxProductIDs = getProductIDsByExchange(getState(), 'GDAX')
    const websocket = exchangeClient.subscribeToGDAXPriceFeed(gdaxProductIDs)
    const receivedPricesForProductIDs = {}
    const priceFeedTimeout = setTimeout(() => { 
      reject('took too long to retrieve prices for all products')
    }, 60000)
    
    const onExchangeMessage = message => {
      if (message.type !== 'ticker') {
        return
      }
      dispatch(priceUpdate(message.product_id as ProductID, message.price))      
      receivedPricesForProductIDs[message.product_id] = true

      if(Object.keys(receivedPricesForProductIDs).length === gdaxProductIDs.length) {
        clearTimeout(priceFeedTimeout)
        resolve()
      }
    }
    
    const onExchangeError = error => {
      reject()
    }
    
    const onExchangeClose = () => {
      reject()
    }
    websocket.on('message', onExchangeMessage)
    websocket.on('error', onExchangeError)
    websocket.on('close', onExchangeClose)
  })
)

const priceUpdate = (productID: ProductID, lastPrice: number) => ({
  type: 'PRICE_UPDATE',
  payload: {
    productID,
    lastPrice
  }
})

const productsLoad = (products: IProductInfoDictionary) => ({
  type: 'PRODUCTS_LOAD',
  payload: {
    products
  }
})

