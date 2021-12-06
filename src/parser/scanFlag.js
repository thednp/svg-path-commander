import invalidPathValue from './invalidPathValue';

/**
 * Validates an A (arc-to) specific path command value.
 * Usually a `large-arc-flag` or `sweep-flag`.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
export default function scanFlag(path) {
  const { index } = path;
  const ch = path.pathValue.charCodeAt(index);

  if (ch === 0x30/* 0 */) {
    path.param = 0;
    path.index += 1;
    return;
  }

  if (ch === 0x31/* 1 */) {
    path.param = 1;
    path.index += 1;
    return;
  }

  path.err = `${invalidPathValue}: invalid Arc flag "${ch}", expecting 0 or 1 at index ${index}`;
}
