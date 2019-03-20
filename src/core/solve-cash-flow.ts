import Convention from "../day-count/convention";
import Profile from "../profile/profile";
import Callback from "./callback";
import SolveNfv from "./solve-nfv";

/**
 * Implementation of the function for finding an unknown cash flow value or values.
 *
 * @author Andrew Murphy
 */
export default class SolveCashFlow implements Callback {
  /**
   * Provides an instance of the SolveCashFlow object
   *
   * @param profile containing the cash flow series
   * @param dayCount day count convention to use
   * @param effectiveRate interest rate guess
   */
  constructor(
    private profile: Profile,
    private dayCount: Convention,
    private effectiveRate: number
  ) {
    this.profile.assignFactors(this.dayCount);
  }

  public label(): string {
    return "Cash Flow Value";
  }

  /**
   * Implementation of the callback function to compute the unknown
   * cash flow value/s where the cash flow value guess, compounded at the effective
   * interest rate results in a net future value of zero.
   *
   * @param guess
   */
  public compute(guess: number): number {
    this.profile.updateValues(guess);
    const nfv = new SolveNfv(this.profile, this.dayCount);
    return nfv.compute(this.effectiveRate);
  }
}
