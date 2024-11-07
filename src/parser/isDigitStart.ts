import isDigit from "./isDigit";
import type { DigitNumber } from "../types";

/**
 * Checks if the character is or belongs to a number.
 * [0-9]|+|-|.
 *
 * @param code the character to check
 * @returns check result
 */
const isDigitStart = (
  code: number,
): code is DigitNumber | 0x2b | 0x2d | 0x2e => {
  return isDigit(code) /* 0..9 */ || code === 0x2b /* + */ ||
    code === 0x2d /* - */ || code === 0x2e; /* . */
};
export default isDigitStart;
