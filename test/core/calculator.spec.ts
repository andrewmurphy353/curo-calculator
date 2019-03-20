import { expect } from "chai";
import "mocha";
import Calculator from "../../src/core/calculator";
import CashFlow from "../../src/profile/cash-flow";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import Profile from "../../src/profile/profile";
import Series from "../../src/series/series";
import { SeriesType } from "../../src/series/series-type";
import SeriesAdvance from "../../src/series/series-advance";
import SeriesPayment from "../../src/series/series-payment";
import { Mode } from "../../src/series/mode";
import US30360 from "../../src/day-count/us-30-360";

describe("Calculator constructor", () => {
  it("Default no params should set precision to 2", () => {
    const calc = new Calculator();
    expect(2).to.equal(calc.precision);
  });
  it("Bespoke profile and precision of 4 should set precision to 4", () => {
    let calc = new Calculator();
    const dummyCFs: CashFlow[] = [];
    dummyCFs.push(new CashFlowAdvance(new Date(), new Date()));
    dummyCFs.push(new CashFlowPayment(new Date(), 100.0));
    const dummyProfile = new Profile(dummyCFs, 4);
    // Provided precision of 3 will be overridden
    calc = new Calculator(3, dummyProfile);
    expect(4).to.equal(calc.precision);
  });
  it("Throws error for unsupported precision of 1", () => {
    expect(
      () => new Calculator(1, undefined)
    ).to.throw(Error);
  });
});

describe("Calculator get profile()", () => {
  it("Throws error if profile undefined or not yet initialised", () => {
    expect(
      () => new Calculator().profile
    ).to.throw(Error);
  });
});

describe("Calculator bespoke profile", () => {
  it("Throws error if an attempt is made to add a series to a bespoke profile", () => {
    const bespokeProf = new Profile([
      new CashFlowAdvance(new Date(), new Date(), 1000.0),
      new CashFlowPayment(new Date())
    ]);
    const calc = new Calculator(undefined, bespokeProf);
    expect(
      () => calc.add(new Series(SeriesType.Advance))
    ).to.throw(Error);
  });
  it("Ensures series amount input coerced to expected precision", () => {
    const calc = new Calculator();
    calc.add(SeriesAdvance.builder().setAmount(999.989).build());
    calc.add(SeriesPayment.builder().setNumberOf(3).build());
    // Need to solve something to build series so calc pmt value (advance mode)
    expect(calc.solveValue(new US30360, 0.12)).to.equal(336.65);
    // 999.989 coerced to 999.99
    expect(calc.profile.cashFlows[0].value).to.equal(-999.99);
  });
});

describe("Calculator solveValue", () => {
  it("Loan of 1000.0, 3 monthly repayments in arrears mode", () => {
    const calc = new Calculator();
    const seriesAdv = SeriesAdvance.builder()
      .setAmount(1000.0)
      .setLabel("Loan advance")
      .build();
    calc.add(seriesAdv);
    const seriesPmt = SeriesPayment.builder()
      .setLabel("Repayment")
      .setMode(Mode.Arrear)
      .setNumberOf(3)
      .build();
    calc.add(seriesPmt);
    expect(calc.solveValue(new US30360, 0.12)).to.equal(340.02);
  });
});

describe("Calculator solveRate", () => {
  it("Loan of 1000.0, 3 monthly repayments of 340.02 in arrears mode to return 12.0% approx due to rounding", () => {
    const calc = new Calculator();
    const seriesAdv = SeriesAdvance.builder()
      .setAmount(1000.0)
      .setLabel("Loan advance")
      .build();
    calc.add(seriesAdv);
    const seriesPmt = SeriesPayment.builder()
      .setAmount(340.02)
      .setLabel("Repayment")
      .setMode(Mode.Arrear)
      .setNumberOf(3)
      .build();
    calc.add(seriesPmt);
    expect(calc.solveRate(new US30360)).to.equal(0.11996224312757968);
  });
});

