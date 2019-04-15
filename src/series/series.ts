import { Frequency } from "./frequency";
import { Mode } from "./mode";
import { SeriesType } from "./series-type";

/**
 * A generic class containing a superset of cash flow series properties.
 *
 * This class should not be instantiated directly. Use the SeriesAdvance, SeriesCharge
 * and SeriesPayment classes to build the respective series.
 */
export default class Series {
  public numberOf: number;
  public frequency: Frequency;
  public label: string | undefined;
  public amount: number | undefined;
  public mode: Mode;
  public postedDate: Date | undefined;
  public valueDate: Date | undefined;
  public weighting: number;
  public isIntCap: boolean;
  private _seriesType: SeriesType;

  constructor(seriesType: SeriesType) {
    this._seriesType = seriesType;
    this.numberOf = 1.0;
    this.frequency = Frequency.Monthly;
    this.mode = Mode.Advance;
    this.weighting = 1.0;
    this.isIntCap = true;
  }

  get seriesType(): SeriesType {
    return this._seriesType;
  }
}
