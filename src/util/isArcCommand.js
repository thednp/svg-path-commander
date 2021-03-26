export default function isArcCommand(code) {
  // eslint disable no-bitwise
  return (code | 0x20) === 0x61;
}
