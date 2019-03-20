import DayCountFactor from "../day-count/day-count-factor";
import MathUtils from "../utils/math-utils";

/**
 * Represents the movement of money, inbound or outbound.
 *
 * @author Andrew Murphy
 */
export default abstract class CashFlow {
  public periodFactor!: DayCountFactor;
  private _postingDate: Date;
  private _valueDate: Date;
  private _value: number;
  private _isKnown: boolean;
  private _weighting: number;
  private _label: string;

  /**
   * Base constructor for derive classes to override.
   *
   * @param postingDate or due date of the cash flow value
   * @param valueDate or settlement date of the cashflow value
   * @param value (optional) the cash flow value if known, alternatively *undefined* if
   * unknown and to be computed
   * @param weighting (optional) the weighting applied to the cash flow relative
   * to other *unknown* cash flow values in the series. Note, the weighting has no effect
   * when applied to known cash flow values. Default value is 1.0
   * @param label free text description of the cash flow e.g. Loan, Payment, Fee, etc.
   */
  constructor(
    postingDate: Date,
    valueDate: Date,
    value?: number,
    weighting?: number,
    label: string = ""
  ) {
    this._postingDate = new Date(
      Date.UTC(
        postingDate.getFullYear(),
        postingDate.getMonth(),
        postingDate.getDate()
      )
    );
    this._valueDate = new Date(
      Date.UTC(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
    );
    if (this._valueDate.getTime() < this._postingDate.getTime()) {
      throw new Error("Cash flow value-date cannot predate the posting-date.");
    }
    if (value === undefined) {
      this._isKnown = false;
      this._value = 0;
    } else {
      this._isKnown = true;
      this._value = value;
    }
    if (weighting === undefined) {
      this._weighting = 1.0;
    } else {
      this._weighting = Math.abs(weighting);
    }
    this._label = label;
  }

  /**
   * The posting date defines the due date of the cash flow.
   */
  get postingDate(): Date {
    return this._postingDate;
  }

  /**
   * The value date defines the settlement date of the cash flow.
   * It should not predate the posting date.
   */
  get valueDate(): Date {
    return this._valueDate;
  }

  /**
   * The cash flow value which will be positive or negative in
   * accordance with cash flow sign convention.
   */
  get value(): number {
    return this._value;
  }

  /**
   * Updates the cash flow value, taking into account the weighting factor.
   * @param value to apply to unknown cash flow values
   * @param precision (optional) the number of fractional digits to apply in
   * the rounding of unknown cash flow values. Should only be defined once the
   * unknown value has been solved.
   */
  public updateValue(value: number, precision?: number) {
    if (precision === undefined) {
      // No rounding
      this._value = value * this._weighting;
    } else {
      this._value = MathUtils.gaussRound(value * this._weighting, precision);
    }
  }

  /**
   * Flag indicating whether the cash flow value is known, or is to be computed.
   */
  get isKnown(): boolean {
    return this._isKnown;
  }

  /**
   * The weighting to be applied to the cash flow when the value is unknown.
   * The weighting determines the scale of an unknown cash flow value relative
   * to other unknown cash flows in a cash flow series.
   */
  get weighting(): number {
    return this._weighting;
  }

  /**
   * Free text label describing cash flow
   */
  get label(): string {
    return this._label;
  }
}
