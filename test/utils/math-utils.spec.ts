import { expect } from "chai";
import "mocha";
import MathUtils from "../../src/utils/math-utils";

describe("MathUtils.gaussRound", () => {
  it("Rounding 1.5 to 0 decimal places should give 2", () => {
    expect(2.0).to.equal(MathUtils.gaussRound(1.5));
  });
  it("Rounding 2.5 to 0 decimal places should give 2", () => {
    expect(2.0).to.equal(MathUtils.gaussRound(2.5));
  });
  it("Rounding 1.535 to 2 decimal places should give 1.54", () => {
    expect(1.54).to.equal(MathUtils.gaussRound(1.535, 2));
  });
  it("Rounding 1.525 to 2 decimal places should give 1.52", () => {
    expect(1.52).to.equal(MathUtils.gaussRound(1.525, 2));
  });
});
