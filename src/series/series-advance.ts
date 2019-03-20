import { Frequency } from "./frequency";
import { Mode } from "./mode";
import Series from "./series";
import { SeriesType } from "./series-type";

/**
 * A series of one or more advances paid out by a lender. This could comprise a series of
 * amounts loaned to a borrower, a lessor's net investment in a lease agreement, etc.
 * 
 * This class implements the builder pattern to provide a fluent-type API.
 */
export default class SeriesAdvance {
  /**
   * Instantiates a default instance of this class to capture user-defined input
   */
  public static builder(): SeriesAdvance {
    return new SeriesAdvance();
  }

  private _seriesAdvance: Series;

  private constructor() {
    this._seriesAdvance = new Series(SeriesType.Advance);
  }

  /**
   * The label assigned to each cash flow in the series. Used to annotate
   * each cash flow in an amortisation schedule or calculation proof.
   * 
   * @param label containing localised text in singular form e.g. 'Loan advance'
   */
  public setLabel(label: string): this {
    this._seriesAdvance.label = label;
    return this;
  }

  /**
   * The total number of advances in the series. Default is 1.
   * 
   * @param numberOf determining total number of cash flows in series
   * @throws error when numberOf argument is less than 1
   */
  public setNumberOf(numberOf: number): this {
    if (numberOf < 1) {
      throw new Error("The numberOf value must be 1 or greater");
    }
    this._seriesAdvance.numberOf = Math.floor(numberOf);
    return this;
  }

  /**
   * The value of the one or more advances in the series. Leave the amount
   * undefined if it is to be solved.
   * 
   * @param amount to assign to each cash flow object created.
   */
  public setAmount(amount: number): this {
    this._seriesAdvance.amount = amount;
    return this;
  }

  /**
   * The posted or drawdown date of the first advance in the series. Subsequent advance
   * drawdown dates are determined with reference to this date *and* are offset
   * by the interval defined by the series frequency.
   *
   * If the date is not defined it will be computed with reference to the current
   * system date or the end date of a preceding advance series.
   *
   * @param creditedFrom posted date of the first cash flow in the series
   */
  public setDrawdownFrom(creditedFrom: Date): this {
    this._seriesAdvance.postedDate = creditedFrom;
    return this;
  }

  /**
   * The value or settlement date of the first advance in the series. This date is expected
   * to fall on or after the setDrawdownFrom date. Subsequent advance settlement dates
   * are determined with reference to this date *and* are offset by the interval
   * defined by the series frequency.
   * 
   * The series value date will usually differ from the posted date only when the
   * advance series models a deferred settlement scheme.
   * 
   * If the date is not defined it will share the same setDrawdownFrom date.
   * 
   * @param settlement value date of the first cash flow in the series
   */
  public setSettlementOn(settlement: Date): this {
    this._seriesAdvance.valueDate = settlement;
    return this;
  }

  /**
   * The compounding frequency of recurring advances in the series.
   * 
   * @param frequency of the one or more advance cash flows in the series.
   */
  public setFrequency(frequency: Frequency): this {
    this._seriesAdvance.frequency = frequency;
    return this;
  }

  /**
   * The mode of recurring advances in the series.
   * 
   * @param mode of the one or more advance cash flows in the series
   */
  public setMode(mode: Mode) {
    this._seriesAdvance.mode = mode;
    return this;
  }

  /**
   * The weighting of unknown advance series values relative to other unknown advance
   * series values.
   * 
   * @param weighting to apply to the advance cash flows in the series
   * @throws error when weighting value is zero or negative
   */
  public setWeighting(weighting: number) {
    if (!(weighting > 0)) {
      throw new Error(
        "The AdvanceSeries weighting value must be greater than 0"
      );
    }
    this._seriesAdvance.weighting = weighting;
    return this;
  }

  /**
   * Method provides a reference to the populated instance once input has been validated.
   * 
   */
  public build(): Series {
    if (
      this._seriesAdvance.valueDate !== undefined &&
      this._seriesAdvance.postedDate === undefined
    ) {
      throw new Error(
        "The Advance drawdown date must be entered when a settlement date is defined."
      );
    } else if (
      this._seriesAdvance.postedDate !== undefined &&
      this._seriesAdvance.valueDate !== undefined &&
      this._seriesAdvance.valueDate.getTime() < this._seriesAdvance.postedDate.getTime()
    ) {
      throw new Error(
        "The Advance settlement date must fall on or after the drawdown date."
      );
    }
    return this._seriesAdvance;
  }
}
