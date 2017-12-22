import { IPortfolioRecord, UserID, ExchangeID, PortfolioAllocations } from "./types";
import { firebaseDb } from './firebase-singletons'

export const getUserExchangeConnections = () => {
  // TODO
}

export const createPortfolio = async (
  name: string,
  userID: UserID,
  exch: ExchangeID,
  allocations: PortfolioAllocations
): Promise<string> => {
  const portfolioID = firebaseDb.ref('portfolios').push().key
  const p: IPortfolioRecord = {
    name,
    id: portfolioID,
    userID,
    allocations,
    baseCurrency: 'USD',
    quoteCurrency: 'USD',
    exchangeID: 'GDAX'
  }
  await firebaseDb.ref(`portfolios/${portfolioID}`).set(p)
  return portfolioID
}

export const getAllPortfolios = async (): Promise<Array<IPortfolioRecord>> => {
  const snapshot = await firebaseDb.ref('portfolios').once('value')
  const portfolioDict = snapshot.val()
  return Object.keys(portfolioDict || []).map(id => portfolioDict[id])
}

export const deletePortfolio = async (portfolioID: string) => {
  await firebaseDb.ref(`portfolios/${portfolioID}`).remove()
}