import { assert, expect } from "chai";
import "mocha";
import Calculator from "../../src/core/calculator";
import ActISDA from "../../src/day-count/act-isda";
import Convention from "../../src/day-count/convention";
import DayCountFactor from "../../src/day-count/day-count-factor";
import CashFlow from "../../src/profile/cash-flow";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import Profile from "../../src/profile/profile";

describe("ActISDA.computeFactor", () => {
  const dc: Convention = new ActISDA();
  let dcf: DayCountFactor;
  it("Date range 28/01/2020 to 28/02/2020 to return 0.08469945355191257 (31 / 366)", () => {
    dcf = dc.computeFactor(new Date(2020, 0, 28), new Date(2020, 1, 28));
    expect(0.08469945355191257).to.equal(dcf.factor);
  });
  it("Date range 28/01/2019 to 28/02/2019 to return 0.08493150684931507 (31 / 365)", () => {
    dcf = dc.computeFactor(new Date(2019, 0, 28), new Date(2019, 1, 28));
    expect(0.08493150684931507).to.equal(dcf.factor);
  });
  it("Date range 31/12/2017 to 31/12/2019 to return 2.0 (730 / 365)", () => {
    dcf = dc.computeFactor(new Date(2017, 11, 31), new Date(2019, 11, 31));
    expect(2.0).to.equal(dcf.factor);
  });
  it("Date range 31/12/2018 to 31/12/2020 to return 2.0 [(365 / 365) + (366 / 366)]", () => {
    dcf = dc.computeFactor(new Date(2018, 11, 31), new Date(2020, 11, 31));
    expect(2.0).to.equal(dcf.factor);
  });
  it("Date range 30/06/2019 to 30/06/2021 to return 2.0 [(184 / 365) + (366 / 366) + (181 / 365)]", () => {
    dcf = dc.computeFactor(new Date(2019, 5, 30), new Date(2021, 5, 30));
    expect(2.0).to.equal(dcf.factor);
  });
});
describe("ActISDA(undefined, undefined) instance", () => {
  const dc: Convention = new ActISDA(undefined, undefined);
  it("countWithRefTo() to return NEIGHBOUR", () => {
    expect(ActISDA.NEIGHBOUR).to.equal(dc.dayCountRef());
  });
  it("usePostingDates() to return true by default", () => {
    expect(true).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return false by default", () => {
    expect(false).to.equal(dc.inclNonFinFlows());
  });
});
describe("ActISDA(undefined, true) instance", () => {
  const dc: Convention = new ActISDA(undefined, true);
  it("usePostingDates() to return true by default", () => {
    expect(true).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return true", () => {
    expect(true).to.equal(dc.inclNonFinFlows());
  });
});
describe("ActISDA(false, undefined) instance", () => {
  const dc: Convention = new ActISDA(false, undefined);
  it("usePostingDates() to return false", () => {
    expect(false).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return false by default", () => {
    expect(false).to.equal(dc.inclNonFinFlows());
  });
});
describe("ActISDA(false, true) instance", () => {
  const dc: Convention = new ActISDA(false, true);
  it("usePostingDates() to return false", () => {
    expect(false).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return false", () => {
    expect(true).to.equal(dc.inclNonFinFlows());
  });
});

describe("ActISDA(undefine, undefined, true|false) - IRR | XIRR", () => {
  const dummyCFs: CashFlow[] = [];
  dummyCFs.push(
    new CashFlowAdvance(new Date(2020, 0, 1), new Date(2020, 0, 1), 1000.0)
  );
  dummyCFs.push(new CashFlowPayment(new Date(2020, 1, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2020, 2, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2020, 3, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2020, 4, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2020, 5, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2020, 6, 1), 172.55));
  const dummyProfile = new Profile(dummyCFs, 2);

  const calc = new Calculator(2, dummyProfile);

  it("IRR should return 0.120692 (decimal)", () => {
    assert.approximately(
      calc.solveRate(new ActISDA()),
      0.120692,
      0.0000005);
  });

  it("XIRR should return 0.127601 (decimal)", () => {
    assert.approximately(
      calc.solveRate(new ActISDA(undefined, undefined, true)),
      0.127601,
      0.0000005
    );
  });
});
