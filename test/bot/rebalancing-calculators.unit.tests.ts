import * as rebalancingCalculators from '../../src/bot/rebalancing-calculators'
import { IPortfolioRecord, PortfolioHoldings, ExchangeRates } from '../../src/shared/types'
import { expect } from 'chai'

describe('portfolio-calculator unit tests', () => {
  describe("reduceHoldingsToRebalancingAdjustments", () => {
    const fx: ExchangeRates = {
      'BTC': {
        'BTC': 1,
        'USD': 10000
      },
      'ETH': {
        'ETH': 1,
        'USD': 400
      },
      'LTC': {
        'LTC': 1,
        'USD': 100
      },
      'USD': {
        'USD': 1,
        'ETH': 1/400,
        'BTC': 1/10000
      }
    }
    describe("portfolio that needs rebalancing", () => {
      it("evenly split allocations", () => {
        const p: IPortfolioRecord = {
          id: 'abc',
          name: 'abc',
          userID: 'abc',
          allocations: {
            'BTC': .333333,
            'ETH': .333333,
            'LTC': .333333
          },
          baseCurrency: 'USD',
          quoteCurrency: 'USD',
          exchangeID: 'GDAX'
        }
        const h: PortfolioHoldings = {
          'BTC': {
            id: 'BTC', quantityAvailable: 2
          },
          'ETH': {
            id: 'ETH', quantityAvailable: 25
          },
          'LTC': {
            id: 'LTC', quantityAvailable: 100
          }
        }
        const adjustments = rebalancingCalculators.reduceHoldingsToRebalancingAdjustments(fx, p, h);

        expect(adjustments.find((a) => a.currencyID === 'BTC').quantity).to.be.equal(-0.666668)
        expect(adjustments.find((a) => a.currencyID === 'ETH').quantity).to.be.equal(8.3333)
        expect(adjustments.find((a) => a.currencyID === 'LTC').quantity).to.be.equal(33.3332)
      })
      it("unevenly split allocations", () => {
        const p: IPortfolioRecord = {
          id: 'abc',
          name: 'abc',
          userID: 'abc',
          allocations: {
            'BTC': .5,
            'ETH': .4,
            'LTC': .1
          },
          baseCurrency: 'USD',
          quoteCurrency: 'USD',
          exchangeID: 'GDAX'
        }
        const h: PortfolioHoldings = {
          'BTC': {
            id: 'BTC', quantityAvailable: 1
          },
          'ETH': {
            id: 'ETH', quantityAvailable: 20
          },
          'LTC': {
            id: 'LTC', quantityAvailable: 100
          }
        }

        const adjustments = rebalancingCalculators.reduceHoldingsToRebalancingAdjustments(fx, p, h)
        
        expect(adjustments.find((a) => a.currencyID === 'BTC').quantity).to.be.equal(0.4)
        expect(adjustments.find((a) => a.currencyID === 'ETH').quantity).to.be.equal(8)
        expect(adjustments.find((a) => a.currencyID === 'LTC').quantity).to.be.equal(-72)
      })
    })
    describe("portfolio that does not need rebalancing", () => {
      it("evenly split allocations", () => {
        const p: IPortfolioRecord = {
          id: 'abc',
          name: 'abc',
          userID: 'abc',
          allocations: {
            'BTC': .25,
            'ETH': .25,
            'LTC': .25,
            'USD': .25
          },
          baseCurrency: 'USD',
          quoteCurrency: 'USD',
          exchangeID: 'GDAX'
        }
        const h: PortfolioHoldings = {
          'BTC': {
            id: 'BTC', quantityAvailable: 1
          },
          'ETH': {
            id: 'ETH', quantityAvailable: 25
          },
          'LTC': {
            id: 'LTC', quantityAvailable: 100
          },
          'USD': {
            id: 'USD', quantityAvailable: 10000
          }
        }

        const adjustments = rebalancingCalculators.reduceHoldingsToRebalancingAdjustments(fx, p, h)

        expect(adjustments.find((a) => a.currencyID === 'BTC').quantity).to.be.equal(0)
        expect(adjustments.find((a) => a.currencyID === 'ETH').quantity).to.be.equal(0)
        expect(adjustments.find((a) => a.currencyID === 'LTC').quantity).to.be.equal(0)
        expect(adjustments.find((a) => a.currencyID === 'USD').quantity).to.be.equal(0)
      })
    })
  })
  describe('desiredBalanceInBaseCurrency', () => {
    it('should use the allocations and current total portfolio balance to determine new desired balnce', () => {
      const p: IPortfolioRecord = {
        id: 'abc',
        name: 'abc',
        userID: 'abc',
        exchangeID: 'GDAX',
        allocations: {
          'BTC': 0.5,
          'ETH': 0.25
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD'
      }

      const desiredBtcBalance = rebalancingCalculators.desiredBalanceInBaseCurrency(p, 'BTC', 10000)
      const desiredEthBalance = rebalancingCalculators.desiredBalanceInBaseCurrency(p, 'ETH', 10000)

      expect(desiredBtcBalance).to.be.equal(5000)
      expect(desiredEthBalance).to.be.equal(2500)
    })
    it('base currency should not convert', () => {
      const p: IPortfolioRecord = {
        id: 'abc',
        name: 'abc',
        userID: 'abc',
        exchangeID: 'GDAX',
        allocations: {
          'BTC': 0.5,
          'ETH': 0.25,
          'USD': 0.25
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD'
      }

      const desiredUsdBalance = rebalancingCalculators.desiredBalanceInBaseCurrency(p, 'USD', 10000)

      expect(desiredUsdBalance).to.be.equal(2500)
    })
  })
  describe('calculateAdjustment', () => {
    const p: IPortfolioRecord = {
      id: 'abc',
      name: 'abc',
      userID: 'abc',
      allocations: {
        'BTC': .5,
        'ETH': .5
      },
      baseCurrency: 'USD',
      quoteCurrency: 'USD',
      exchangeID: 'GDAX'
    }
    const h: PortfolioHoldings = {
      'BTC': {
        id: 'BTC', quantityAvailable: 2
      },
      'ETH': {
        id: 'ETH', quantityAvailable: 10
      }
    }
    const fx: ExchangeRates = {
      'BTC': {
        'BTC': 1,
        'USD': 10000
      },
      'ETH': {
        'ETH': 1,
        'USD': 500
      },
      'USD': {
        'USD': 1,
        'ETH': 1/500,
        'BTC': 1/10000
      }
    }
    const total = rebalancingCalculators.reduceHoldingsToTotalInBaseCurrency(p, h, fx)

    it('should return a negative quantity if the position is currently over allocated', () => {
      const adjustment = rebalancingCalculators.calculateAdjustment(p, total, h, fx, 'BTC')
      expect(adjustment).to.equal(-0.75)
    })
    it('should return a positive quantity if the position is currently under allocated', () => {
      const adjustment = rebalancingCalculators.calculateAdjustment(p, total, h, fx, 'ETH')
      expect(adjustment).to.equal(15)
    })
    it('should return a 0 adjustment if the position is currently allocated correctly', () => {
      const p1: IPortfolioRecord = {
        id: 'abc',
        name: 'abc',
        userID: 'abc',
        allocations: {
          'BTC': .5,
          'ETH': .5
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD',
        exchangeID: 'GDAX'
      }
      const h: PortfolioHoldings = {
        'BTC': {
          id: 'BTC', quantityAvailable: 1.25
        },
        'ETH': {
          id: 'ETH', quantityAvailable: 25
        }
      }
      const total1 = rebalancingCalculators.reduceHoldingsToTotalInBaseCurrency(p, h, fx)

      const ethAdjustment = rebalancingCalculators.calculateAdjustment(p1, total1, h, fx, 'ETH')
      const btcAdjustment = rebalancingCalculators.calculateAdjustment(p1, total1, h, fx, 'BTC')

      expect(ethAdjustment).to.equal(0, 'ETH should need no adjustment')
      expect(btcAdjustment).to.equal(0, 'BTC should need no adjustment')
    })
    describe('when allocations contain fiat', () => {
      it('should adjust no differently', () => {
        const p1: IPortfolioRecord = {
          id: 'abc',
          name: 'abc',
          userID: 'abc',
          allocations: {
            'BTC': .4,
            'ETH': .4,
            'USD': .2
          },
          baseCurrency: 'USD',
          quoteCurrency: 'USD',
          exchangeID: 'GDAX'
        }
        const h: PortfolioHoldings = {
          'BTC': {
            id: 'BTC', quantityAvailable: 1
          },
          'ETH': {
            id: 'ETH', quantityAvailable: 25
          },
          'USD': {
            id: 'USD', quantityAvailable: 2000
          }
        }
        const total1 = rebalancingCalculators.reduceHoldingsToTotalInBaseCurrency(p, h, fx)
  
        const ethAdjustment = rebalancingCalculators.calculateAdjustment(p1, total1, h, fx, 'ETH')
        const btcAdjustment = rebalancingCalculators.calculateAdjustment(p1, total1, h, fx, 'BTC')
        const usdAdjustment = rebalancingCalculators.calculateAdjustment(p1, total1, h, fx, 'USD')
  
        expect(ethAdjustment).to.equal(-5.4)
        expect(btcAdjustment).to.equal(-0.02)
        expect(usdAdjustment).to.equal(2900)
      })
    })
  })
  describe('reduceHoldingsToTotalInBaseCurrency', () => {
    it('should convert each position balance to base currency and add them up', () => {
      const p: IPortfolioRecord = {
        id: 'abc',
        name: 'abc',
        userID: 'abc',
        allocations: {
          'BTC': .4,
          'ETH': .4,
          'USD': .2
        },
        baseCurrency: 'USD',
        quoteCurrency: 'USD',
        exchangeID: 'GDAX'
      }
      const h: PortfolioHoldings = {
        'BTC': {
          id: 'BTC', quantityAvailable: 2
        },
        'ETH': {
          id: 'ETH', quantityAvailable: 10
        },
        'USD': {
          id: 'USD', quantityAvailable: 2000
        }
      }
      const fx: ExchangeRates = {
        'BTC': {
          'BTC': 1,
          'USD': 10000
        },
        'ETH': {
          'ETH': 1,
          'USD': 500
        },
        'USD': {
          'USD': 1,
          'ETH': 1/500,
          'BTC': 1/10000
        }
      }

      const totalValue = rebalancingCalculators.reduceHoldingsToTotalInBaseCurrency(p, h, fx)

      expect(totalValue).to.equal(27000)
    })
  })
})