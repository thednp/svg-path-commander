import type { SpaceNumber } from "../types";

/**
 * Checks if the character is a space.
 *
 * @param ch the character to check
 * @returns check result
 */

const isSpace = (ch: number): ch is SpaceNumber => {
  const allSpaces = [
    // Special spaces
    0x1680,
    0x180e,
    0x2000,
    0x2001,
    0x2002,
    0x2003,
    0x2004,
    0x2005,
    0x2006,
    0x2007,
    0x2008,
    0x2009,
    0x200a,
    0x202f,
    0x205f,
    0x3000,
    0xfeff,
    // Line terminators
    0x0a,
    0x0d,
    0x2028,
    0x2029,
    // White spaces
    0x20,
    0x09,
    0x0b,
    0x0c,
    0xa0,
  ];

  return allSpaces.includes(ch);
};
export default isSpace;
