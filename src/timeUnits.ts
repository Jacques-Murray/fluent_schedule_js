/**
 * Converts seconds to milliseconds.
 * @example seconds(5) // 5000
 */
export function seconds(n: number): number {
  return n * 1000;
}

/**
 * Converts minutes to milliseconds.
 * @example minutes(2) // 120000
 */
export function minutes(n: number): number {
  return n * 60 * 1000;
}

/**
 * Converts hours to milliseconds.
 * @example hours(1) // 3600000
 */
export function hours(n: number): number {
  return n * 60 * 60 * 1000;
}