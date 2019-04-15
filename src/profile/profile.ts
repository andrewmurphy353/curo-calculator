import Convention from "../day-count/convention";
import US30360 from "../day-count/us-30-360";
import MathUtils from "../utils/math-utils";
import ProfileUtils from "../utils/profile-utils";
import CashFlow from "./cash-flow";
import CashFlowAdvance from "./cash-flow-advance";
import CashFlowCharge from "./cash-flow-charge";
import CashFlowPayment from "./cash-flow-payment";

/**
 * A container for a series of cash in-flows and out-flows.
 *
 * @author Andrew Murphy
 */
export default class Profile {
  private _cashFlows: CashFlow[];
  private _dayCount: Convention;
  private _drawdownPDate: Date;
  private _drawdownVDate: Date;
  private _precision: number;

  /**
   * Instantiates a profile instance and performs basic validation.
   *
   * @param cashFlows the collection of advance, payment and charge cash flow objects
   * @param precision (optional) the number of fractional digits to apply in the
   * rounding of cash flow values in the notional currency. Default is 2, with valid
   * options being 0, 2, 3 and 4
   */
  constructor(cashFlows: CashFlow[], precision: number = 2) {
    this._cashFlows = cashFlows;
    switch (precision) {
      /* istanbul ignore next */
      case 0:
      case 2:
      case 3:
      case 4:
        this._precision = precision;
        break;
      default:
        throw new Error(
          `The precision of ${precision} is unsupported. Valid options are 0, 2, 3 or 4`
        );
    }
    this._dayCount = new US30360();

    const initialDrawdown: CashFlowAdvance = ProfileUtils.firstAdvanceCF(
      cashFlows
    );
    if (initialDrawdown !== undefined) {
      this._drawdownPDate = initialDrawdown.postingDate;
      this._drawdownVDate = initialDrawdown.valueDate;
    } else {
      /* istanbul ignore next: covered by profile-utils.spec.ts */
      throw new Error(
        "The profile must have at least one instance of CashFlowAdvance defined."
      );
    }

    if (!ProfileUtils.hasPaymentCF(cashFlows)) {
      /* istanbul ignore next: covered by profile-utils.spec.ts */
      throw new Error(
        "The profile must have at least one instance of CashFlowPayment defined."
      );
    }

    if (!ProfileUtils.isUnknownsValid(cashFlows)) {
      /* istanbul ignore next: covered by profile-utils.spec.ts */
      throw new Error(
        "The profile should not contain a mix of CashFlowAdvance and CashFlowPayment objects with unknown values."
      );
    }

    if (!ProfileUtils.isIntCapValid(cashFlows)) {
      /* istanbul ignore next: covered by profile-utils.spec.ts */
      throw new Error(
        "The last CashflowPayment object in the profile must have the isIntCapitalised property set to 'true'."
      );
    }
  }

  /**
   * The cash flow series.
   */
  get cashFlows(): CashFlow[] {
    return this._cashFlows;
  }

  /**
   * The day count convention applied to cash flows in the series.
   */
  get dayCount(): Convention {
    return this._dayCount;
  }

  /**
   * The posting date of the *first drawdown*. Analogous to a contract date.
   */
  get drawdownPDate(): Date {
    return this._drawdownPDate;
  }

  /**
   * The value date of the *first drawdown*. This date is expected to occur on or
   * after the drawdown posting date and is used specifically in deferred settlement
   * calculations.
   */
  get drawdownVDate(): Date {
    return this._drawdownVDate;
  }

  /**
   * The number of fractional digits to apply in the rounding of cash flow values.
   */
  get precision() {
    return this._precision;
  }

  /**
   * Assigns day count factors to each cash flow in the series.
   *
   * @param dayCount day count convention to use in determining time factors
   */
  public assignFactors(
    dayCount: Convention
  ): void {
    this._dayCount = dayCount;
    this.sortCashflows();
    this.computeFactors();
  }

  /**
   * Updates the value of cash flows flagged as unknown.
   *
   * @param value the value to assign, which may be negative or positive
   * @param isRounded flag to control rounding of the value prior to update.
   * Rounding should only be undertaken *after* an unknown value has been computed.
   * Default is false, no rounding.
   * @returns value, unmodified or rounded as appropriate
   */
  public updateValues(value: number, isRounded: boolean = false): number {
    for (const cashFlow of this._cashFlows) {
      if (!cashFlow.isKnown) {
        if (isRounded) {
          cashFlow.updateValue(value, this._precision);
        } else {
          cashFlow.updateValue(value);
        }
      }
    }
    return value;
  }

  /**
   * Updates the amortised interest value of payment cash flows
   * once the unknown values have been determined.
   *
   * @param intRate annual effective interest rate to use in calculating the
   * interest monetary value
   */
  public updateAmortInt(intRate: number): void {
    let capBal: number = 0;
    let periodInt: number;
    let accruedInt: number = 0;

    for (const cashFlow of this._cashFlows) {
      if (cashFlow instanceof CashFlowCharge) {
        continue;
      }
      periodInt = MathUtils.gaussRound(
        capBal * intRate * cashFlow.periodFactor.factor,
        this._precision
      );
      if (cashFlow instanceof CashFlowPayment) {
        if (cashFlow.isIntCapitalised()) {
          cashFlow.interest = MathUtils.gaussRound(
            accruedInt + periodInt,
            this._precision
          );
          capBal += cashFlow.interest + cashFlow.value;
          accruedInt = 0;
        } else {
          cashFlow.interest = 0;
          accruedInt += periodInt;
          capBal += cashFlow.value;
        }
        continue;
      }
      // Cash out flows
      capBal += periodInt + cashFlow.value;
    }

    // Modify interest total in the last cash flow due to account for decrepancies
    // arising from the cumulative effect of rounding differences
    for (let cf = this._cashFlows.length - 1; cf >= 0; cf--) {
      const cashFlow = this._cashFlows[cf];
      if (cashFlow instanceof CashFlowPayment) {
        cashFlow.interest = MathUtils.gaussRound(
          cashFlow.interest - capBal,
          this._precision
        );
        break;
      }
    }
  }

  /**
   * Sort the cash flow series, first in date ascending order, then
   * by instance type CashFlowAdvance first.
   */
  private sortCashflows() {
    this._cashFlows.sort((cf1: CashFlow, cf2: CashFlow) => {
      if (this.dayCount.usePostingDates()) {
        if (cf1.postingDate < cf2.postingDate) {
          return -1;
        } else if (cf1.postingDate > cf2.postingDate) {
          return 1;
        }
      } else {
        if (cf1.valueDate < cf2.valueDate) {
          return -1;
        } else if (cf1.valueDate > cf2.valueDate) {
          return 1;
        }
      }
      if (cf1 instanceof CashFlowPayment && cf2 instanceof CashFlowPayment) {
        // Payment objects share the same date, order by
        // isIntCapitalised, false values first
        return (cf1.isIntCapitalised() === cf2.isIntCapitalised()) ? 0 : cf1.isIntCapitalised() ? 1 : -1;
      }
      return cf1 instanceof CashFlowAdvance ? -1 : 1;
    });
  }

  /**
   * Compute the cash flow periodic factors using the day count convention
   * implementation provided.
   */
  private computeFactors(): void {
    const drawdownDate = this.dayCount.usePostingDates() ? this._drawdownPDate : this._drawdownVDate;
    let cashFlowDate: Date;
    let neighbourDate: Date | undefined;

    for (const cashFlow of this._cashFlows) {

      cashFlowDate = this.dayCount.usePostingDates() ? cashFlow.postingDate : cashFlow.valueDate;
      if (neighbourDate === undefined) {
        neighbourDate = cashFlowDate;
      }

      if (cashFlow instanceof CashFlowCharge && !this.dayCount.inclNonFinFlows()) {
        cashFlow.periodFactor = this.dayCount.computeFactor(cashFlowDate, cashFlowDate);
        continue;
      }

      if (cashFlowDate <= drawdownDate) {
        // CashFlow predates initial drawdown so period factor is zero
        cashFlow.periodFactor = this.dayCount.computeFactor(cashFlowDate, cashFlowDate);

      } else {
        switch (this._dayCount.dayCountRef()) {
          case Convention.DRAWDOWN:
            cashFlow.periodFactor = this.dayCount.computeFactor(drawdownDate, cashFlowDate);
            break;
          case Convention.NEIGHBOUR:
          default:
            cashFlow.periodFactor = this.dayCount.computeFactor(neighbourDate, cashFlowDate);
            neighbourDate = cashFlowDate;
            break;
        }
      }
    }
  }
}
