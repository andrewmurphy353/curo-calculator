/**
 * Math utilities class
 */
export default class MathUtils {
  /**
   * Perform gaussian rounding, also known as “bankers” rounding, convergent rounding, Dutch rounding,
   * or odd–even rounding. This is a method of rounding without statistical bias; regular rounding
   * has a native upwards bias. Gaussian rounding avoids this by rounding to the nearest even
   * number.
   *
   * Source (Tim Down): http://stackoverflow.com/a/3109234
   *
   * @param num to round
   * @param precision (optional) number of decimal places. Default is 0
   */
  public static gaussRound(num: number, precision: number = 0): number {
    const d = precision;
    const m = Math.pow(10, d);
    const n = +(d ? num * m : num).toFixed(8);
    const i = Math.floor(n);
    const f = n - i;
    const e = 1e-8;
    const r =
      f > 0.5 - e && f < 0.5 + e
        ? i % 2 === 0
          ? i
          : i + 1
        : /* istanbul ignore next */ Math.round(n);
    return d ? r / m : r;
  }
}
