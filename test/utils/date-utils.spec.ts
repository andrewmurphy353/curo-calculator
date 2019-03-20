import { expect } from "chai";
import "mocha";
import { Frequency } from "../../src/series/frequency";
import DateUtils from "../../src/utils/date-utils";

describe("DateUtils.actualDays", () => {
  it("28/01/2020 to 28/02/2020 to return 31 days", () => {
    expect(31.0).to.equal(
      DateUtils.actualDays(new Date(2020, 0, 28), new Date(2020, 1, 28))
    );
  });
  it("28/02/2020 to 28/03/2020 to return 29 days", () => {
    expect(29.0).to.equal(
      DateUtils.actualDays(new Date(2020, 1, 28), new Date(2020, 2, 28))
    );
  });
  it("29/01/2020 to 29/02/2020 to return 31 days", () => {
    expect(31.0).to.equal(
      DateUtils.actualDays(new Date(2020, 0, 29), new Date(2020, 1, 29))
    );
  });
  it("29/02/2020 to 29/03/2020 to return 29 days", () => {
    expect(29.0).to.equal(
      DateUtils.actualDays(new Date(2020, 1, 29), new Date(2020, 2, 29))
    );
  });
  it("30/01/2020 to 29/02/2020 to return 30 days", () => {
    expect(30.0).to.equal(
      DateUtils.actualDays(new Date(2020, 0, 30), new Date(2020, 1, 29))
    );
  });
  it("29/02/2020 to 30/03/2020 to return 30 days", () => {
    expect(30.0).to.equal(
      DateUtils.actualDays(new Date(2020, 1, 29), new Date(2020, 2, 30))
    );
  });
  it("31/01/2020 to 29/02/2020 to return 29 days", () => {
    expect(29.0).to.equal(
      DateUtils.actualDays(new Date(2020, 0, 31), new Date(2020, 1, 29))
    );
  });
  it("29/02/2020 to 31/03/2020 to return 31 days", () => {
    expect(31.0).to.equal(
      DateUtils.actualDays(new Date(2020, 1, 29), new Date(2020, 2, 31))
    );
  });
  it("01/03/2020 to 01/04/2020 to return 31 days", () => {
    expect(31.0).to.equal(
      DateUtils.actualDays(new Date(2020, 2, 1), new Date(2020, 3, 1))
    );
  });
  it("01/02/2020 to 01/03/2020 [leap-year] to return 29 days", () => {
    expect(29.0).to.equal(
      DateUtils.actualDays(new Date(2020, 1, 1), new Date(2020, 2, 1))
    );
  });
  it("01/02/2019 to 01/03/2019 [non leap-year] to return 28 days", () => {
    expect(28.0).to.equal(
      DateUtils.actualDays(new Date(2019, 1, 1), new Date(2019, 2, 1))
    );
  });
  it("01/02/2019 to 02/02/2019 to return 1 day", () => {
    expect(1.0).to.equal(
      DateUtils.actualDays(new Date(2019, 1, 1), new Date(2019, 1, 2))
    );
  });
  it("01/02/2019 to 01/02/2019 to return 0 days", () => {
    expect(0.0).to.equal(
      DateUtils.actualDays(new Date(2019, 1, 1), new Date(2019, 1, 1))
    );
  });
  it("01/01/2019 to 01/01/2020 to return 365 days", () => {
    expect(365.0).to.equal(
      DateUtils.actualDays(new Date(2019, 0, 1), new Date(2020, 0, 1))
    );
  });
  it("01/01/2020 to 01/01/2021 to return 366 days", () => {
    expect(366.0).to.equal(
      DateUtils.actualDays(new Date(2020, 0, 1), new Date(2021, 0, 1))
    );
  });
  it("31/12/2019 to 01/01/2021 to return 367 days", () => {
    expect(367.0).to.equal(
      DateUtils.actualDays(new Date(2019, 11, 31), new Date(2021, 0, 1))
    );
  });
});

describe("DateUtils.hasLeapYear", () => {
  it("1999 to 2000 to return true for year 2000", () => {
    expect(true).to.equal(DateUtils.hasLeapYear(1999, 2000));
  });
  it("2001 to 2000 to return false as yearFrom post-dates yearTo", () => {
    expect(false).to.equal(DateUtils.hasLeapYear(2001, 2000));
  });
  it("2000 to 2000 to return true", () => {
    expect(true).to.equal(DateUtils.hasLeapYear(2000, 2000));
  });
  it("2017 to 2021 to return true for year 2020", () => {
    expect(true).to.equal(DateUtils.hasLeapYear(2017, 2020));
  });
});

describe("DateUtils.isLeapYear", () => {
  it("2019 is not devisible by 4", () => {
    expect(false).to.equal(DateUtils.isLeapYear(2019));
  });
  it("2016 is divisible by 4 but not 100 (every fourth year, excluding century year)", () => {
    expect(true).to.equal(DateUtils.isLeapYear(2016));
  });
  it("2020 is divisible by 4 but not 100 (every fourth year, excluding century year)", () => {
    expect(true).to.equal(DateUtils.isLeapYear(2020));
  });
  it("2024 is divisible by 4 but not 100 (every fourth year, excluding century year)", () => {
    expect(true).to.equal(DateUtils.isLeapYear(2024));
  });
  it("1600 is divisible by 4 and 100 and 400 (every fourth century is a leap year)", () => {
    expect(true).to.equal(DateUtils.isLeapYear(1600));
  });
  it("2000 is divisible by 4 and 100 and 400 (every fourth century is a leap year)", () => {
    expect(true).to.equal(DateUtils.isLeapYear(2000));
  });
  it("2400 is divisible by 4 and 100 and 400 (every fourth century is a leap year)", () => {
    expect(true).to.equal(DateUtils.isLeapYear(2400));
  });
  it("1900 is divisible by 4 and 100 but not 400 (all centuries except the fourth)", () => {
    expect(false).to.equal(DateUtils.isLeapYear(1900));
  });
  it("2100 is divisible by 4 and 100 but not 400 (all centuries except the fourth)", () => {
    expect(false).to.equal(DateUtils.isLeapYear(2100));
  });
  it("2200 is divisible by 4 and 100 but not 400 (all centuries except the fourth)", () => {
    expect(false).to.equal(DateUtils.isLeapYear(2200));
  });
});

describe("DateUtils.rollDate", () => {
  it("Weekly: 28th Feb 2020 by 1 week", () => {
    expect(new Date(Date.UTC(2020, 2, 6)).getTime()).to.equal(
      DateUtils.rollDate(new Date(2020, 1, 28), Frequency.Weekly, 28).getTime()
    );
  });
  it("Fortnightly: 28th Feb 2020 by 2 weeks", () => {
    expect(new Date(Date.UTC(2020, 2, 13)).getTime()).to.equal(
      DateUtils.rollDate(new Date(2020, 1, 28), Frequency.Fortnightly, 28).getTime()
    );
  });
  it("Monthly: 28th Feb 2020 by 1 month", () => {
    expect(new Date(Date.UTC(2020, 2, 28)).getTime()).to.equal(
      DateUtils.rollDate(new Date(2020, 1, 28), Frequency.Monthly, 28).getTime()
    );
  });
  it("Quarterly: 28th Feb 2020 by 1 quarter", () => {
    expect(new Date(Date.UTC(2020, 4, 28)).getTime()).to.equal(
      DateUtils.rollDate(new Date(2020, 1, 28), Frequency.Quarterly, 28).getTime()
    );
  });
  it("Half yearly: 28th Feb 2020 by 1 half year", () => {
    expect(new Date(Date.UTC(2020, 7, 28)).getTime()).to.equal(
      DateUtils.rollDate(new Date(2020, 1, 28), Frequency.HalfYearly, 28).getTime()
    );
  });
  it("Yearly: 28th Feb 2020 by 1 year", () => {
    expect(new Date(Date.UTC(2021, 1, 28)).getTime()).to.equal(
      DateUtils.rollDate(new Date(2020, 1, 28), Frequency.Yearly, 28).getTime()
    );
  });
});

describe("DateUtils.rollDay", () => {
  it("Backward: 1st March 2020 to last day in February 2020 [leap-year]", () => {
    expect(new Date(Date.UTC(2020, 1, 29)).getTime()).to.equal(
      DateUtils.rollDay(new Date(2020, 2, 1), -1).getTime()
    );
  });
  it("Backward: 1st March 2019 to last day in February 2019 [non leap-year]", () => {
    expect(new Date(Date.UTC(2019, 1, 28)).getTime()).to.equal(
      DateUtils.rollDay(new Date(2019, 2, 1), -1).getTime()
    );
  });
});

describe("DateUtils.rollMonth", () => {
  it("Forward: 31st January 2019 to last day in February 2019 [non leap-year]", () => {
    expect(new Date(Date.UTC(2019, 1, 28)).getTime()).to.equal(
      DateUtils.rollMonth(new Date(2019, 0, 31), 1, 31).getTime()
    );
  });
  it("Forward: 31st January 2020 to last day in February 2020 [leap-year]", () => {
    expect(new Date(Date.UTC(2020, 1, 29)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2020, 0, 31), 1, 31).toDateString()
    );
  });
  it("Backward: 28th February 2020 to last day in January 2020 [leap-year]", () => {
    expect(new Date(Date.UTC(2020, 0, 31)).getTime()).to.equal(
      DateUtils.rollMonth(new Date(2020, 1, 28), -1, 31).getTime()
    );
  });
  it("Backward: 31st March 2020 to last day in February 2020 [leap-year]", () => {
    expect(new Date(Date.UTC(2020, 1, 29)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2020, 2, 31), -1, 31).toDateString()
    );
  });
  it("Forward: 31st January 2019 to last day in February 2019 [non leap-year, no preferred day of month]", () => {
    expect(new Date(Date.UTC(2019, 1, 28)).getTime()).to.equal(
      DateUtils.rollMonth(new Date(2019, 0, 31), 1).getTime()
    );
  });
  it("Forward: 28th February 2019 by two months [non-leap-year, no preferred day of month]", () => {
    expect(new Date(Date.UTC(2019, 3, 28)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2019, 1, 28), 2).toDateString()
    );
  });
  it("Forward: 31st December 2018 by two months [non-leap-year, no preferred day of month]", () => {
    expect(new Date(Date.UTC(2019, 1, 28)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2018, 11, 31), 2).toDateString()
    );
  });
  it("Forward: 31st January 2020 by one month [leap-year, no preferred day of month]", () => {
    expect(new Date(Date.UTC(2020, 1, 29)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2020, 0, 31), 1).toDateString()
    );
  });
  it("Backward: 31st March 2019 by one month [non-leap-year, no preferred day of month]", () => {
    expect(new Date(Date.UTC(2019, 1, 28)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2019, 2, 31), -1).toDateString()
    );
  });
  it("Backward: 31st January 2020 by two months [leap-year, no preferred day of month]", () => {
    expect(new Date(Date.UTC(2019, 10, 30)).toDateString()).to.equal(
      DateUtils.rollMonth(new Date(2020, 0, 31), -2).toDateString()
    );
  });
});
