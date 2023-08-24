import CashFlow from './cash-flow'

/**
 * Represents the movement of money, specifically non-interest bearing cash
 * in-flows to the lender, for example cash-based charges or fees. The
 * value of these cash flows must be specified i.e. they cannot be *undefined*
 * or unknown.
 *
 * The inclusion of charge cash flows in a profile or series has no effect on the
 * calculation of unknown interest-bearing cash flow values, they are skipped over.
 * However they may optionally be included in the calculation of the implicit interest
 * rate in a cash flow series, for example the calculation on an Annual Percentage
 * Rate (APR) of charge.
 *
 * @author Andrew Murphy
 */
export default class CashFlowCharge extends CashFlow {
  constructor (postingDate: Date, value: number, label?: string) {
    super(postingDate, postingDate, Math.abs(value), undefined, label)
  }
}
