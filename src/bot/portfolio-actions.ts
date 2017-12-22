import { ThunkAction } from 'redux-thunk'

import { BotState } from './bot-reducer'
import * as portfolioRepository from '../shared/portfolio-repository'
import { IPortfolioRecord, ExtraArgument } from '../shared/types';
import * as exchangeClient from '../shared/exchange-client'
import * as calcs from './rebalancing-calculators'
import { Dispatch } from 'redux';
import * as orderActions from './order-actions'

export const loadAllPortfolios = (): ThunkAction<Promise<Boolean>, BotState, ExtraArgument> =>
  async dispatch => {
    const portfolios = await portfolioRepository.getAllPortfolios()
    dispatch(portfoliosLoad(portfolios))
    return true
  }

export const rebalancePortfolios = (): ThunkAction<Promise<Boolean>, BotState, ExtraArgument> =>
  async (dispatch, getState) => {
    const portfolios = getState().portfolios
    
    // synchronously rebalance portfolios for now
    // later we could make this asynchronous, but will come
    // with complications potentially, like rate limiting on order execution
    for(const p of portfolios) {
      await rebalancePortfolio(getState(), p, dispatch)
    }

    return true
  }

const rebalancePortfolio = async (s: BotState, p: IPortfolioRecord, dispatch: Dispatch<BotState>) => {
  const auth = {} as any
  const holdings = await exchangeClient.getHoldings(auth)
  const quantityAdjustments = calcs.reduceHoldingsToRebalancingAdjustments(s, p, holdings)
  await dispatch(orderActions.executeRebalance(quantityAdjustments))
}

const portfoliosLoad = (portfolios: Array<IPortfolioRecord>) => ({
  type: 'PORTFOLIOS_LOAD',
  payload: {
    portfolios
  }
})