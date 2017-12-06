import * as exchangeService from '../../src/exchange-service'
import {exchangeAuthData} from '../../exclude/exchange-auth-data'
import { expect } from 'chai';

describe('exchange-service', () => {
  describe('getHoldings', () => {
    it('retrieves data', (done) => {
      exchangeService.getHoldings(exchangeAuthData.gdax)
        .then((data) => {
          expect(data.info).to.exist
          done()
        })
    }).timeout(10000)
  })
})