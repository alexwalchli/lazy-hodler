import { createStore, applyMiddleware, Store } from 'redux'
import thunkMiddleware from 'redux-thunk'

import bot, { BotState } from './bot-reducer'

export const createBotStore = (): Store<BotState> => createStore(
  bot,
  applyMiddleware(
    thunkMiddleware
  )
)