import { expect } from "chai";
import "mocha";
import CashFlow from "../../src/profile/cash-flow";
import { Frequency } from "../../src/series/frequency";
import { Mode } from "../../src/series/mode";
import Series from "../../src/series/series";
import SeriesPayment from "../../src/series/series-payment";
import DateUtils from "../../src/utils/date-utils";
import CashFlowBuilder from "../../src/series/cash-flow-builder";

let cashFlows: CashFlow[];
let payments: Series[];
const today: Date = DateUtils.dateToUTC(new Date());

describe("CashFlowBuilder.build: Payment Series", () => {
  it("Cash payment series undated, monthly in advance, will return computed dates", () => {
    payments = [];
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment1")
        .setNumberOf(2)
        .build()
    );
    const expectedDate2 = DateUtils.rollMonth(today, 1, today.getDate());
    cashFlows = CashFlowBuilder.build(payments, today);
    expect(cashFlows[0].postingDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
  });
  it("Cash payment series undated, quarterly in arrear, will return computed dates", () => {
    payments = [];
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment1")
        .setNumberOf(2)
        .setFrequency(Frequency.Quarterly)
        .setMode(Mode.Arrear)
        .build()
    );
    const expectedDate1 = DateUtils.rollMonth(today, 3, today.getDate());
    const expectedDate2 = DateUtils.rollMonth(today, 6, today.getDate());
    cashFlows = CashFlowBuilder.build(payments, today);
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
  it("Cash payment series dated, weekly in advance, will return provided date and provided date + 1 week", () => {
    payments = [];
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment1")
        .setNumberOf(2)
        .setDueOnOrFrom(today)
        .setFrequency(Frequency.Weekly)
        .setMode(Mode.Advance)
        .build()
    );
    const expectedDate2 = DateUtils.rollDay(today, 7);
    cashFlows = CashFlowBuilder.build(payments, today);
    expect(cashFlows[0].postingDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[0].valueDate.getTime()).to.be.equal(today.getTime());
    expect(cashFlows[1].postingDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
    expect(cashFlows[1].valueDate.getTime()).to.be.equal(
      expectedDate2.getTime()
    );
  });
  it("Cash payment series dated, fortnightly in arrear, will return date provided, and date provided + 2 weeks", () => {
    payments = [];
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment1")
        .setNumberOf(2)
        .setDueOnOrFrom(today)
        .setFrequency(Frequency.Fortnightly)
        .setMode(Mode.Arrear)
        .build()
    );
    const expectedDate0 = DateUtils.rollDay(today, 14);
    const expectedDate1 = DateUtils.rollDay(today, 28);
    cashFlows = CashFlowBuilder.build(payments, today);
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

describe("CashFlowBuilder.build: Back-to-back Payment Series in arrear mode", () => {
  it("Payment series undated, start date of second series will return end date of previous series", () => {
    payments = [];
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment series1")
        .setNumberOf(1)
        .setMode(Mode.Arrear)
        .build()
    );
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment series2")
        .setNumberOf(1)
        .setMode(Mode.Arrear)
        .build()
    );

    const expectedDate0 = DateUtils.rollMonth(today, 1, today.getDate());
    const expectedDate1 = DateUtils.rollMonth(today, 2, today.getDate());
    cashFlows = CashFlowBuilder.build(payments, today);
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

describe("CashFlowBuilder.build: Back-to-back Payment Series in advance mode", () => {
  it("Payment series undated, start date of second series will return end date of previous series + frequency", () => {
    payments = [];
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment series1")
        .setNumberOf(1)
        .setMode(Mode.Advance)
        .build()
    );
    payments.push(
      SeriesPayment.builder()
        .setLabel("Payment series2")
        .setNumberOf(1)
        .setMode(Mode.Advance)
        .build()
    );

    const expectedDate0 = today;
    const expectedDate1 = DateUtils.rollMonth(today, 1, today.getDate());
    cashFlows = CashFlowBuilder.build(payments, today);
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
