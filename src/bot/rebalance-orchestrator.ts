import { loadAllPortfolios, rebalancePortfolios } from "./portfolio-actions";
import { loadAllGDAXMarkets, subscribeAndManageGDAXPriceFeed } from "./exchange-actions";
import { createBotStore } from './store'


// Master function for orchestrating a rebalance at each interval
export const startRebalancingPortfolios = async (): Promise<boolean> => {
  const store = createBotStore()

  try {
    // Portfolios and markets can be loaded in tandem to speed things up.
    await Promise.all([
      store.dispatch(loadAllPortfolios()),
      store.dispatch(loadAllGDAXMarkets())
    ])  
  } catch (error) {
    // TODO: notify
    console.error(`Uncaught error while loading portfolios and markets`, error)
    return false
  }
  
  try {
    // Then we start price subscriptions to ensure that when a portfolio
    // is rebalanced always has the latest price.
    await store.dispatch(subscribeAndManageGDAXPriceFeed())  
  } catch (error) {
    // TODO: notify
    console.error(`Uncaught error while subscribing to prices`, error)
    return false
  }

  try {
    // Lastly, the process of synchronously rebalancing each portfolio is started
    await store.dispatch(rebalancePortfolios())  
  } catch (error) {
    // TODO: notify
    console.error(`Uncaught error while rebalancing portfolios!`, error)
    return false
  }
  
  return true;
}


