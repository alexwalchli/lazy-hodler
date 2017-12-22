describe('rebalance-orchestrator unit tests', () => {
  describe('startRebalancingPortfolios', () => {
    it('should create a redux store to manage the state of rebalancing', () => {

    })
    it('should dispatch an action to load all portfolios for rebalancing', () => {

    })
    it('should dispatch an action to load all GDAX markets', () => {

    })
    it(`should dispatch an action to spin up a 
        GDAX price feed so when rebalancing we use the latest prices`, () => {

    })
    it('should finally dispatch an action to synchronously rebalance all portfolios', () => {

    })
    describe('error handling', () => {
      it('should catch uncaught errors while loading all portfolios and return false', () => {

      })
      it('should catch uncaught errors while loading all GDAX markets and return false', () => {

      })  
      it('should catch uncaught errors while subscribing to GDAX prices and return false', () => {

      })
      it('should catch uncaught errors while rebalancing portfolios and return false', () => {

      })
    })
  })
})