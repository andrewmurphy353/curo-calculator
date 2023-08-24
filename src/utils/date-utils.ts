import { Frequency } from '../series/frequency'

/**
 * Date utilities class
 */
export default class DateUtils {
  /**
   * Compute the actual number of days between two dates.
   */
  public static actualDays (date1: Date, date2: Date): number {
    return Math.abs(
      (this.dateToUTC(date1).getTime() - this.dateToUTC(date2).getTime()) /
      this.MS_IN_DAY
    )
  }

  /**
   * Check if a particular range of years contains a leap-year.
   *
   * @param yearFrom the earlier of two years
   * @param yearTo the later of two years
   * @return true if range includes a leap year, false otherwise
   */
  public static hasLeapYear (yearFrom: number, yearTo: number): boolean {
    for (let i = yearFrom; i <= yearTo; i++) {
      if (DateUtils.isLeapYear(i)) {
        return true
      }
    }
    return false
  }

  /**
   * Check if a year is a leap year.
   *
   * @param year to check
   * @return true
   */
  public static isLeapYear (year: number): boolean {
    if (year % 4 === 0) {
      if (year % 100 !== 0) {
        // leap year - divisible by 4 but not 100
        return true
      } else if (year % 400 === 0) {
        // leap year - divisible by 4 and 100 and 400
        return true
      } else {
        // common year - divisible by 4 and 100 but not 400!
        return false
      }
    } else {
      // common year
      return false
    }
  }

  /**
   * Transform the given date into an Universal Coordinated Time (UTC) date to
   * remove the side effects of daylight saving within date calculations.
   *
   * @param date to convert
   */
  public static dateToUTC (date: Date): Date {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
  }

  /**
   * Roll a date forward by the period implicit in the provided frequency.
   *
   * @param dateToRoll date to roll
   * @param frequency defining the time period to roll forward
   * @param dayPref preferred day of month of returned date
   */
  public static rollDate (
    dateToRoll: Date,
    frequency: Frequency,
    dayPref: number
  ): Date {
    switch (frequency) {
      case Frequency.Weekly:
        return DateUtils.rollDay(dateToRoll, 7)
      case Frequency.Fortnightly:
        return DateUtils.rollDay(dateToRoll, 14)
      case Frequency.Monthly:
        return DateUtils.rollMonth(dateToRoll, 1, dayPref)
      case Frequency.Quarterly:
        return DateUtils.rollMonth(dateToRoll, 3, dayPref)
      case Frequency.HalfYearly:
        return DateUtils.rollMonth(dateToRoll, 6, dayPref)
      case Frequency.Yearly:
        return DateUtils.rollMonth(dateToRoll, 12, dayPref)
      /* istanbul ignore next */
      default:
        return dateToRoll
    }
  }

  /**
   * Roll a date by the number of days specified.
   *
   * @param dateToRoll date to roll
   * @param numDays days to roll, may be positive (roll forward) or negative (roll backwards)
   */
  public static rollDay (dateToRoll: Date, numDays: number): Date {
    dateToRoll = this.dateToUTC(dateToRoll)
    dateToRoll.setUTCDate(dateToRoll.getUTCDate() + numDays)
    return this.dateToUTC(dateToRoll)
  }

  /**
   * Roll a date by the number of months specified.
   *
   * @param dateToRoll date to roll
   * @param numMonths months to roll, may be positive (roll forward) or negative (roll backwards)
   * @param dayPref (optional) preferred day of month of returned date
   */
  public static rollMonth (
    dateToRoll: Date,
    numMonths: number,
    dayPref?: number
  ): Date {
    dateToRoll = this.dateToUTC(dateToRoll)
    const currentDay: number = dateToRoll.getDate()
    const currentMonth: number = dateToRoll.getMonth()
    const currentYear: number = dateToRoll.getFullYear()

    // Calculate the new month
    let newMonth = (currentMonth + numMonths) % 12
    if (newMonth < 0) {
      newMonth += 12
    }

    // Calculate the new year
    let newYear = currentMonth + numMonths
    if (newYear < 0) {
      // Roll back
      if (Math.ceil(newYear % 12) !== 0) {
        newYear = Math.ceil(newYear / 12)
        newYear--
      } else {
        newYear = Math.ceil(newYear / 12)
      }
    } else {
      // Roll forward
      newYear = Math.floor(newYear / 12)
    }
    newYear = newYear + currentYear

    // Set the day of month
    if (dayPref === undefined || dayPref <= 0) {
      dayPref = currentDay
    }
    let newDay: number
    if (dayPref > DateUtils.DAYS_IN_MONTH[newMonth]) {
      if (this.isLeapYear(newYear) && newMonth === 1) {
        newDay = 29
      } else {
        newDay = DateUtils.DAYS_IN_MONTH[newMonth]
      }
    } else {
      newDay = dayPref
    }

    return new Date(Date.UTC(newYear, newMonth, newDay))
  }

  /** Milliseconds in a day = (1000 * 60 * 60 * 24) */
  private static readonly MS_IN_DAY = 86400000

  /** Number of days in each month starting January (non leap year) */
  private static readonly DAYS_IN_MONTH: number[] = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ]
}
