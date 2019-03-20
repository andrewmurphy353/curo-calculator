import { expect } from "chai";
import "mocha";
import CashFlow from "../../src/profile/cash-flow";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import ProfileUtils from "../../src/utils/profile-utils";

describe("ProfileUtils.firstAdvanceCF", () => {
  let cashFlows: CashFlow[] = [];
  it("Unordered cash flow series contains no CashFlowAdvance instance, undefined expected", () => {
    cashFlows = [new CashFlowPayment(new Date())];
    expect(true).to.equal(ProfileUtils.firstAdvanceCF(cashFlows) === undefined);
  });
  it("Unordered cash flow series contains one CashFlowAdvance instance which should be returned", () => {
    cashFlows = [
      new CashFlowPayment(new Date()),
      new CashFlowAdvance(new Date(), new Date())
    ];
    expect(true).to.equal(ProfileUtils.firstAdvanceCF(cashFlows) !== undefined);
  });
  it("Unordered series with multiple CashFlowAdvance's. Only the earliest posting dated should be returned", () => {
    const earlierDate = new Date(2019, 0, 1);
    cashFlows = [
      new CashFlowPayment(new Date()),
      new CashFlowAdvance(new Date(2025, 11, 31), new Date(2025, 11, 31)),
      new CashFlowAdvance(new Date(2025, 11, 31), new Date(2025, 11, 31)),
      new CashFlowAdvance(new Date(2022, 11, 31), new Date(2022, 11, 31)),
      new CashFlowAdvance(earlierDate, earlierDate),
      new CashFlowPayment(new Date()),
      new CashFlowAdvance(new Date(2020, 5, 5), new Date(2020, 5, 5))
    ];
    expect(earlierDate.toUTCString).to.equal(
      ProfileUtils.firstAdvanceCF(cashFlows).postingDate.toUTCString
    );
  });
  it("Unordered series with same posting date CashFlowAdvance's. To return advance with earlier value date", () => {
    cashFlows = [
      new CashFlowAdvance(new Date(2020, 10, 30), new Date(2020, 11, 15)),
      new CashFlowAdvance(new Date(2020, 10, 30), new Date(2020, 11, 31)),
      new CashFlowAdvance(new Date(2020, 10, 30), new Date(2020, 10, 30))
    ];
    expect(new Date(2020, 10, 30).toUTCString).to.equal(
      ProfileUtils.firstAdvanceCF(cashFlows).valueDate.toUTCString
    );
  });
});

describe("ProfileUtils.hasPaymentCF", () => {
  let cashFlows: CashFlow[] = [];
  it("Unordered cash flow series contains no CashFlowPayment instance, false expected", () => {
    cashFlows = [new CashFlowAdvance(new Date(), new Date())];
    expect(false).to.equal(ProfileUtils.hasPaymentCF(cashFlows));
  });
  it("Unordered cash flow series contains at least one CashFlowPayment instance, true expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date()),
      new CashFlowAdvance(new Date(), new Date()),
      new CashFlowAdvance(new Date(), new Date())
    ];
    expect(true).to.equal(ProfileUtils.hasPaymentCF(cashFlows));
  });
});

describe("ProfileUtils.isUnknownsValid", () => {
  let cashFlows: CashFlow[] = [];
  it("Cash flow series contains an unknown CashFlowPayment and CashFlowAdvance, false expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date()),
      new CashFlowAdvance(new Date(), new Date())
    ];
    expect(false).to.equal(ProfileUtils.isUnknownsValid(cashFlows));
  });
  it("Cash flow series contains an unknown CashFlowPayment, known CashFlowAdvance, true expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date()),
      new CashFlowAdvance(new Date(), new Date(), 100.0)
    ];
    expect(true).to.equal(ProfileUtils.isUnknownsValid(cashFlows));
  });
  it("Cash flow series contains an known CashFlowPayment, unknown CashFlowAdvance, true expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date(), 100.0),
      new CashFlowAdvance(new Date(), new Date())
    ];
    expect(true).to.equal(ProfileUtils.isUnknownsValid(cashFlows));
  });
  it("Cash flow series contains an known CashFlowPayment, known CashFlowAdvance, true expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date(), 100.0),
      new CashFlowAdvance(new Date(), new Date(), 100.0)
    ];
    expect(true).to.equal(ProfileUtils.isUnknownsValid(cashFlows));
  });
});

describe("ProfileUtils.isIntCapValid", () => {
  let cashFlows: CashFlow[] = [];
  it("Unordered cash flow series with final CashFlowPayment.isIntCapitalised(true), true expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date(2019, 1, 1), undefined, undefined, false),
      new CashFlowPayment(new Date(2019, 2, 1), undefined, undefined, true),
      new CashFlowPayment(new Date(2019, 0, 1), undefined, undefined, false)
    ];
    expect(true).to.equal(ProfileUtils.isIntCapValid(cashFlows));
  });
  it("Unordered cash flow series with final CashFlowPayment.isIntCapitalised(false), false expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date(2019, 1, 1), undefined, undefined, true),
      new CashFlowPayment(new Date(2019, 2, 1), undefined, undefined, false),
      new CashFlowPayment(new Date(2019, 0, 1), undefined, undefined, false)
    ];
    expect(false).to.equal(ProfileUtils.isIntCapValid(cashFlows));
  });
  it("Unordered series, two payments with same final date, one isIntCap(true), other (false), true expected", () => {
    cashFlows = [
      new CashFlowPayment(new Date(2019, 1, 1), undefined, undefined, true),
      new CashFlowPayment(new Date(2019, 2, 1), undefined, undefined, false),
      new CashFlowPayment(new Date(2019, 0, 1), undefined, undefined, false),
      new CashFlowPayment(new Date(2019, 2, 1), undefined, undefined, true)
    ];
    expect(true).to.equal(ProfileUtils.isIntCapValid(cashFlows));
  });
});
