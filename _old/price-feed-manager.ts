import { ProductID } from "./types"
import { buildWebsocketClient } from "./exchange-client-factory";
import { setTimeout } from "timers";


type PriceSubscription = {
  productID: ProductID,
  lastPrice?: number
}
type GDAXTicker = {
  type: "ticker",
  trade_id: number,
  sequence: number,
  time: string,
  product_id: ProductID,
  price: string,
  side: string,
  last_size: string,
  best_bid: string,
  best_ask: string
}

export class PriceFeedManager {

  private priceFeedReadyResolve: Function
  private priceFeedReadyReject: Function
  private feedIsReady: boolean = false

  public state: {
    subscriptions: {
      [k: string]: PriceSubscription
    }
  } = {
    subscriptions: {}
  }

  public maybeSubscribeTo (productIDs: Array<ProductID>) {
    const productsThatNeedASubscription = productIDs.filter((s) => !this.state.subscriptions[s])

    productsThatNeedASubscription.forEach((p) => {
      this.state.subscriptions[p] = {
        productID: p,
        lastPrice: null,
      }
    })

    const websocket = buildWebsocketClient(productsThatNeedASubscription)
    websocket.on('message', this.onExchangeMessage)
    websocket.on('error', this.onExchangeError)
    websocket.on('close', this.onExchangeClose)
    
    

    setTimeout(() => {
      if (!this.feedIsReady) {
        this.priceFeedReadyReject()
      }
    }, 60000)

    return new Promise((res, rej) => {
      this.priceFeedReadyResolve = res
      this.priceFeedReadyReject = rej
    })
  }

  public getLatestPrice (productID: ProductID) {
    return this.state.subscriptions[productID].lastPrice
  }

  private onExchangeMessage = (message) => {
    if (message.type !== 'ticker') {
      return
    }
    const ticker = message as GDAXTicker
    this.state.subscriptions[ticker.product_id].lastPrice = Number(ticker.price)
    this.maybeResolveFeedReadiness()
  }

  private maybeResolveFeedReadiness = () => {
    const subscriptions = Object.keys(this.state.subscriptions).reduce((subscriptions, p: ProductID) => {
      subscriptions.push(this.state.subscriptions[p])
      return subscriptions
    }, [])

    const feedIsReady = subscriptions.every((s: PriceSubscription) => !Number.isNaN(s.lastPrice))

    if (feedIsReady) {
      this.priceFeedReadyResolve()
    }
  }
  
  private onExchangeError = (error) => {
    console.log(error)
  }
  
  private onExchangeClose = (message) => {
    console.log(message)
  }

}

