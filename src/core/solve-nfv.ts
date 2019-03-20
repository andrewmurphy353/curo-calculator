import Convention from "../day-count/convention";
import CashFlowCharge from "../profile/cash-flow-charge";
import CashFlowPayment from "../profile/cash-flow-payment";
import Profile from "../profile/profile";
import Callback from "./callback";

/**
 * Implementation of the function for finding the interest rate where the
 * net future value (nfv) of cash flows equals zero.
 *
 * Unlike the similar net present value (npv) calculation solved algebraically
 * using regular time periods, this function is designed to find the unknown
 * interest rate where time periods may be regular or irregular.
 *
 * @author Andrew Murphy
 */
export default class SolveNfv implements Callback {
  /**
   * Provides an instance of the SolveNfv object
   *
   * @param profile containing the cash flow series
   * @param dayCount day count convention to use
   */
  constructor(
    private profile: Profile,
    private dayCount: Convention
  ) {
    profile.assignFactors(this.dayCount);
  }

  public label(): string {
    return "Net Future Value";
  }

  /**
   * Implementation of the callback function to compute the net future value
   * of the cash flow series using the given interest rate.
   * @param rateGuess interest rate guess, or actual rate if known
   *
   */
  public compute(rateGuess: number): number {
    let capBal: number = 0;

    switch (this.profile.dayCount.dayCountRef()) {
      case Convention.DRAWDOWN:
        for (const cashFlow of this.profile.cashFlows) {
          if (
            cashFlow instanceof CashFlowCharge && !this.profile.dayCount.inclNonFinFlows()
          ) {
            continue;
          }
          capBal +=
            cashFlow.value *
            Math.pow(1 + rateGuess, -cashFlow.periodFactor.factor);
        }
        break;

      case Convention.NEIGHBOUR:
      default:
        let periodInt: number;
        let accruedInt: number = 0;
        for (const cashFlow of this.profile.cashFlows) {
          if (
            cashFlow instanceof CashFlowCharge && !this.profile.dayCount.inclNonFinFlows()
          ) {
            continue;
          }

          periodInt = capBal * rateGuess * cashFlow.periodFactor.factor;

          if (cashFlow instanceof CashFlowPayment) {
            if (cashFlow.isIntCapitalised()) {
              capBal += accruedInt + periodInt + cashFlow.value;
              accruedInt = 0;
            } else {
              accruedInt += periodInt;
              capBal += cashFlow.value;
            }
            continue;
          }

          // Cash outflows
          capBal += periodInt;
          capBal += cashFlow.value;
        }
        break;
    }
    return capBal;
  }
}
