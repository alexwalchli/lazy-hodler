import { Reducer, AnyAction } from "redux";
import { IProductInfoDictionary, IPriceTickerDictionary, IPortfolioRecord } from "../shared/types";


export type BotState = {
  portfoliosQueuedForRebalance: Array<string>,
  portfolios: Array<IPortfolioRecord>,
  productsByExchange: {
    GDAX: IProductInfoDictionary
  },
  prices: {
    GDAX: IPriceTickerDictionary
  }
}

const initialBotState: BotState = {
  portfoliosQueuedForRebalance: [],
  portfolios: [],
  productsByExchange: {
    GDAX: {}
  },
  prices: {
    GDAX: {}
  }
}

const bot: Reducer<BotState> = (state: BotState = initialBotState, action: AnyAction): BotState => {
  switch (action.type) {
    case 'PRODUCTS_LOAD': {
      const { products } = action.payload
      return Object.assign({}, state, {
        productsByExchange: {
          GDAX: products
        }
      })
    }
    case 'PORTFOLIOS_LOAD': {
      const { portfolios } = action.payload
      const portfolioIDs = portfolios.map(p => p.id)
      return Object.assign({}, state, {
        portfoliosQueuedForRebalance: portfolioIDs,
        portfolios
      })
    }
    case 'PRICE_UPDATE': {
      const { productID, lastPrice } = action.payload
      const newState = Object.assign({}, state)
      newState.prices.GDAX[productID] = lastPrice
      return newState
    }
    default: {
      return Object.assign({}, state)
    }
  }
}

export default bot