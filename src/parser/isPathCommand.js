/**
 * Checks if the character is a path command.
 *
 * @param {any} code the character to check
 * @returns {boolean} check result
 */
export default function isPathCommand(code) {
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  switch (code | 0x20) {
    case 0x6D/* m */:
    case 0x7A/* z */:
    case 0x6C/* l */:
    case 0x68/* h */:
    case 0x76/* v */:
    case 0x63/* c */:
    case 0x73/* s */:
    case 0x71/* q */:
    case 0x74/* t */:
    case 0x61/* a */:
    // case 0x72/* r */:
      return true;
    default:
      return false;
  }
}
