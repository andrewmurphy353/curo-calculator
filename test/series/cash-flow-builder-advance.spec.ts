import { expect } from "chai";
import "mocha";
import CashFlow from "../../src/profile/cash-flow";
import { Frequency } from "../../src/series/frequency";
import { Mode } from "../../src/series/mode";
import Series from "../../src/series/series";
import SeriesAdvance from "../../src/series/series-advance";
import DateUtils from "../../src/utils/date-utils";
import CashFlowBuilder from "../../src/series/cash-flow-builder";

describe("CashFlowBuilder.build: Series undefined", () => {
  it("Throws error when cash flow series is empty", () => {
    expect(
      () => CashFlowBuilder.build([], new Date())
    ).to.throw(Error);
  });
});

let cashFlows: CashFlow[];
let advances: Series[];
const today: Date = DateUtils.dateToUTC(new Date());

describe("CashFlowBuilder.build: Advance Series", () => {
  it("Cash advance series undated, monthly in advance, will return computed dates", () => {
    advances = [];
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance1")
        .setNumberOf(2)
        .build()
    );

    const expectedDate2 = DateUtils.rollMonth(today, 1, today.getDate());
    cashFlows = CashFlowBuilder.build(advances, today);
    expect(cashFlows[0].postingDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
  });
  it("Cash advance series dated in advance mode will return provided dates for initial advance, computed dates for subsequent advance", () => {
    advances = [];
    const expectedVDate1 = DateUtils.rollDay(today, 14);
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance")
        .setNumberOf(2)
        .setDrawdownFrom(today)
        .setSettlementOn(expectedVDate1)
        .build()
    );
    const expectedPDate2 = DateUtils.rollMonth(today, 1, today.getDate());
    const expectedVDate2 = DateUtils.rollMonth(expectedVDate1, 1, expectedVDate1.getDate());
    cashFlows = CashFlowBuilder.build(advances, today);
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(expectedPDate2.getTime());
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(expectedVDate2.getTime());
  });
  it("Cash advance series dated in arrear mode will return provided dates for initial advance, computed dates for subsequent advance", () => {
    advances = [];
    const expectedVDate1 = DateUtils.rollDay(today, 14);
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance")
        .setNumberOf(2)
        .setDrawdownFrom(today)
        .setMode(Mode.Arrear)
        .setSettlementOn(expectedVDate1)
        .build()
    );

    const expectedPDate2 = DateUtils.rollMonth(today, 2, today.getDate());
    const expectedVDate2 = DateUtils.rollMonth(expectedVDate1, 2, expectedVDate1.getDate());
    cashFlows = CashFlowBuilder.build(advances, today);
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(expectedPDate2.getTime());
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(expectedVDate2.getTime());
  });
  it("Cash advance series undated, quarterly in arrear, will return computed dates", () => {
    advances = [];
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance1")
        .setNumberOf(2)
        .setFrequency(Frequency.Quarterly)
        .setMode(Mode.Arrear)
        .build()
    );
    const expectedDate1 = DateUtils.rollMonth(today, 3, today.getDate());
    const expectedDate2 = DateUtils.rollMonth(today, 6, today.getDate());
    cashFlows = CashFlowBuilder.build(advances, today);

    expect(cashFlows[0].postingDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
  });
  it("Cash advance series dated, weekly in advance, will return provided date and provided date + 1 week", () => {
    advances = [];
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance1")
        .setNumberOf(2)
        .setDrawdownFrom(today)
        .setFrequency(Frequency.Weekly)
        .setMode(Mode.Advance)
        .build()
    );
    const expectedDate2 = DateUtils.rollDay(today, 7);
    cashFlows = CashFlowBuilder.build(advances, today);

    expect(cashFlows[0].postingDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
  });
  it("Cash advance series dated, fortnightly in arrear, will return date provided + 2 weeks", () => {
    advances = [];
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance1")
        .setNumberOf(2)
        .setDrawdownFrom(today)
        .setFrequency(Frequency.Fortnightly)
        .setMode(Mode.Arrear)
        .build()
    );
    const expectedDate0 = DateUtils.rollDay(today, 14);
    const expectedDate1 = DateUtils.rollDay(today, 28);
    cashFlows = CashFlowBuilder.build(advances, today);
    expect(cashFlows[0].postingDate.getTime()).to.be.equal(
      expectedDate0.getTime()
    );
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(
      expectedDate0.getTime()
    );
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
  });
});

describe("CashFlowBuilder.build: Back-to-back Advance Series in arrear mode", () => {
  it("Advance series undated, start date of second series will return end date of previous series + freq", () => {
    advances = [];
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance series1")
        .setNumberOf(1)
        .setMode(Mode.Arrear)
        .build()
    );
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance series2")
        .setNumberOf(1)
        .setMode(Mode.Arrear)
        .build()
    );

    const expectedDate0 = DateUtils.rollMonth(today, 1, today.getDate());
    const expectedDate1 = DateUtils.rollMonth(today, 2, today.getDate());
    cashFlows = CashFlowBuilder.build(advances, today);

    expect(cashFlows[0].postingDate.getTime()).to.be.equal(
      expectedDate0.getTime()
    );
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(
      expectedDate0.getTime()
    );
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
  });
});

describe("CashFlowBuilder.build: Back-to-back Advance Series in advance mode", () => {
  it("Advance series undated, start date of second series will return end date of previous series + frequency", () => {
    advances = [];
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance series1")
        .setNumberOf(1)
        .setMode(Mode.Advance)
        .build()
    );
    advances.push(
      SeriesAdvance.builder()
        .setLabel("Advance series2")
        .setNumberOf(1)
        .setMode(Mode.Advance)
        .build()
    );

    const expectedDate0 = today;
    const expectedDate1 = DateUtils.rollMonth(today, 1, today.getDate());
    cashFlows = CashFlowBuilder.build(advances, today);
    expect(cashFlows[0].postingDate.getTime()).to.be.equal(
      expectedDate0.getTime()
    );
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(
      expectedDate0.getTime()
    );
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate1.getTime()
    );
  });
});