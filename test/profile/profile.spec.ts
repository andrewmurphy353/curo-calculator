import { expect } from "chai";
import "mocha";
import US30360 from "../../src/day-count/us-30-360";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowCharge from "../../src/profile/cash-flow-charge";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import Profile from "../../src/profile/profile";

describe("Profile constructor", () => {
    it("Throws error for unsupported precision of 1", () => {
        expect(
            () => new Profile([], 1)
        ).to.throw(Error);
    });
});

/*
 * The following 6 tests cover the cash flow ordering and factor calculation private methods
 */

describe("Profile assignFactors using US30360 with posting dates, exclude charge cash flows", () => {
    const cfa0 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 600.0);
    const cfa1 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 16), 400.0);
    const cfp0 = new CashFlowPayment(new Date(2019, 1, 1), 100.0);
    const cfp1 = new CashFlowPayment(new Date(2019, 2, 1), 300.0);
    const cfp2 = new CashFlowPayment(new Date(2019, 2, 1), 400.0);
    const cfp3 = new CashFlowPayment(new Date(2019, 2, 1), 200.0, undefined, false);
    const cfc0 = new CashFlowCharge(new Date(2019, 0, 1), 10.0);
    const cfc1 = new CashFlowCharge(new Date(2019, 1, 16), 20.0);
    // Create unordered profile
    const prof = new Profile([cfp1, cfp0, cfp3, cfp2, cfa1, cfa0, cfc1, cfc0]);
    prof.assignFactors(new US30360());

    it("Profile drawdown posting date equal to 01/01/2019", () => {
        expect(prof.drawdownPDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
    });
    it("Profile drawdown value date equal to 01/01/2019", () => {
        expect(prof.drawdownVDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
    });

    it("cashFlow[0]: 600.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[0];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-600.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[1]: 400.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[1];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[2] 10.0 charge, factor of 0.0 (excluded)", () => {
        const cf = prof.cashFlows[2];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(10.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[3] 100.0 payment, factor of 0.08333333333333333", () => {
        const cf = prof.cashFlows[3];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 1, 1).getTime());
        expect(cf.value).to.equal(100.0);
        expect((cf as CashFlowPayment).isIntCapitalised()).to.be.true;
        expect(cf.periodFactor.factor).to.equal(0.08333333333333333);
    });
    it("cashFlow[4] 20.0 charge, factor of 0.0 (excluded)", () => {
        const cf = prof.cashFlows[4];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 1, 16).getTime());
        expect(cf.value).to.equal(20.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[5] 200.0 payment, factor of 0.08333333333333333", () => {
        const cf = prof.cashFlows[5];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(200.0);
        expect(cf.periodFactor.factor).to.equal(0.08333333333333333);
    });
    it("cashFlow[6] 300.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[6];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(300.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[7] 400.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[7];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
});

describe("Profile assignFactors using US30360 with posting dates, include charge cash flows", () => {
    const cfa0 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 600.0);
    const cfa1 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 16), 400.0);
    const cfp0 = new CashFlowPayment(new Date(2019, 1, 1), 100.0);
    const cfp1 = new CashFlowPayment(new Date(2019, 2, 1), 300.0);
    const cfp2 = new CashFlowPayment(new Date(2019, 2, 1), 400.0);
    const cfp3 = new CashFlowPayment(new Date(2019, 2, 1), 200.0, undefined, false);
    const cfc0 = new CashFlowCharge(new Date(2019, 0, 1), 10.0);
    const cfc1 = new CashFlowCharge(new Date(2019, 1, 16), 20.0);
    // Create unordered profile
    const prof = new Profile([cfp1, cfp0, cfp3, cfp2, cfa1, cfa0, cfc1, cfc0]);
    prof.assignFactors(new US30360(true, true));

    it("cashFlow[0]: 600.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[0];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-600.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[1]: 400.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[1];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[2] 10.0 charge, factor of 0.0 (included)", () => {
        const cf = prof.cashFlows[2];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(10.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[3] 100.0 payment, factor of 0.08333333333333333", () => {
        const cf = prof.cashFlows[3];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 1, 1).getTime());
        expect(cf.value).to.equal(100.0);
        expect((cf as CashFlowPayment).isIntCapitalised()).to.be.true;
        expect(cf.periodFactor.factor).to.equal(0.08333333333333333);
    });
    it("cashFlow[4] 20.0 charge, factor of 0.041666666666666664 (included)", () => {
        const cf = prof.cashFlows[4];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 1, 16).getTime());
        expect(cf.value).to.equal(20.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[5] 200.0 payment, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[5];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(200.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[6] 300.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[6];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(300.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[7] 400.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[7];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
});

describe("Profile assignFactors using US30360 with posting dates relative to first drawdown, include charge cash flows", () => {
    const cfa0 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 600.0);
    const cfa1 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 16), 400.0);
    const cfp0 = new CashFlowPayment(new Date(2019, 1, 1), 100.0);
    const cfp1 = new CashFlowPayment(new Date(2019, 2, 1), 300.0);
    const cfp2 = new CashFlowPayment(new Date(2019, 2, 1), 400.0);
    const cfp3 = new CashFlowPayment(new Date(2019, 2, 1), 200.0, undefined, false);
    const cfc0 = new CashFlowCharge(new Date(2019, 0, 1), 10.0);
    const cfc1 = new CashFlowCharge(new Date(2019, 1, 16), 20.0);
    // Create unordered profile
    let prof = new Profile([cfp1, cfp0, cfp3, cfp2, cfa1, cfa0, cfc1, cfc0]);
    prof.assignFactors(new US30360(true, true, true));

    it("cashFlow[0]: 600.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[0];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-600.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[1]: 400.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[1];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[2] 10.0 charge, factor of 0.0 (included)", () => {
        const cf = prof.cashFlows[2];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(10.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[3] 100.0 payment, factor of 0.08333333333333333", () => {
        const cf = prof.cashFlows[3];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 1, 1).getTime());
        expect(cf.value).to.equal(100.0);
        expect((cf as CashFlowPayment).isIntCapitalised()).to.be.true;
        expect(cf.periodFactor.factor).to.equal(0.08333333333333333);
    });
    it("cashFlow[4] 20.0 charge, factor of 0.125 (included)", () => {
        const cf = prof.cashFlows[4];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 1, 16).getTime());
        expect(cf.value).to.equal(20.0);
        expect(cf.periodFactor.factor).to.equal(0.125);
    });
    it("cashFlow[5] 200.0 payment, factor of 0.16666666666666666", () => {
        const cf = prof.cashFlows[5];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(200.0);
        expect(cf.periodFactor.factor).to.equal(0.16666666666666666);
    });
    it("cashFlow[6] 300.0 payment, factor of 0.16666666666666666", () => {
        const cf = prof.cashFlows[6];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(300.0);
        expect(cf.periodFactor.factor).to.equal(0.16666666666666666);
    });
    it("cashFlow[7] 400.0 payment, factor of 0.16666666666666666", () => {
        const cf = prof.cashFlows[7];
        expect(cf.postingDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(400.0);
        expect(cf.periodFactor.factor).to.equal(0.16666666666666666);
    });
});

describe("Profile assignFactors using US30360 with value dates, exclude charge cash flows", () => {
    const cfa0 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 600.0);
    const cfa1 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 16), 400.0);
    const cfp0 = new CashFlowPayment(new Date(2019, 1, 1), 100.0);
    const cfp1 = new CashFlowPayment(new Date(2019, 2, 1), 300.0);
    const cfp2 = new CashFlowPayment(new Date(2019, 2, 1), 400.0);
    const cfp3 = new CashFlowPayment(new Date(2019, 2, 1), 200.0, undefined, false);
    const cfc0 = new CashFlowCharge(new Date(2019, 0, 1), 10.0);
    const cfc1 = new CashFlowCharge(new Date(2019, 1, 16), 20.0);
    // Create unordered profile
    let prof = new Profile([cfp1, cfp0, cfp3, cfp2, cfa1, cfa0, cfc1, cfc0]);
    prof.assignFactors(new US30360(false));

    it("cashFlow[0]: 600.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[0];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-600.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[1] 10.0 charge, factor of 0.0 (excluded)", () => {
        const cf = prof.cashFlows[1];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(10.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[2]: 400.0 advance, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[2];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 16).getTime());
        expect(cf.value).to.equal(-400.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[3] 100.0 payment, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[3];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 1, 1).getTime());
        expect(cf.value).to.equal(100.0);
        expect((cf as CashFlowPayment).isIntCapitalised()).to.be.true;
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[4] 20.0 charge, factor of 0.0 (excluded)", () => {
        const cf = prof.cashFlows[4];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 1, 16).getTime());
        expect(cf.value).to.equal(20.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[5] 200.0 payment, factor of 0.08333333333333333", () => {
        const cf = prof.cashFlows[5];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(200.0);
        expect(cf.periodFactor.factor).to.equal(0.08333333333333333);
    });
    it("cashFlow[6] 300.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[6];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(300.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[7] 400.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[7];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
});

describe("Profile assignFactors using US30360 with value dates, include charge cash flows", () => {
    const cfa0 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 600.0);
    const cfa1 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 16), 400.0);
    const cfp0 = new CashFlowPayment(new Date(2019, 1, 1), 100.0);
    const cfp1 = new CashFlowPayment(new Date(2019, 2, 1), 300.0);
    const cfp2 = new CashFlowPayment(new Date(2019, 2, 1), 400.0);
    const cfp3 = new CashFlowPayment(new Date(2019, 2, 1), 200.0, undefined, false);
    const cfc0 = new CashFlowCharge(new Date(2019, 0, 1), 10.0);
    const cfc1 = new CashFlowCharge(new Date(2019, 1, 16), 20.0);
    // Create unordered profile
    let prof = new Profile([cfp1, cfp0, cfp3, cfp2, cfa1, cfa0, cfc1, cfc0]);
    prof.assignFactors(new US30360(false, true));

    it("cashFlow[0]: 600.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[0];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-600.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[1] 10.0 charge, factor of 0.0 (included)", () => {
        const cf = prof.cashFlows[1];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(10.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[2]: 400.0 advance, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[2];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 16).getTime());
        expect(cf.value).to.equal(-400.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[3] 100.0 payment, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[3];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 1, 1).getTime());
        expect(cf.value).to.equal(100.0);
        expect((cf as CashFlowPayment).isIntCapitalised()).to.be.true;
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[4] 20.0 charge, factor of 0.041666666666666664 (included)", () => {
        const cf = prof.cashFlows[4];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 1, 16).getTime());
        expect(cf.value).to.equal(20.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[5] 200.0 payment, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[5];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(200.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[6] 300.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[6];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(300.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[7] 400.0 payment, factor of 0.0", () => {
        const cf = prof.cashFlows[7];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(400.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
});

describe("Profile assignFactors using US30360 with value dates relative to first drawdown, exclude charge cash flows", () => {
    const cfa0 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 600.0);
    const cfa1 = new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 16), 400.0);
    const cfp0 = new CashFlowPayment(new Date(2019, 1, 1), 100.0);
    const cfp1 = new CashFlowPayment(new Date(2019, 2, 1), 300.0);
    const cfp2 = new CashFlowPayment(new Date(2019, 2, 1), 400.0);
    const cfp3 = new CashFlowPayment(new Date(2019, 2, 1), 200.0, undefined, false);
    const cfc0 = new CashFlowCharge(new Date(2019, 0, 1), 10.0);
    const cfc1 = new CashFlowCharge(new Date(2019, 1, 16), 20.0);
    // Create unordered profile
    let prof = new Profile([cfp1, cfp0, cfp3, cfp2, cfa1, cfa0, cfc1, cfc0]);
    prof.assignFactors(new US30360(false, false, true));

    it("cashFlow[0]: 600.0 advance, factor of 0.0", () => {
        const cf = prof.cashFlows[0];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(-600.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[1] 10.0 charge, factor of 0.0 (excluded)", () => {
        const cf = prof.cashFlows[1];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 1).getTime());
        expect(cf.value).to.equal(10.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[2]: 400.0 advance, factor of 0.041666666666666664", () => {
        const cf = prof.cashFlows[2];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 0, 16).getTime());
        expect(cf.value).to.equal(-400.0);
        expect(cf.periodFactor.factor).to.equal(0.041666666666666664);
    });
    it("cashFlow[3] 100.0 payment, factor of 0.08333333333333333", () => {
        const cf = prof.cashFlows[3];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 1, 1).getTime());
        expect(cf.value).to.equal(100.0);
        expect((cf as CashFlowPayment).isIntCapitalised()).to.be.true;
        expect(cf.periodFactor.factor).to.equal(0.08333333333333333);
    });
    it("cashFlow[4] 20.0 charge, factor of 0.0 (excluded)", () => {
        const cf = prof.cashFlows[4];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 1, 16).getTime());
        expect(cf.value).to.equal(20.0);
        expect(cf.periodFactor.factor).to.equal(0.0);
    });
    it("cashFlow[5] 200.0 payment, factor of 0.16666666666666666", () => {
        const cf = prof.cashFlows[5];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(200.0);
        expect(cf.periodFactor.factor).to.equal(0.16666666666666666);
    });
    it("cashFlow[6] 300.0 payment, factor of 0.16666666666666666", () => {
        const cf = prof.cashFlows[6];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(300.0);
        expect(cf.periodFactor.factor).to.equal(0.16666666666666666);
    });
    it("cashFlow[7] 400.0 payment, factor of 0.16666666666666666", () => {
        const cf = prof.cashFlows[7];
        expect(cf.valueDate.getTime()).to.equal(new Date(2019, 2, 1).getTime());
        expect(cf.value).to.equal(400.0);
        expect(cf.periodFactor.factor).to.equal(0.16666666666666666);
    });
});

describe("Profile updateValues with no rounding", () => {
    const today = new Date();
    let prof = new Profile([
        new CashFlowAdvance(today, today, 1000.0),
        new CashFlowPayment(today),
        new CashFlowPayment(today)]);
    prof.updateValues(500.006, false);

    it("cashFlow[0]: 1000.00 advance (not updated)", () => {
        expect(prof.cashFlows[0].value).to.equal(-1000.0);
    });
    it("cashFlow[1]: 500.006 payment", () => {
        expect(prof.cashFlows[1].value).to.equal(500.006);
    });
    it("cashFlow[2]: 500.006 payment", () => {
        expect(prof.cashFlows[2].value).to.equal(500.006);
    });
});

describe("Profile updateValues with rounding (2dp by default)", () => {
    const today = new Date();
    let prof = new Profile([
        new CashFlowAdvance(today, today, 1000.0),
        new CashFlowPayment(today),
        new CashFlowPayment(today)]);
    prof.updateValues(500.006, true);

    it("cashFlow[0]: 1000.00 advance (not updated)", () => {
        expect(prof.cashFlows[0].value).to.equal(-1000.0);
    });
    it("cashFlow[1]: 500.01 payment", () => {
        expect(prof.cashFlows[1].value).to.equal(500.01);
    });
    it("cashFlow[2]: 500.01 payment", () => {
        expect(prof.cashFlows[2].value).to.equal(500.01);
    });
});

describe("Profile updateAmortInt", () => {
    let prof = new Profile([
        new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0), // ignored
        new CashFlowCharge(new Date(2019, 0, 1), 10.0), // ignored
        new CashFlowPayment(new Date(2019, 1, 1), 340.02, undefined, false),
        new CashFlowPayment(new Date(2019, 2, 1), 340.02, undefined, false),
        new CashFlowPayment(new Date(2019, 3, 1), 340.02)
    ]);
    prof.assignFactors(new US30360());
    prof.updateAmortInt(0.12);

    it("cashFlow[2]: 0.0 interest", () => {
        expect((prof.cashFlows[2] as CashFlowPayment).interest).to.equal(0.0);
    });
    it("cashFlow[3]: 0.0 interest", () => {
        expect((prof.cashFlows[3] as CashFlowPayment).interest).to.equal(0.0);
    });
    it("cashFlow[4]: 500.01 payment", () => {
        expect((prof.cashFlows[4] as CashFlowPayment).interest).to.equal(-20.06);
    });
});
