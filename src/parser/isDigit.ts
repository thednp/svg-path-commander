import { DigitNumber } from "../types";

/**
 * Checks if a character is a digit.
 *
 * @param code the character to check
 * @returns check result
 */
const isDigit = (code: number): code is DigitNumber => {
  return code >= 48 && code <= 57; // 0..9
};
export default isDigit;
