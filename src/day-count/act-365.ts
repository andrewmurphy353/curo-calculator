import DateUtils from '../utils/date-utils'
import Convention from './convention'
import DayCountFactor from './day-count-factor'

/**
 * The Actual/365 day count convention which specifies that the number of days in the
 * Calculation Period or Compounding Period in respect of which payment is being made is
 * divided by 365.
 *
 * This convention is also known as "Act/365 Fixed"
 */
export default class Act365 extends Convention {
  private readonly _usePostingDates: boolean
  private readonly _inclNonFinFlows: boolean
  private readonly _dayCountRef: string

  /**
     * Provides an instance of the Act/365 day count convention object.
     *
     * The default day count instance is suitable for use in all compound interest
     * calculations. With the default setup interest is calculated on the reducing
     * capital balance and is compounded at a frequency typically determined by the
     * time interval between cash flows.
     *
     * For non-compound interest calculations, such as solving for unknowns on the
     * basis of an eXtended Internal Rate of Return (XIRR), set the useXirrMethod
     * constructor parameter to *true*. With this setup the day count is calculated
     * with reference to the first cash flow date in the series, which is how the
     * Microsoft Excel XIRR function works.
     *
     * @param usePostingDates (optional) defines whether the day count between
     * cash flows is computed using cash flow posting dates (true), or alternatively
     * cash flow value dates (false). Default is true.
     * @param inclNonFinFlows (optional) determines whether non-financing cash
     * flows, such as charges or fees within the cash flow profile, are included
     * in the computation of periodic factors. Default is false.
     * @param useXirrMethod (optional) determines whether to use the XIRR method
     * of determining time periods between cash flow dates (true). Default is false.
     */
  constructor (
    usePostingDates = true,
    inclNonFinFlows = false,
    useXirrMethod = false
  ) {
    super()
    this._usePostingDates = usePostingDates
    this._inclNonFinFlows = inclNonFinFlows
    if (useXirrMethod) {
      this._dayCountRef = Act365.DRAWDOWN
    } else {
      this._dayCountRef = Act365.NEIGHBOUR
    }
  }

  public dayCountRef (): string {
    return this._dayCountRef
  }

  public usePostingDates (): boolean {
    return this._usePostingDates
  }

  public inclNonFinFlows (): boolean {
    return this._inclNonFinFlows
  }

  public computeFactor (d1: Date, d2: Date): DayCountFactor {
    const numerator: number = DateUtils.actualDays(d1, d2)
    const factor: number = numerator / 365

    const periodFactor: DayCountFactor = new DayCountFactor(factor)
    periodFactor.logOperands(numerator, 365)

    return periodFactor
  }
}
