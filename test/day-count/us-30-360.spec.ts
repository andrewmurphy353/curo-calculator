import { assert, expect } from "chai";
import "mocha";
import Calculator from "../../src/core/calculator";
import Convention from "../../src/day-count/convention";
import DayCountFactor from "../../src/day-count/day-count-factor";
import US30360 from "../../src/day-count/us-30-360";
import CashFlow from "../../src/profile/cash-flow";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import Profile from "../../src/profile/profile";

describe("US30360.computeFactor", () => {
  const dc: Convention = new US30360();
  let pf: DayCountFactor;
  it("28/01/2020 to 29/02/2020 to return 0.08611111111111111 (31 / 360)", () => {
    pf = dc.computeFactor(new Date(2020, 0, 28), new Date(2020, 1, 29));
    expect(0.08611111111111111).to.equal(pf.factor);
  });
  it("28/01/2019 to 28/02/2019 to return 0.08333333333333333 (30 / 360)", () => {
    pf = dc.computeFactor(new Date(2019, 0, 28), new Date(2019, 1, 28));
    expect(0.08333333333333333).to.equal(pf.factor);
  });
  it("16/06/2019 to 31/07/2019 to return 0.125 (45 / 360)", () => {
    pf = dc.computeFactor(new Date(2019, 5, 16), new Date(2019, 6, 31));
    expect(0.125).to.equal(pf.factor);
  });
  it("31/12/2017 to 31/12/2019 to return 2.0 (720 / 360)", () => {
    pf = dc.computeFactor(new Date(2017, 11, 31), new Date(2019, 11, 31));
    expect(2.0).to.equal(pf.factor);
  });
  it("31/12/2018 to 31/12/2020 to return 2.0 (720 / 360)", () => {
    pf = dc.computeFactor(new Date(2018, 11, 31), new Date(2020, 11, 31));
    expect(2.0).to.equal(pf.factor);
  });
  it("30/06/2019 to 30/06/2021 to return 2.0 (720 / 360)", () => {
    pf = dc.computeFactor(new Date(2019, 5, 30), new Date(2021, 5, 30));
    expect(2.0).to.equal(pf.factor);
  });
});

describe("US30360(undefined, undefined) instance", () => {
  const dc: Convention = new US30360(undefined, undefined);
  it("dayCountRef() to return NEIGHBOUR", () => {
    expect(US30360.NEIGHBOUR).to.equal(dc.dayCountRef());
  });
  it("usePostingDates() to return true by default", () => {
    expect(true).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return false by default", () => {
    expect(false).to.equal(dc.inclNonFinFlows());
  });
});

describe("US30360(undefined, true) instance", () => {
  const dc: Convention = new US30360(undefined, true);
  it("usePostingDates() to return true by default", () => {
    expect(true).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return true", () => {
    expect(true).to.equal(dc.inclNonFinFlows());
  });
});

describe("US30360(false, undefined) instance", () => {
  const dc: Convention = new US30360(false, undefined);
  it("usePostingDates() to return false", () => {
    expect(false).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return false by default", () => {
    expect(false).to.equal(dc.inclNonFinFlows());
  });
});

describe("US30360(false, true) instance", () => {
  const dc: Convention = new US30360(false, true);
  it("usePostingDates() to return false", () => {
    expect(false).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return false", () => {
    expect(true).to.equal(dc.inclNonFinFlows());
  });
});

describe("US30360(undefine, undefined, true|false) - IRR | XIRR", () => {
  const dummyCFs: CashFlow[] = [];
  dummyCFs.push(
    new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0)
  );
  dummyCFs.push(new CashFlowPayment(new Date(2019, 1, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2019, 2, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2019, 3, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2019, 4, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2019, 5, 1), 172.55));
  dummyCFs.push(new CashFlowPayment(new Date(2019, 6, 1), 172.55));
  const dummyProfile = new Profile(dummyCFs, 2);

  const calc = new Calculator(2, dummyProfile);

  it("IRR should return 0.120033 (decimal)", () => {
    assert.approximately(calc.solveRate(new US30360()), 0.120033, 0.0000005);
  });

  it("XIRR should return 0.126862 (decimal)", () => {
    assert.approximately(
      calc.solveRate(new US30360(undefined, undefined, true)),
      0.126862,
      0.0000005
    );
  });
});
