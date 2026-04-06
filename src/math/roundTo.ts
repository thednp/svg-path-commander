/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param n - The number to round
 * @param round - Number of decimal places
 * @returns The rounded number
 */
export const roundTo = (n: number, round: number) => {
  const pow = round >= 1 ? 10 ** round : 1;

  return round > 0 ? Math.round(n * pow) / pow : Math.round(n);
};
