/**
 * Checks if a character is a digit.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
export default function isDigit(code) {
  return (code >= 48 && code <= 57); // 0..9
}
