export default function isArcCommand(code) {
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  return (code | 0x20) === 0x61;
}
