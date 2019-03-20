import MathUtils from "../utils/math-utils";

/**
 * The day count factor applied to the associated cash flow.
 *
 * @author Andrew Murphy
 */
export default class DayCountFactor {
  private _factor: number;
  private _operandLog: string[];

  constructor(factor: number = 0) {
    this._factor = factor;
    this._operandLog = [];
  }

  get factor(): number {
    return this._factor;
  }

  set factor(factor: number) {
    this._factor = factor;
  }

  get operandLog(): string[] {
    return this._operandLog;
  }

  /**
   * Logs the operands used in deriving the factor. This is useful in constructing
   * calculation proofs, for example to demonstrate how an Annual Percentage
   * Rate (APR) or eXtended Internal Rate of Return (XIRR) was derived.
   *
   * @param numer the numerator defined in days or whole weeks, months or years
   * between two dates
   * @param denom the denominator corresponding to the number of days, weeks or months
   * in a year
   */
  public logOperands(numer: number, denom: number): void {
    this._operandLog.push(`(${numer}/${denom})`);
  }

  /**
   * Provides a string representation of the factor equation,
   * with the factor displayed to 8 decimal points
   * e.g. '(31/360) = 0.08611111'
   */
  get toString(): string {
    let displayText = "";
    for (let i = 0; i < this._operandLog.length; i++) {
      displayText = displayText.concat(this._operandLog[i]);
      if (i + 1 !== this._operandLog.length) {
        displayText = displayText.concat(" + ");
      }
    }
    displayText = displayText.concat(" = ");
    displayText = displayText.concat(
      MathUtils.gaussRound(this.factor, 8).toFixed(8)
    );
    return displayText.toString();
  }
}
