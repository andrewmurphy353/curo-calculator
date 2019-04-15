import DateUtils from "../utils/date-utils";
import Convention from "./convention";
import DayCountFactor from "./day-count-factor";

/**
 * The Actual/ISDA day count convention which follows the ISDA understanding of the
 * actual/actual convention included in the 1991 ISDA Definitions.
 *
 * This convention specifies the actual number of days in the Calculation Period in respect of
 * which payment is being made is divided by 365 (or, if any portion of that Calculation Period
 * falls in a leap year, the sum of:
 * * the actual number of days in that portion of the Calculation Period falling in a leap
 * year divided by 366, and;
 * * the actual number of days in that portion of the Calculation Period falling in a non-leap
 * year divided by 365)
 *
 * This convention is also known as "Actual/Actual", "Actual/Actual (ISDA)", "Act/Act", or
 * "Act/Act (ISDA)"
 */
export default class ActISDA extends Convention {
  private _usePostingDates: boolean;
  private _inclNonFinFlows: boolean;
  private _dayCountRef: string;

  /**
   * Provides an instance of the Actual/Actual (ISDA) day count convention.
   *
   * The default day count instance is suitable for use in all compound interest
   * calculations. With the default setup interest is calculated on the reducing
   * capital balance and is compounded at a frequency typically determined by the
   * time interval between cash flows.
   *
   * For non-compound interest calculations, such as solving for unknowns on the
   * basis of an eXtended Internal Rate of Return (XIRR), set the useXirrMethod
   * constructor parameter to *true*. With this setup the day count is calculated
   * with reference to the first cash flow date in the series.
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
  constructor(
    usePostingDates: boolean = true,
    inclNonFinFlows: boolean = false,
    useXirrMethod: boolean = false
  ) {
    super();
    this._usePostingDates = usePostingDates;
    this._inclNonFinFlows = inclNonFinFlows;
    if (useXirrMethod) {
      this._dayCountRef = ActISDA.DRAWDOWN;
    } else {
      this._dayCountRef = ActISDA.NEIGHBOUR;
    }
  }

  public dayCountRef(): string {
    return this._dayCountRef;
  }

  public usePostingDates(): boolean {
    return this._usePostingDates;
  }

  public inclNonFinFlows(): boolean {
    return this._inclNonFinFlows;
  }

  public computeFactor(d1: Date, d2: Date): DayCountFactor {
    let startDateYear: number = d1.getFullYear();
    const endDateYear: number = d2.getFullYear();
    let periodFactor: DayCountFactor;
    let numerator: number;
    let denominator: number;
    let factor: number = 0;

    if (startDateYear === endDateYear) {
      /*
       * Common case - both dates fall within the same leap-year or non leap-year,
       * so no need to split factor calculation
       */
      numerator = DateUtils.actualDays(d1, d2);
      denominator = DateUtils.isLeapYear(startDateYear) ? 366 : 365;
      factor = numerator / denominator;

      periodFactor = new DayCountFactor(factor);
      periodFactor.logOperands(numerator, denominator);

    } else if (!DateUtils.hasLeapYear(startDateYear, endDateYear)) {
      /*
       * Dates do not span or fall within a leap year
       */
      numerator = DateUtils.actualDays(d1, d2);
      factor = numerator / 365;

      periodFactor = new DayCountFactor(factor);
      periodFactor.logOperands(numerator, 365.0);

    } else {
      /*
       * There is a leap year in the date range so split factor calculation.
       * Handle partial period in year 1, and whole years thereafter (if necessary)
       */
      periodFactor = new DayCountFactor();

      let yearEnd: Date;
      while (startDateYear !== endDateYear) {
        yearEnd = new Date(startDateYear, 11, 31);
        numerator = DateUtils.actualDays(d1, yearEnd);
        denominator = DateUtils.isLeapYear(startDateYear) ? 366.0 : 365.0;
        factor += numerator / denominator;
        if (numerator > 0) {
          // Do not log when numerator 0 (it will be when start date is last day of year)
          periodFactor.logOperands(numerator, denominator);
        }
        d1 = yearEnd;
        startDateYear++;
      }

      // Process partial final year period
      numerator = DateUtils.actualDays(d1, d2);
      denominator = DateUtils.isLeapYear(endDateYear) ? 366.0 : 365.0;
      factor += numerator / denominator;

      periodFactor.factor = factor;
      periodFactor.logOperands(numerator, denominator);
    }

    return periodFactor;
  }
}
