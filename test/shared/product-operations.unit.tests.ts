import * as productOps from '../../src/shared/product-operations'
import { expect } from 'chai';
import { IProductInfo } from '../../src/shared/types';

describe('product-operations unit tests', () => {
  describe('roundToMinimumOrderSize', () => {
    const product: IProductInfo = {
      base: 'BTC', quote: 'USD', id: 'BTC-USD',
      minimumOrderSize: 0.001, symbol: 'BTC/USD'
    }
    it('should round a quantity smaller than the minimum tradable size to 0', () => {
      const quantity = productOps.roundToMinimumOrderSize(product, 0.0001)
      expect(quantity).to.equal(0)
    })
    it('should round down a quantity with a smaller decimal than the minimum tradable size', () => {
      const quantity = productOps.roundToMinimumOrderSize(product, 10.0001)
      expect(quantity).to.equal(10)
    })
    it('should round up a quantity', () => {
      const quantity = productOps.roundToMinimumOrderSize(product, 10.0009)
      expect(quantity).to.equal(10.001)
    })
    it('should not round if the quantity is above the minimum size', () => {
      const quantity = productOps.roundToMinimumOrderSize(product, 10.1)
      expect(quantity).to.equal(10.1)
    })
  })
})