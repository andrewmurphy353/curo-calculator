import { assert, expect } from "chai";
import "mocha";
import Calculator from "../../src/core/calculator";
import DayCountFactor from "../../src/day-count/day-count-factor";
import EU200848EC from "../../src/day-count/eu-2008-48-ec";
import CashFlow from "../../src/profile/cash-flow";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import Profile from "../../src/profile/profile";

// The majority of test cases are based on examples extracted from
// https://ec.europa.eu/info/sites/info/files/guidelines_final.pdf

let pf: DayCountFactor;
describe("EU200848EC.computeFactor [frequency = month]", () => {
  const dcMonth = new EU200848EC(); // freq='month' by default
  it("12/01/2019 <-- 12/01/2020 to return 1.0 (12/12)", () => {
    pf = dcMonth.computeFactor(new Date(2019, 0, 12), new Date(2020, 0, 12));
    expect(1.0).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 15/02/2012 to return 0.0915525114155251 (1/12) + (3/365)", () => {
    pf = dcMonth.computeFactor(new Date(2012, 0, 12), new Date(2012, 1, 15));
    expect(0.0915525114155251).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 15/03/2012 to return 0.17488584474885843 (2/12) + (3/365)", () => {
    pf = dcMonth.computeFactor(new Date(2012, 0, 12), new Date(2012, 2, 15));
    expect(0.17488584474885843).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 15/04/2012 to return 0.2582191780821918 (3/12) + (3/365)", () => {
    pf = dcMonth.computeFactor(new Date(2012, 0, 12), new Date(2012, 3, 15));
    expect(0.2582191780821918).to.equal(pf.factor);
  });
  it("12/01/2013 <-- 15/02/2013 to return 0.09153005464480873 (1/12) + (3/366)", () => {
    pf = dcMonth.computeFactor(new Date(2013, 0, 12), new Date(2013, 1, 15));
    expect(0.09153005464480873).to.equal(pf.factor);
  });
  it("12/01/2013 <-- 15/03/2013 to return 0.17486338797814208 (2/12) + (3/366)", () => {
    pf = dcMonth.computeFactor(new Date(2013, 0, 12), new Date(2013, 2, 15));
    expect(0.17486338797814208).to.equal(pf.factor);
  });
  it("12/01/2013 <-- 15/04/2013 to return 0.2581967213114754 (3/12) + (3/366)", () => {
    pf = dcMonth.computeFactor(new Date(2013, 0, 12), new Date(2013, 3, 15));
    expect(0.2581967213114754).to.equal(pf.factor);
  });
  it("25/02/2013 <-- 28/03/2013 to return 0.09153005464480873 (1/12) + (3/366)", () => {
    pf = dcMonth.computeFactor(new Date(2013, 1, 25), new Date(2013, 2, 28));
    expect(0.09153005464480873).to.equal(pf.factor);
  });
  it("26/02/2013 <-- 29/03/2013 to return 0.08879781420765027 (1/12) + (2/366)", () => {
    pf = dcMonth.computeFactor(new Date(2013, 1, 26), new Date(2013, 2, 29));
    expect(0.08879781420765027).to.equal(pf.factor);
  });
  it("26/02/2012 <-- 29/03/2012 to return 0.09153005464480873 (1/12) + (3/366)", () => {
    pf = dcMonth.computeFactor(new Date(2012, 1, 26), new Date(2012, 2, 29));
    expect(0.09153005464480873).to.equal(pf.factor);
  });
  it("26/02/2012 <-- 26/02/2012 to return 0.0 (0/366)", () => {
    pf = dcMonth.computeFactor(new Date(2012, 1, 26), new Date(2012, 1, 26));
    expect(0.0).to.equal(pf.factor);
  });
});

describe("EU200848EC.computeFactor [frequency = year]", () => {
  const dcYear = new EU200848EC("year");
  it("12/01/2012 <-- 15/02/2012 to return 0.09315068493150686 (34/365)", () => {
    pf = dcYear.computeFactor(new Date(2012, 0, 12), new Date(2012, 1, 15));
    expect(0.09315068493150686).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 15/02/2013 to return 1.093150684931507 (1/1) + (34/365)", () => {
    pf = dcYear.computeFactor(new Date(2012, 0, 12), new Date(2013, 1, 15));
    expect(1.093150684931507).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 15/02/2014 to return 2.0931506849315067 (2/1) + (34/365)", () => {
    pf = dcYear.computeFactor(new Date(2012, 0, 12), new Date(2014, 1, 15));
    expect(2.0931506849315067).to.equal(pf.factor);
  });
  it("01/01/2020 <-- 15/03/2021 to return 1.2021857923497268 (1/1) + (74/366)", () => {
    pf = dcYear.computeFactor(new Date(2020, 0, 1), new Date(2021, 2, 15));
    expect(1.2021857923497268).to.equal(pf.factor);
  });
  it("01/01/2020 <-- 01/01/2020 to return 0.0 (0/366)", () => {
    pf = dcYear.computeFactor(new Date(2020, 0, 1), new Date(2020, 0, 1));
    expect(0.0).to.equal(pf.factor);
  });
});

describe("EU200848EC.computeFactor [frequency = week]", () => {
  const dcWeek = new EU200848EC("week");
  it("12/01/2012 <-- 26/01/2012 to return 0.038461538461538464 (2/52)", () => {
    pf = dcWeek.computeFactor(new Date(2012, 0, 12), new Date(2012, 0, 26));
    expect(0.038461538461538464).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 10/01/2013 to return 1.0 (52/52)", () => {
    pf = dcWeek.computeFactor(new Date(2012, 0, 12), new Date(2013, 0, 10));
    expect(1.0).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 30/01/2012 to return 0.0494204425711275 (2/52) + (4/365)", () => {
    pf = dcWeek.computeFactor(new Date(2012, 0, 12), new Date(2012, 0, 30));
    expect(0.0494204425711275).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 12/01/2013 to return 1.0054794520547945 (52/52) + (2/365)", () => {
    pf = dcWeek.computeFactor(new Date(2012, 0, 12), new Date(2013, 0, 12));
    expect(1.0054794520547945).to.equal(pf.factor);
  });
  it("12/01/2012 <-- 12/01/2012 to return 0.0 (0/365)", () => {
    pf = dcWeek.computeFactor(new Date(2012, 0, 12), new Date(2012, 0, 12));
    expect(0.0).to.equal(pf.factor);
    expect("(0/365) = 0.00000000").to.equal(pf.toString);
  });
});
describe("EU200848EC(undefined) instance", () => {
  const dc = new EU200848EC(undefined);
  it("frequency() to return MONTH by default", () => {
    expect(EU200848EC.MONTH).to.equal(dc.frequency());
  });
  it("dayCountRef() to return DRAWDOWN", () => {
    expect(EU200848EC.DRAWDOWN).to.equal(dc.dayCountRef());
  });
  it("usePostingDates() to return true always", () => {
    expect(true).to.equal(dc.usePostingDates());
  });
  it("inclNonFinFlows() to return true always", () => {
    expect(true).to.equal(dc.inclNonFinFlows());
  });
});
describe("EU200848EC(WEEK) instance", () => {
  const dc = new EU200848EC(EU200848EC.WEEK);
  it("frequency() to return WEEK", () => {
    expect(EU200848EC.WEEK).to.equal(dc.frequency());
  });
});
describe("EU200848EC(MONTH) instance", () => {
  const dc = new EU200848EC(EU200848EC.MONTH);
  it("frequency() to return MONTH", () => {
    expect(EU200848EC.MONTH).to.equal(dc.frequency());
  });
});
describe("EU200848EC(YEAR) instance", () => {
  const dc = new EU200848EC(EU200848EC.YEAR);
  it("frequency() to return YEAR", () => {
    expect(EU200848EC.YEAR).to.equal(dc.frequency());
  });
});

describe("EU200848EC() - APR", () => {
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

  it("APR should return 0.126862 (decimal)", () => {
    assert.approximately(calc.solveRate(new EU200848EC()), 0.126862, 0.0000005);
  });
});
