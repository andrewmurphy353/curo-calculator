import { expect } from "chai";
import "mocha";
import { Frequency } from "../../src/series/frequency";
import { Mode } from "../../src/series/mode";
import SeriesPayment from "../../src/series/series-payment";

describe("SeriesPayment", () => {
  it("Will be instantiated with member variable default values", () => {
    const pmtSeries = SeriesPayment.builder().build();
    expect(pmtSeries.amount).to.be.undefined;
    expect(pmtSeries.frequency).to.be.equal(Frequency.Monthly);
    expect(pmtSeries.isIntCap).to.be.true;
    expect(pmtSeries.label).to.be.undefined;
    expect(pmtSeries.mode).to.be.equal(Mode.Advance);
    expect(pmtSeries.numberOf).to.be.equal(1.0);
    expect(pmtSeries.postedDate).to.be.undefined;
    expect(pmtSeries.weighting).to.be.equal(1.0);
  });
  it("Will have all member variables defined as per user input", () => {
    const pmtSeries = SeriesPayment.builder()
      .setAmount(100.0)
      .setFrequency(Frequency.Quarterly)
      .setIsIntCap(false)
      .setLabel("label")
      .setMode(Mode.Arrear)
      .setNumberOf(36)
      .setDueOnOrFrom(new Date(2019, 5, 1))
      .setWeighting(3.5)
      .build();
    expect(pmtSeries.amount).to.equal(100.0);
    expect(pmtSeries.frequency).to.equal(Frequency.Quarterly);
    expect(pmtSeries.isIntCap).to.be.false;
    expect(pmtSeries.label).to.equal("label");
    expect(pmtSeries.mode).to.equal(Mode.Arrear);
    expect(pmtSeries.numberOf).to.equal(36);
    expect(pmtSeries.postedDate.getTime()).to.equal(
      new Date(2019, 5, 1).getTime()
    );
    expect(pmtSeries.weighting).to.equal(3.5);
  });
  it("Will throw an error when numberOf < 1", () => {
    expect(() =>
      SeriesPayment.builder()
        .setNumberOf(-1.5)
        .build()
    ).to.throw(Error);
  });
  it("Will throw an error when weighting < 1", () => {
    expect(() =>
      SeriesPayment.builder()
        .setWeighting(-3.5)
        .build()
    ).to.throw(Error);
  });
});
