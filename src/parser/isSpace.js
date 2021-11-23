/**
 * Checks if the character is a space.
 *
 * @param {string} code the character to check
 * @returns {boolean} check result
 */
export default function isSpace(code) {
  const specialSpaces = [
    0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
    0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF];
  // Line terminators
  return (code === 0x0A) || (code === 0x0D) || (code === 0x2028) || (code === 0x2029)
    // White spaces
    || (code === 0x20) || (code === 0x09) || (code === 0x0B) || (code === 0x0C) || (code === 0xA0)
    || (code >= 0x1680 && specialSpaces.indexOf(code) >= 0);
}
