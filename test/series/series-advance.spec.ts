import { expect } from "chai";
import "mocha";
import SeriesAdvance from "../../src/series/series-advance";
import { Frequency } from "../../src/series/frequency";
import { Mode } from "../../src/series/mode";

describe("SeriesAdvance", () => {
  it("Will be instantiated with member variable default values", () => {
    const seriesAdv = SeriesAdvance.builder().build();
    expect(seriesAdv.amount).to.be.undefined;
    expect(seriesAdv.postedDate).to.be.undefined;
    expect(seriesAdv.frequency).to.be.equal(Frequency.Monthly);
    expect(seriesAdv.label).to.be.undefined;
    expect(seriesAdv.mode).to.be.equal(Mode.Advance);
    expect(seriesAdv.numberOf).to.be.equal(1.0);
    expect(seriesAdv.weighting).to.be.equal(1.0);
  });

  it("Will have all member variables defined as per user input", () => {
    const seriesAdv = SeriesAdvance.builder()
      .setAmount(100.0)
      .setDrawdownFrom(new Date(2019, 5, 1))
      .setFrequency(Frequency.Quarterly)
      .setLabel("label")
      .setMode(Mode.Arrear)
      .setNumberOf(36)
      .setWeighting(3.5)
      .build();
    expect(seriesAdv.amount).to.equal(100.0);
    expect(seriesAdv.postedDate.getTime()).to.equal(
      new Date(2019, 5, 1).getTime()
    );
    expect(seriesAdv.frequency).to.equal(Frequency.Quarterly);
    expect(seriesAdv.label).to.equal("label");
    expect(seriesAdv.mode).to.equal(Mode.Arrear);
    expect(seriesAdv.numberOf).to.equal(36);
    expect(seriesAdv.weighting).to.equal(3.5);
  });
  it("Will throw an error when numberOf < 1", () => {
    expect(() =>
      SeriesAdvance.builder()
        .setNumberOf(-1.5)
        .build()
    ).to.throw(Error);
  });
  it("Will throw an error when weighting < 1", () => {
    expect(() =>
      SeriesAdvance.builder()
        .setWeighting(-3.5)
        .build()
    ).to.throw(Error);
  });
  it("Will throw an error when the setSettlementOn date is defined without a setDrawdownOn date", () => {
    expect(() =>
      SeriesAdvance.builder()
        .setSettlementOn(new Date())
        .build()
    ).to.throw(Error);
  });
  it("Will throw an error when the setSettlementOn date occurs before the setDrawdownOn date", () => {
    expect(() =>
      SeriesAdvance.builder()
        .setDrawdownFrom(new Date(2019, 1))
        .setSettlementOn(new Date(2019, 0))
        .build()
    ).to.throw(Error);
  });

});
