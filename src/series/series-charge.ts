import { type Frequency } from './frequency'
import { type Mode } from './mode'
import Series from './series'
import { SeriesType } from './series-type'

/**
 * A series of one or more charges or fees received by a lender. These are non-finance cash flows
 * that do not affect the computation of unknown advance or payment cash flow values, but may affect
 * the computation of implicit interest rates such as Annual Percantage Rates (APRs), as documented
 * elsewhere.
 *
 * This class implements the builder pattern to provide a fluent-type API.
 */
export default class SeriesCharge {
  /**
   * Instantiates a default instance of this class to capture user-defined input
   */
  public static builder (): SeriesCharge {
    return new SeriesCharge()
  }

  private readonly _seriesCharge: Series

  private constructor () {
    this._seriesCharge = new Series(SeriesType.Charge)
  }

  /**
   * The label assigned to each cash flow in the series. Used to annotate
   * each cash flow in an amortisation schedule or calculation proof.
   *
   * @param label containing localised  text in singular form e.g. 'Arrangement
   * fee' (not 'Arrangement fees')
   */
  public setLabel (label: string): this {
    this._seriesCharge.label = label
    return this
  }

  /**
   * The total number of charges in the series. Default is 1.
   *
   * @param numberOf determining total number of cash flows in series
   * @throws error when numberOf argument is less than 1
   */
  public setNumberOf (numberOf: number): this {
    if (numberOf < 1) {
      throw new Error('The numberOf value must be 1 or greater')
    }
    this._seriesCharge.numberOf = numberOf
    return this
  }

  /**
   * The value of the one or more charges in the series.
   *
   * @param amount to assign to each cash flow object created.
   */
  public setAmount (amount: number): this {
    this._seriesCharge.amount = amount
    return this
  }

  /**
   * The due date of the first charge in the series. Subsequent charge
   * cash flow dates are determined with reference to this date *and* are offset
   * by the interval defined by the series frequency.
   *
   * If the date is not defined it will be computed with reference to the current
   * system date or the end date of a preceding charge series.
   *
   * @param payableFrom posted date of the first cash flow in the series
   */
  public setDueOnOrFrom (payableFrom: Date): this {
    this._seriesCharge.postedDate = payableFrom
    return this
  }

  /**
   * The frequency of recurring charges in the series.
   *
   * @param frequency of the one or more charge cash flows in the series.
   */
  public setFrequency (frequency: Frequency): this {
    this._seriesCharge.frequency = frequency
    return this
  }

  /**
   * The mode of recurring charges in the series.
   *
   * @param mode of the one or more charge cash flows in the series
   */
  public setMode (mode: Mode): this {
    this._seriesCharge.mode = mode
    return this
  }

  /**
   * Method provides a reference to the populated instance after all user
   * input has been captured.
   */
  public build (): Series {
    return this._seriesCharge
  }
}
