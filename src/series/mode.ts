/**
 * Mode determines whether a cash flow occurs at the start or end of the compounding period
 * demarcated by cash flow frequency. The options are:
 * 
 * * Advance - cash flows due at the beginning of a compounding period
 * * Arrear - cash flows due at the end of a compounding period
 */
export enum Mode {
  Advance = "Advance",
  Arrear = "Arrear"
}
