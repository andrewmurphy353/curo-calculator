import CashFlow from "../profile/cash-flow";
import CashFlowAdvance from "../profile/cash-flow-advance";
import CashFlowPayment from "../profile/cash-flow-payment";

/**
 * A collection of retrieval and validation utility methods.
 */
export default class ProfileUtils {
  /**
   * Retrieve the CashFlowAdvance instance with the earliest posting date,
   * and by extension implicitly confirms the presence of one or more
   * CashFlowAdvance instances within the cash flow series.
   *
   * The posting date of the returned instance serves as the
   * initial drawdown date.
   *
   * @param cashFlows the cash flow series
   * @returns cash outflow instance, or *undefined* to
   * signify a configuration error
   */
  public static firstAdvanceCF(cashFlows: CashFlow[]): CashFlowAdvance {
    return cashFlows
      .filter(c => c instanceof CashFlowAdvance)
      .sort((c1: CashFlow, c2: CashFlow) => {
        if (c1.postingDate < c2.postingDate) {
          return -1;
        } else if (c1.postingDate > c2.postingDate) {
          return 1;
        } else {
          // Posting dates are equal, sort by value date, earliest first
          if (c1.valueDate < c2.valueDate) {
            return -1;
          } else if (c1.valueDate > c2.valueDate) {
            return 1;
          }
          return 0;
        }
      })[0];
  }

  /**
   * Check the cash flow series for the presence of one or more CashFlowPayment
   * instances.
   *
   * @param cashFlows the cash flow series
   * @returns true if found, otherwise false to signify an incorrect
   * configuration
   */
  public static hasPaymentCF(cashFlows: CashFlow[]): boolean {
    return cashFlows.filter(c => c instanceof CashFlowPayment).length > 0;
  }

  /**
   * Check for the valid use of the cash flow isKnown property.
   *
   * Solving for unknown values is a mutually exclusive computation
   * performed on either advances, or payments, not on a mix of both.
   * Note it is permissable to have no unknowns, for example when
   * computing implicit interest rates.
   *
   * @param cashFlows the cash flow series
   * @returns
   */
  public static isUnknownsValid(cashFlows: CashFlow[]): boolean {
    const outHas: boolean =
      cashFlows.filter(c => c instanceof CashFlowAdvance && !c.isKnown).length >
      0;
    const inHas: boolean =
      cashFlows.filter(c => c instanceof CashFlowPayment && !c.isKnown).length >
      0;
    if (outHas && inHas) {
      return false;
    }
    return true;
  }

  /**
   * Check for the valid use of the CashFlowPayment isIntCapitalised
   * property.
   *
   * It is permissable to define a frequency of interest capitalisation
   * that differs from the CashFlowPayment frequency. So to avoid the lost
   * of accrued interest not yet capitalised it is important that the
   * final CashFlowPayment object in the cash flow series always has the
   * isIntCapitalised property set to true.
   *
   * @param cashFlows the cash flow series
   * @returns
   */
  public static isIntCapValid(cashFlows: CashFlow[]): boolean {
    // Extract and sort date descending
    const cfsDesc = cashFlows
      .filter(c => c instanceof CashFlowPayment)
      .sort((c1: CashFlow, c2: CashFlow) => {
        if (c1.postingDate < c2.postingDate) {
          return 1;
        } else if (c1.postingDate > c2.postingDate) {
          return -1;
        } else {
          return 0;
        }
      });
    // Extract objects sharing the same final posting date and test
    const cfs = cfsDesc.filter(
      c => c.postingDate.getTime() === cfsDesc[0].postingDate.getTime()
    );
    for (const cf of cfs) {
      if ((cf as CashFlowPayment).isIntCapitalised()) {
        return true;
      }
    }
    return false;
  }
}
