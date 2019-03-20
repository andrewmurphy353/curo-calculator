import { expect } from "chai";
import "mocha";
import SeriesCharge from "../../src/series/series-charge";
import { Frequency } from "../../src/series/frequency";
import { Mode } from "../../src/series/mode";

describe("SeriesCharge", () => {
  it("Will be instantiated with member variable default values", () => {
    const seriesChg = SeriesCharge.builder().build();
    expect(seriesChg.amount).to.be.undefined;
    expect(seriesChg.frequency).to.be.equal(Frequency.Monthly);
    expect(seriesChg.label).to.be.undefined;
    expect(seriesChg.mode).to.be.equal(Mode.Advance);
    expect(seriesChg.numberOf).to.be.equal(1.0);
    expect(seriesChg.postedDate).to.be.undefined;
  });
  it("Will have all member variables defined as per user input", () => {
    const seriesChg = SeriesCharge.builder()
      .setAmount(100.0)
      .setFrequency(Frequency.Quarterly)
      .setLabel("label")
      .setMode(Mode.Arrear)
      .setNumberOf(36)
      .setDueOnOrFrom(new Date(2019, 5, 1))
      .build();
    expect(seriesChg.amount).to.equal(100.0);
    expect(seriesChg.frequency).to.equal(Frequency.Quarterly);
    expect(seriesChg.label).to.equal("label");
    expect(seriesChg.mode).to.equal(Mode.Arrear);
    expect(seriesChg.numberOf).to.equal(36);
    expect(seriesChg.postedDate.getTime()).to.equal(
      new Date(2019, 5, 1).getTime()
    );
  });
  it("Will throw an error when numberOf < 1", () => {
    expect(() =>
      SeriesCharge.builder()
        .setNumberOf(-1.5)
        .build()
    ).to.throw(Error);
  });
});
