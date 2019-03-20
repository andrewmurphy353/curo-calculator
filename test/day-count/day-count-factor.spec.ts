import { expect } from "chai";
import "mocha";
import DayCountFactor from "../../src/day-count/day-count-factor";

describe("DayCountFactor.toString()", () => {
  it("Expect '(6/12) + (3/12) = 0.37500000' with fractional factor to 8 decimal places", () => {
    const pf: DayCountFactor = new DayCountFactor(0.375);
    pf.logOperands(6, 12);
    pf.logOperands(3, 12);
    expect("(6/12) + (3/12) = 0.37500000").to.equal(pf.toString);
  });
});
