import DayCountFactor from "./day-count-factor";

/**
 * Defines the contract for day count convention concrete implementations.
 *
 * @author Andrew Murphy
 */
export default abstract class Convention {
  /** Days in a period are counted with reference to the initial draw-down date */
  public static DRAWDOWN: string = "drawdown";
  /** Days in a period are counted with reference to a neighbouring cash-flow date */
  public static NEIGHBOUR: string = "neighbour";

  /**
   * The day count reference method defining whether a day count should
   * be computed with reference to:
   * * *Convention.DRAWDOWN*: the *initial drawdown* posting date. This is used
   * in Annual Percentage Rate (APR) and eXtended Internal Rate of Return (XIRR)
   * interest rate calculations; or
   * * *Convention.NEIGHBOUR*: a neighbouring cash flow date. This demarcates the
   * compounding period between cash flows and is the common use case when solving
   * unknown values and/or implicit effective interest rates.
   */
  public abstract dayCountRef(): string;

  /**
   * Defines whether the day count between cash flows is computed
   * using cash flow posting dates (true), or alternatively cash flow
   * value dates (false).
   *
   * Posting dates are generally to be used at all times. Value dates
   * are only to be used in limited cases, for example to determine a
   * lender's Internal Rate of Return (IRR) where the settlement of cash
   * advances is deferred in 0% and low interest rate promotions
   * underwritten for third-party equipment suppliers.
   */
  public abstract usePostingDates(): boolean;

  /**
   * Determines whether non-financing cash flows, such as charges or
   * fees within the cash flow profile, are included in the computation
   * of periodic factors.
   *
   * Generally speaking non-financing cash flows should be excluded (false)
   * when solving for unknown financing cash flow values or interest rates.
   * In limited circumstances however it may be necessary to include
   * them (true), for example in the European Union where consumer credit
   * legislation requires the inclusion of certain associated charges in the
   * calculation of the Annual Percentage Rate of Charge (APRC). In such cases
   * it is important that the cash flow profile only incorporates those charges
   * which are required to be included in the APR calculation.
   */
  public abstract inclNonFinFlows(): boolean;

  /**
   * Computes the periodic factor for a given day count convention.
   *
   * @param d1 the earlier of two dates
   * @param d2 the later of two dates
   */
  public abstract computeFactor(d1: Date, d2: Date): DayCountFactor;
}
