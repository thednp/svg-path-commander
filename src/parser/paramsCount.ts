/** Segment params length */

export const paramsCounts = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  r: 4,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0,
};

/**
 * The number of parameters of every command, by character code.
 *
 * The parser looks the number of the parameters of a command up for every
 * segment it scans, and the lookup by character code spares it the
 * lowercasing of the command and the lookup of the string.
 *
 * @internal
 */
export const paramsCountsByCode = new Uint8Array(128);

for (const [command, count] of Object.entries(paramsCounts)) {
  const code = command.charCodeAt(0);
  paramsCountsByCode[code] = count;
  // the uppercase command is the lowercase one, 32 characters higher
  paramsCountsByCode[code - 32] = count;
}
