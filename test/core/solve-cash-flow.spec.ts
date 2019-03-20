import { expect } from "chai";
import "mocha";
import SolveCashFlow from "../../src/core/solve-cash-flow";
import Profile from "../../src/profile/profile";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowCharge from "../../src/profile/cash-flow-charge";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import US30360 from "../../src/day-count/us-30-360";

describe("SolveCashFlow", () => {
    it("Payment value guess where NFV is equal to 0.00 approx using an effective rate of 12.0% (IRR)", () => {
        const prof = new Profile([
            new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0),
            new CashFlowPayment(new Date(2019, 1, 1)),
            new CashFlowPayment(new Date(2019, 2, 1)),
            new CashFlowPayment(new Date(2019, 3, 1)),
            new CashFlowCharge(new Date(2019, 0, 1), 10.0)
        ]);
        const solveCf = new SolveCashFlow(prof, new US30360(), 0.12);
        expect(solveCf.compute(340.02)).to.equal(-0.006398000000046977);
        expect(solveCf.label()).to.equal("Cash Flow Value");
    });
});
