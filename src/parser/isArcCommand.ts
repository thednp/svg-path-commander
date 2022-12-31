/**
 * Checks if the character is an A (arc-to) path command.
 *
 * @param code the character to check
 * @returns check result
 */
const isArcCommand = (code: number): code is 0x61 => {
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  return (code | 0x20) === 0x61;
};
export default isArcCommand;
