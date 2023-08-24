import { type Frequency } from './frequency'
import { type Mode } from './mode'
import Series from './series'
import { SeriesType } from './series-type'

/**
 * A series of one or more loan payments, lease rentals, etc., received by a lender.
 *
 * This class implements the builder pattern to provide a fluent-type API.
 */
export default class SeriesPayment {
  /**
   * Instantiates a default instance of this class to capture user-defined input
   */
  public static builder (): SeriesPayment {
    return new SeriesPayment()
  }

  private readonly _seriesPayment: Series

  private constructor () {
    this._seriesPayment = new Series(SeriesType.Payment)
  }

  /**
   * The label assigned to each cash flow in the series. Used to annotate
   * each cash flow in an amortisation schedule or calculation proof.
   *
   * @param label containing localised text in singular form e.g. 'Rental' (not 'Rentals')
   */
  public setLabel (label: string): this {
    this._seriesPayment.label = label
    return this
  }

  /**
   * The total number of advances in the series. Default is 1.
   *
   * @param numberOf determining total number of cash flows in series
   * @throws error when numberOf argument is less than 1
   */
  public setNumberOf (numberOf: number): this {
    if (numberOf < 1) {
      throw new Error('The numberOf value must be 1 or greater')
    }
    this._seriesPayment.numberOf = numberOf
    return this
  }

  /**
   * The value of the one or more advances in the series. Leave the amount
   * undefined if it is to be solved.
   *
   * @param amount to assign to each cash flow object created.
   */
  public setAmount (amount: number): this {
    this._seriesPayment.amount = amount
    return this
  }

  /**
   * The posted date of the first advance in the series. Subsequent advance
   * cash flow dates are determined with reference to this date *and* are offset
   * by the interval defined by the series frequency.
   *
   * If the date is not defined it will be computed with reference to the current
   * system date or the end date of a preceding advance series.
   *
   * @param payableFrom posted date of the first cash flow in the series
   */
  public setDueOnOrFrom (payableFrom: Date): this {
    this._seriesPayment.postedDate = payableFrom
    return this
  }

  /**
   * The compounding frequency of recurring advances in the series.
   *
   * @param frequency of the one or more advance cash flows in the series.
   */
  public setFrequency (frequency: Frequency): this {
    this._seriesPayment.frequency = frequency
    return this
  }

  /**
   * The mode of recurring payments in the series.
   *
   * @param mode of the one or more payment cash flows in the series
   */
  public setMode (mode: Mode): this {
    this._seriesPayment.mode = mode
    return this
  }

  /**
   * The weighting of unknown payment series values relative to other unknown advance
   * series values.
   *
   * @param weighting to apply to the payment cash flows in the series
   * @throws error when weighting value is zero or negative
   */
  public setWeighting (weighting: number): this {
    if (!(weighting > 0)) {
      throw new Error(
        'The weighting value must be greater than 0'
      )
    }
    this._seriesPayment.weighting = weighting
    return this
  }

  /**
   * Flag determines whether interest is to be compounded in line with the frequency of this
   * payment series or not. Useful in defining payment series where interest is compounded at
   * a different frequency e.g. monthly payments with quarterly compound interest.
   *
   * @param isIntCap
   */
  public setIsIntCap (isIntCap: boolean): this {
    this._seriesPayment.isIntCap = isIntCap
    return this
  }

  /**
   * Method provides a reference to the populated instance after all user input has
   * been captured.
   */
  public build (): Series {
    return this._seriesPayment
  }
}
