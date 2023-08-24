import CashFlow from './cash-flow'

/**
 * Represents the movement of money, specifically interest bearing cash in-flows
 * to the lender, for example loan repayments or lease rentals.
 *
 * @author Andrew Murphy
 */
export default class CashFlowPayment extends CashFlow {
  /**
   * The amortised interest included in this cash flow value when isIntCapitalised
   * is true. The difference between interest and the cash flow value is the
   * amortised capital.
   */
  public interest: number
  /**
   * Determines whether the interest accrued to date is capitalised or rolled over.
   * Default is true.
   */
  private readonly _isIntCapitalized: boolean

  constructor (
    postingDate: Date,
    value?: number,
    weighting?: number,
    isIntCapitalised = true,
    label?: string
  ) {
    super(
      postingDate,
      postingDate,
      value === undefined ? value : Math.abs(value),
      weighting,
      label
    )
    this.interest = 0
    this._isIntCapitalized = isIntCapitalised
  }

  /**
   * Flag indicating whether interest accrued to date is to be capitalised (true)
   * or rolled over (false).
   */
  public isIntCapitalised (): boolean {
    return this._isIntCapitalized
  }
}
