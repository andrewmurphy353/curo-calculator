import CashFlow from './cash-flow'

/**
 * Represents the movement of money, specifically the cash out flows of a lender,
 * for example the amounts advanced under a loan or leasing arrangement.
 *
 * @author Andrew Murphy
 */
export default class CashFlowAdvance extends CashFlow {
  constructor (
    postingDate: Date,
    valueDate: Date | undefined,
    value?: number,
    weighting?: number,
    label?: string
  ) {
    super(
      postingDate,
      valueDate === undefined ? postingDate : valueDate,
      value === undefined ? value : -Math.abs(value),
      weighting,
      label
    )
  }
}
