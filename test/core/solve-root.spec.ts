import { expect } from "chai";
import "mocha";
import Callback from "../../src/core/callback";
import SolveRoot from "../../src/core/solve-root";

describe("SolveRoot", () => {
    it("Throws error when unable to solve root in max iterations", () => {
        const callbackMock: Callback = <Callback>{
            compute(guess: number): number {
                // unsolvable
                return 0;
            }
        };
        expect(
            () => SolveRoot.solve(callbackMock)
        ).to.throw(Error);
    });
    it("Solving for the root of function (x + 15) * (x + 10) * (x + 20) * (x - 4.5)", () => {
        const callbackMock: Callback = <Callback>{
            compute(guess: number): number {
                return (guess + 15) * (guess + 10) * (guess + 20) * (guess - 4.5);
            }
        };
        expect(SolveRoot.solve(callbackMock, 0.01)).to.equal(4.5);
    });
});
