import Convention from './convention'
import DayCountFactor from './day-count-factor'

/**
 * The 30/360 (EU) day count convention which specifies that the number of days in the
 * Calculation or Compounding Period in respect of which payment is being made is
 * divided by 360, calculated on a formula basis as follows:
 *
 * > Day Count Fraction = [[360 ∗ (𝑌𝑌2 − 𝑌𝑌1)] + [30 ∗ (𝑀𝑀2 − 𝑀𝑀1)] + (𝐷𝐷2 − 𝐷𝐷1)] / 360
 *
 * where:
 *
 * * "Y1" is the year, expressed as a number, in which the first day of the Calculation or
 * Compounding Period falls;
 * * "Y2" is the year, expressed as a number, in which the day immediately following the
 * last day included in the Calculation Period or Compounding Period falls;
 * * "M1" is the calendar month, expressed as a number, in which the first day of the Calculation
 * Period or Compounding Period falls;
 * * "M2" is the calendar month, expressed as a number, in which the day immediately following the
 * last day included in the Calculation Period or Compounding Period falls;
 * * "D1" is the first calendar day, expressed as number, of the Calculation Period or Compounding
 * Period, unless such number would be 31, in which case D1 will be 30; and
 * * "D2" is the calendar day, expressed as a number, immediately following the last day included
 * in the Calculation Period or Compounding Period, unless such number would be 31,
 * in which case D2 will be 30.
 *
 * This convention is also known as "30E/360" or "Eurobond basis".
 */
export default class EU30360 extends Convention {
  private readonly _usePostingDates: boolean
  private readonly _inclNonFinFlows: boolean
  private readonly _dayCountRef: string

  /**
   * Provides an instance of the 30/360 (EU) day count convention object.
   *
   * The default day count instance is suitable for use in all compound interest
   * calculations. With the default setup interest is calculated on the reducing
   * capital balance and is compounded at a frequency typically determined by the
   * time interval between cash flows.
   *
   * For non-compound interest calculations, such as solving for unknowns on the
   * basis of an eXtended Internal Rate of Return (XIRR), set the useXirrMethod
   * constructor parameter to *true*. With this setup the day count is calculated
   * with reference to the first cash flow date in the series, in much the same
   * way as the Microsoft Excel XIRR function does [1].
   *
   * [1] The XIRR function in Excel computes time intervals between the first and
   * subsequent cash flow dates using *actual days*, whereas this implementation
   * offers the flexibility to determine those time intervals on a 30/360 day basis.
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
      this._dayCountRef = EU30360.DRAWDOWN
    } else {
      this._dayCountRef = EU30360.NEIGHBOUR
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
    const dd1 = d1.getDate()
    const mm1 = d1.getMonth()
    const yyyy1 = d1.getFullYear()
    const dd2 = d2.getDate()
    const mm2 = d2.getMonth()
    const yyyy2 = d2.getFullYear()

    let z = 0
    if (dd1 === 31) {
      z = 30
    } else {
      z = dd1
    }
    const dt1 = 360 * yyyy1 + 30 * mm1 + z

    if (dd2 === 31) {
      z = 30
    } else {
      // dd2 < 31
      z = dd2
    }
    const dt2 = 360 * yyyy2 + 30 * mm2 + z

    const numerator: number = Math.abs(dt2 - dt1)
    const factor: number = numerator / 360

    const periodFactor: DayCountFactor = new DayCountFactor(factor)
    periodFactor.logOperands(numerator, 360)

    return periodFactor
  }
}
