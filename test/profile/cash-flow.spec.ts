import { expect } from "chai";
import "mocha";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";

describe("CashFlow constructor", () => {
  it("Throws error when the cash flow value-date predates the posting-date", () => {
    expect(
      () => new CashFlowAdvance(new Date(2019, 2, 1), new Date(2019, 1, 1))
    ).to.throw(Error);
  });
  it("Assigns the absolute weighting value passed as a param", () => {
    const c = new CashFlowAdvance(new Date(), new Date(), undefined, -2.0);
    expect(2.0).to.equal(c.weighting);
  });
  it("Assigns the posting date to the value date when undefined", () => {
    const c = new CashFlowAdvance(new Date(2019, 0, 1), undefined);
    expect(new Date(2019, 0, 1).getTime()).to.equal(c.valueDate.getTime());
  });
  it("Assigns isKnown equal to false when a cash flow value is undefined", () => {
    const c = new CashFlowAdvance(new Date(2019, 0, 1), undefined, undefined);
    expect(c.isKnown).to.be.false;
  });
  it("Assigns the value 0 when cash flow value param is undefined", () => {
    const c = new CashFlowAdvance(new Date(2019, 0, 1), undefined, undefined);
    expect(c.value).to.equal(0);
  });
});

describe("CashFlow.weightedValue", () => {
  it("Correctly computes the unrounded value of the cash flow, taking account of the weighting", () => {
    const c = new CashFlowAdvance(new Date(), new Date(), undefined, -2.0, "Loan advance");
    c.updateValue(1333.3353);
    expect(2666.6706).to.equal(c.value);
    expect("Loan advance").to.equal(c.label);
  });
  it("Correctly computes the rounded value of the cash flow, taking account of the weighting", () => {
    const c = new CashFlowAdvance(new Date(), new Date(), undefined, 2.0);
    c.updateValue(1333.335, 2);
    expect(2666.67).to.equal(c.value);
  });
});
