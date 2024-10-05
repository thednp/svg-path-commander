/**
 * Checks if the character is a MoveTo command.
 *
 * @param code the character to check
 * @returns check result
 */
const isMoveCommand = (code: number): code is 0x6d | 0x4d => {
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  switch (code | 0x20) {
    case 0x6d /* m */:
    case 0x4d /* M */:
      return true;
    default:
      return false;
  }
};
export default isMoveCommand;
