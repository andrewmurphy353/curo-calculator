import DateUtils from '../utils/date-utils'
import Convention from './convention'
import DayCountFactor from './day-count-factor'

/**
 * The European Union Directive 2008/48/EC (Consumer Credit Directive) day count
 * convention, used exclusively within EU member states in the computation of the
 * Annual Percentage Rate of Charge (APRC) for consumer credit agreements.
 *
 * An APRC is used as a measure of the total cost of the credit to the consumer,
 * expressed as an annual percentage of the total amount of credit.
 *
 * The document containing the rules for determining time intervals can be found at
 * https://ec.europa.eu/info/sites/info/files/guidelines_final.pdf (see ANNEX 1,
 * section 4.1.1)
 *
 * @author Andrew Murphy
 */
export default class EU200848EC extends Convention {
  public static YEAR = 'year'
  public static MONTH = 'month'
  public static WEEK = 'week'
  private readonly _frequency: string
  /** Periods in year */
  private readonly _periodsInYr: number

  /**
   * Provides an instance of the 2008/48/EC day count convention object
   * for solving the Annual Percentage Rate (APR) of charge for consumer
   * credit transactions throughout the European Union.
   *
   * @param frequency the interval between dates used in the calculation.
   * Options are 'year', 'month' or 'week'. For the choice among years,
   * months or weeks, consideration should be given to the frequency of
   * drawdowns and payments within the cash flow series. Refer to the
   * directive for further guidance. Default is 'month' if undefined.
   */
  constructor (frequency: string = EU200848EC.MONTH) {
    super()
    switch (frequency) {
      case EU200848EC.YEAR:
        this._frequency = EU200848EC.YEAR
        this._periodsInYr = 1
        break
      case EU200848EC.WEEK:
        this._frequency = EU200848EC.WEEK
        this._periodsInYr = 52
        break
      case EU200848EC.MONTH:
      default:
        this._frequency = EU200848EC.MONTH
        this._periodsInYr = 12
        break
    }
  }

  public frequency (): string {
    return this._frequency
  }

  public dayCountRef (): string {
    return EU200848EC.DRAWDOWN
  }

  public usePostingDates (): boolean {
    return true
  }

  public inclNonFinFlows (): boolean {
    return true
  }

  /**
   * Computes the time interval between dates, expressed in periods defined by the cash flow
   * series frequency. Where the interval between dates used in the calculation cannot be
   * expressed in whole periods, the interval is expressed in whole periods and remaining
   * number of days divided by 365 (or 366 in a leap-year), calculated *backwards* from the
   * cash flow date to the initial drawdown date.
   *
   * @param d1 the initial drawdown date
   * @param d2 posting date of the cash flow
   */
  public computeFactor (d1: Date, d2: Date): DayCountFactor {
    // Compute whole periods
    let wholePeriods = 0
    let startWholePeriod: Date = d2
    while (true) {
      let tempDate: Date
      switch (this._frequency) {
        case EU200848EC.YEAR:
          tempDate = DateUtils.rollMonth(startWholePeriod, -12)
          break
        case EU200848EC.WEEK:
          tempDate = DateUtils.rollDay(startWholePeriod, -7)
          break
        case EU200848EC.MONTH:
        default:
          tempDate = DateUtils.rollMonth(startWholePeriod, -1)
          break
      }
      if (tempDate >= d1) {
        startWholePeriod = tempDate
        wholePeriods++
      } else {
        break
      }
    }
    const periodFactor: DayCountFactor = new DayCountFactor(0)
    let factor = 0
    if (wholePeriods > 0) {
      factor = wholePeriods / this._periodsInYr
      periodFactor.factor = factor
      periodFactor.logOperands(wholePeriods, this._periodsInYr)
    }

    // Compute days remaining if necessary
    if (startWholePeriod >= d1) {
      const numerator: number = DateUtils.actualDays(d1, startWholePeriod)
      const startDenPeriod: Date = DateUtils.rollMonth(startWholePeriod, -12)
      const denominator: number = DateUtils.actualDays(
        startDenPeriod,
        startWholePeriod
      )
      periodFactor.factor = factor + numerator / denominator

      if (numerator > 0 || periodFactor.operandLog.length === 0) {
        periodFactor.logOperands(numerator, denominator)
      }
    }

    return periodFactor
  }
}
