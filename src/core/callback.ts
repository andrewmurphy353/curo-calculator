/**
 * Defines the callback contract for concrete function implementations
 *
 * @author Andrew Murphy
 */
export default interface Callback {
  /**
   * Label providing context for errors
   */
  label: () => string
  /**
   * The callback function to implement
   * @param guess
   */
  compute: (guess: number) => number
}
