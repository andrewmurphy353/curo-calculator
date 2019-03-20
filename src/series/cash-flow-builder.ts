import CashFlow from "../profile/cash-flow";
import CashFlowAdvance from "../profile/cash-flow-advance";
import CashFlowCharge from "../profile/cash-flow-charge";
import CashFlowPayment from "../profile/cash-flow-payment";
import DateUtils from "../utils/date-utils";
import { Mode } from "./mode";
import Series from "./series";
import { SeriesType } from "./series-type";

/**
 * Class for building out a cash flow series into separate cash flow instances of the specific
 * type, e.g. advances, payments or charges.
 *
 * All cash flow instances are dated with reference to the series start date if provided, or
 * are computed with reference the current system date when undefined. The interval between cash flows
 * is determined by the series frequency, and the series mode determines whether a cash flow value
 * occurs at the beginning or end of the period defined by the frequency.
 *
 * Where the start dates of two or more series of the same type are *defined* it is possible the
 * respective cash flow series may overlap. This is intentional to allow for the creation of 
 * advanced cash flow profiles.
 *
 * Where the start dates of two or more series of the same type are *undefined*, the start date of
 * any subsequent series is determined with reference to the end date of the preceding series. The
 * order that each undated series is defined and added to the series array is therefore very
 * important as each is processed sequentially.
 *
 * The mixing of dated and undated series is permissable but discouraged, unless you know what you
 * are doing of course. It is recommended you either stick to explicitly defining the start dates of
 * *all* cash flow series, or alternativey leave dates undefined and allow the builder to resolve them
 * with reference to today's date.
 */
export default class CashFlowBuilder {
  /**
   * Builds the array of cash flow instances
   *
   * @param series
   * @param today the initial start date to use in the first of an undated cash flow series
   * @return an array of cash flows
   */
  public static build(series: Series[], today: Date): CashFlow[] {
    if (series.length < 1) {
      throw new Error("The cash flow series is empty. Build aborted.");
    }
    const cashFlows: CashFlow[] = [];

    // Keep track of computed dates for undated series
    let nextAdvPeriod: Date = today;
    let nextPmtPeriod: Date = today;
    let nextChgPeriod: Date = today;

    for (const seriesItem of series) {
      let pDateToUse: Date;
      let pDateDay: number;
      if (seriesItem.postedDate === undefined) {
        // Computed date
        switch (seriesItem.seriesType) {
          case SeriesType.Advance:
            pDateToUse = nextAdvPeriod;
            break;
          case SeriesType.Payment:
            pDateToUse = nextPmtPeriod;
            break;
          case SeriesType.Charge:
            pDateToUse = nextChgPeriod;
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`SeriesType ${seriesItem} not supported.`);
        }
        pDateDay = today.getDate();
      } else {
        // Provided date
        pDateToUse = seriesItem.postedDate;
        pDateDay = pDateToUse.getDate();
      }

      if (seriesItem.mode === Mode.Arrear) {
        pDateToUse = DateUtils.rollDate(
          pDateToUse,
          seriesItem.frequency,
          pDateDay
        );
      }

      switch (seriesItem.seriesType) {
        case SeriesType.Advance:
          // Process value dates for advances only
          let vDateToUse: Date;
          let vDateDay: number;

          if (seriesItem.valueDate === undefined) {
            vDateToUse = pDateToUse;
            vDateDay = pDateDay;
          } else {
            vDateToUse = seriesItem.valueDate;
            vDateDay = vDateToUse.getDate();
            if (seriesItem.mode === Mode.Arrear) {
              vDateToUse = DateUtils.rollDate(
                vDateToUse,
                seriesItem.frequency,
                vDateDay
              );
            }
          }

          for (let j = 0; j < seriesItem.numberOf; j++) {
            cashFlows.push(
              new CashFlowAdvance(
                pDateToUse,
                vDateToUse,
                seriesItem.amount,
                seriesItem.weighting,
                seriesItem.label
              )
            );
            if (j < seriesItem.numberOf - 1) {
              pDateToUse = DateUtils.rollDate(
                pDateToUse,
                seriesItem.frequency,
                pDateDay
              );
              vDateToUse = DateUtils.rollDate(
                vDateToUse,
                seriesItem.frequency,
                vDateDay
              );
            }
          }
          if (seriesItem.postedDate === undefined) {
            nextAdvPeriod = pDateToUse;
          }
          break;

        case SeriesType.Payment:
          for (let j = 0; j < seriesItem.numberOf; j++) {
            cashFlows.push(
              new CashFlowPayment(
                pDateToUse,
                seriesItem.amount,
                seriesItem.weighting,
                seriesItem.isIntCap,
                seriesItem.label
              )
            );
            if (j < seriesItem.numberOf - 1) {
              pDateToUse = DateUtils.rollDate(
                pDateToUse,
                seriesItem.frequency,
                pDateDay
              );
            }
          }
          if (seriesItem.postedDate === undefined) {
            nextPmtPeriod = pDateToUse;
          }
          break;

        case SeriesType.Charge:
          // Charge value must be defined
          for (let j = 0; j < seriesItem.numberOf; j++) {
            cashFlows.push(
              new CashFlowCharge(
                pDateToUse,
                (seriesItem.amount === undefined) ? 0.0 : seriesItem.amount,
                seriesItem.label
              )
            );
            if (j < seriesItem.numberOf - 1) {
              pDateToUse = DateUtils.rollDate(
                pDateToUse,
                seriesItem.frequency,
                pDateDay
              );
            }
          }
          if (seriesItem.postedDate === undefined) {
            nextChgPeriod = pDateToUse;
          }
          break;
        /* istanbul ignore next */
        default:
          throw new Error(
            `SeriesType ${seriesItem.seriesType} not supported`
          );
      }
    }
    return cashFlows;
  }
}
