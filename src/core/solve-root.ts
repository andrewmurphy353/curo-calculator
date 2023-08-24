import type Callback from './callback'

/**
 * Implementation of the function for finding unknown roots.
 *
 * This is an enhanced and more efficient implementation of the Newton-Raphson
 * method, first outlined by NC Shammas in 'Enhancing Newton's Method'
 * (Dr Dobbs Journal, June 2002).
 *
 * @author Andrew Murphy
 * @author Namir Clement Shammas
 */
export default class SolveRoot {
  /**
   * Solves for the unknown root using the Enhanced Newton-Raphson method.
   *
   * @param cb callback to a root function implementation
   * @param guess initial guess (optional)
   */
  public static solve (cb: Callback, guess = 0.1): number {
    let offset: number
    let f0: number
    let fp: number
    let fm: number
    let deriv1: number
    let deriv2: number
    let g0: number
    let g1: number
    let g2: number

    let countIter = 0
    do {
      offset = Math.abs(guess) > 1.0 ? 0.01 * guess : 0.01

      // Compute function values at x, x+offset, and x-offset
      f0 = cb.compute(guess)
      fp = cb.compute(guess + offset)
      fm = cb.compute(guess - offset)

      // Calculate first and second derivatives
      deriv1 = (fp - fm) / (2 * offset)
      deriv2 = (fp - 2 * f0 + fm) / (offset * offset)

      // Calculate 1st guess
      g0 = guess - f0 / deriv1

      // Calculate refinement of guess
      g1 = guess - f0 / (deriv1 + (deriv2 * (g0 - guess)) / 2)

      // Calculate guess update
      g2 = f0 / (deriv1 + (deriv2 * (g1 - guess)) / 2)
      guess -= g2
    } while (
      ++countIter < SolveRoot.MAX_ITER &&
      Math.abs(g2) > SolveRoot.TOLERANCE
    )

    if (countIter >= SolveRoot.MAX_ITER || isNaN(guess)) {
      throw new Error(
        `Unable to solve the ${cb.label()} within a maximum ${
        SolveRoot.MAX_ITER
        } attempts.`
      )
    }

    return guess
  }

  /**  The maximum number of iterations */
  private static readonly MAX_ITER = 50
  /**  The tolerance used to determine convergence */
  private static readonly TOLERANCE = 1.0e-7
}
