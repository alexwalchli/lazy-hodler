import { IProductInfo, Quantity } from "./types";

export const roundToMinimumOrderSize = (product: IProductInfo, q: Quantity) => {
  const minimumOrderSize = product.minimumOrderSize
  if (Math.abs(q) < minimumOrderSize) {
    q = 0
    return q
  }
  q = +q.toFixed(decimalPlaces(minimumOrderSize))
  return q
}

const decimalPlaces = (n: number) => {
  const strNumber = n.toString()
  var match = (''+strNumber).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0))
}