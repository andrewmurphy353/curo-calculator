import { expect } from "chai";
import "mocha";
import SolveNfv from "../../src/core/solve-nfv";
import CashFlowAdvance from "../../src/profile/cash-flow-advance";
import CashFlowPayment from "../../src/profile/cash-flow-payment";
import CashFlowCharge from "../../src/profile/cash-flow-charge";
import Profile from "../../src/profile/profile";
import US30360 from "../../src/day-count/us-30-360";

describe("SolveNfv", () => {
    it("NFV based on Convention.NEIGHBOUR time periods should equal 0.00 approx using rate of 12.0% (IRR)", () => {
        const prof = new Profile([
            new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0),
            new CashFlowPayment(new Date(2019, 1, 1), 340.02),
            new CashFlowPayment(new Date(2019, 2, 1), 340.02),
            new CashFlowPayment(new Date(2019, 3, 1), 340.02),
            new CashFlowCharge(new Date(2019, 0, 1), 10.0)
        ]);
        const solveIrr = new SolveNfv(prof, new US30360());
        expect(solveIrr.compute(0.12)).to.equal(-0.006398000000046977);
        expect(solveIrr.label()).to.equal("Net Future Value");
    });
    it("NFV based on Convention.NEIGHBOUR time periods should equal 0.00 approx with irregular compounding using rate of 12.16% (IRR)", () => {
        let prof = new Profile([
            new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0),
            new CashFlowCharge(new Date(2019, 0, 1), 10.0),
            new CashFlowPayment(new Date(2019, 1, 1), 340.02, undefined, false),
            new CashFlowPayment(new Date(2019, 2, 1), 340.02, undefined, false),
            new CashFlowPayment(new Date(2019, 3, 1), 340.02)
        ]);
        const solveIrr = new SolveNfv(prof, new US30360());
        expect(solveIrr.compute(0.1216)).to.equal(-0.003392000000076223);
    });
    it("NFV based on Convention.DRAWDOWN time periods should equal 0.00 approx using rate of 19.71% (XIRR)", () => {
        const prof = new Profile([
            new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0),
            new CashFlowPayment(new Date(2019, 1, 1), 340.02),
            new CashFlowPayment(new Date(2019, 2, 1), 340.02),
            new CashFlowPayment(new Date(2019, 3, 1), 340.02),
            new CashFlowCharge(new Date(2019, 0, 1), 10.0)
        ]);
        const solveXirr = new SolveNfv(prof, new US30360(undefined, true, true));
        expect(solveXirr.compute(0.1971)).to.equal(0.0030105880029509535);
    });
    it("NFV based on Convention.DRAWDOWN time periods should equal 0.00 approx with irregular compounding using rate of 12.68% (XIRR)", () => {
        let prof = new Profile([
            new CashFlowAdvance(new Date(2019, 0, 1), new Date(2019, 0, 1), 1000.0),
            new CashFlowCharge(new Date(2019, 0, 1), 10.0),
            new CashFlowPayment(new Date(2019, 1, 1), 340.02, undefined, false),
            new CashFlowPayment(new Date(2019, 2, 1), 340.02, undefined, false),
            new CashFlowPayment(new Date(2019, 3, 1), 340.02)
        ]);
        const solveIrr = new SolveNfv(prof, new US30360(undefined, false, true));
        expect(solveIrr.compute(0.1268)).to.equal(-0.0025199269198878937);
    });
});
