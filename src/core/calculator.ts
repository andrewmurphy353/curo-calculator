import Convention from "../day-count/convention";
import Profile from "../profile/profile";
import CashFlowBuilder from "../series/cash-flow-builder";
import Series from "../series/series";
import DateUtils from "../utils/date-utils";
import MathUtils from "../utils/math-utils";
import SolveCashFlow from "./solve-cash-flow";
import SolveNfv from "./solve-nfv";
import SolveRoot from "./solve-root";

/**
 * The calculator class provides the entry point for solving unknown values
 * and/or unknown interest rates implicit in a cash flow series.
 *
 * @author Andrew Murphy
 */
export default class Calculator {
  private _precision: number;
  private _profile!: Profile;
  private _isBespokeProfile: boolean;
  private _series: Series[];

  /**
   * Instantiates a calculator instance.
   *
   * @param precision (optional) the number of fractional digits to apply in the
   * rounding of cash flow values in the notional currency. Default is 2, with valid
   * options being 0, 2, 3 and 4
   * @param profile (optional) containing a bespoke collection of cash flows
   * created manually. Use with caution, and only then if the default profile
   * builder doesn't handle a specific use case. Be aware that the precision defined
   * in a bespoke profile takes precedence, hence will override any precision
   * value passed as an argument to this constructor.
   */
  constructor(precision: number = 2, profile?: Profile) {
    switch (profile === undefined ? precision : profile.precision) {
      /* istanbul ignore next */
      case 0:
      case 2:
      case 3:
      case 4:
        this._precision = profile === undefined ? precision : profile.precision;
        break;
      default:
        throw new Error(
          `The precision of ${precision} is unsupported. Valid options are 0, 2, 3 or 4`
        );
    }
    if (profile === undefined) {
      this._isBespokeProfile = false;
    } else {
      this._isBespokeProfile = true;
      this._profile = profile;
    }
    this._series = [];
  }

  /**
   * Returns the number of fractional digits used in the rounding of
   * cash flow values.
   */
  get precision(): number {
    return this._precision;
  }

  /**
   * Returns a reference to the cash flow profile.
   */
  get profile(): Profile {
    if (this._profile === undefined) {
      throw new Error("The profile has not been initialised yet.");
    }
    return this._profile;
  }

  /**
   * Adds a cash flow series item to the series array.
   *
   * Please note the order of addition is important for *undated* series
   * items, as the internal computation of cash flow dates is inferred
   * from the natural order of the series array. Hence a more recent
   * undated series addition is deemed to follow on from another added
   * previously.
   *
   * *Dated* series are unaffected and will use the series start-date provided.
   *
   * @param seriesItem
   */
  public add(seriesItem: Series): void {
    if (this._isBespokeProfile) {
      throw new Error(
        "The add(seriesItem) option cannot be used with a user-defined profile."
      );
    }
    // Coerce series monetary amount to specified precision
    if (seriesItem.amount !== undefined) {
      seriesItem.amount = MathUtils.gaussRound(seriesItem.amount, this._precision);
    }

    this._series.push(seriesItem);
  }

  /**
   * Solves for an unknown value or values.
   *
   * @param dayCount the convention for determining time intervals
   * between cash flows
   * @param intRate the annual effective interest rate expressed as a decimal
   * e.g. 5.25% is 0.0525 as a decimal
   * @returns the value result, fully weighted
   */
  public solveValue(dayCount: Convention, intRate: number) {
    if (this._profile === undefined && !this._isBespokeProfile) {
      this.buildProfile();
    }

    let value = SolveRoot.solve(
      new SolveCashFlow(this.profile, dayCount, intRate)
    );
    value = this.profile.updateValues(value, true);
    this.profile.updateAmortInt(intRate);
    return MathUtils.gaussRound(value, this.precision);
  }

  /**
   * Solves for an unknown interest rate.
   *
   * @param dayCount the convention for determining time intervals
   * between cash flows
   * @returns the interest rate result, expressed as a *decimal*
   */
  public solveRate(dayCount: Convention): number {
    if (this._profile === undefined && !this._isBespokeProfile) {
      this.buildProfile();
    }
    return SolveRoot.solve(new SolveNfv(this.profile, dayCount));
  }

  /**
   * Utility method that builds the profile from the cash flow
   * series passed to the add() method.
   *
   */
  private buildProfile(): void {
    const today: Date = DateUtils.dateToUTC(new Date());
    const cashFlows = CashFlowBuilder.build(this._series, today);
    this._profile = new Profile(cashFlows, this._precision);
  }
}
