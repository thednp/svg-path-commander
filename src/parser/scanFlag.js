import error from './error';

/**
 * Validates an A (arc-to) specific path command value.
 * Usually a `large-arc-flag` or `sweep-flag`.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */
export default function scanFlag(path) {
  const { index, pathValue } = path;
  const code = pathValue.charCodeAt(index);

  if (code === 0x30/* 0 */) {
    path.param = 0;
    path.index += 1;
    return;
  }

  if (code === 0x31/* 1 */) {
    path.param = 1;
    path.index += 1;
    return;
  }

  path.err = `${error}: invalid Arc flag "${pathValue[index]}", expecting 0 or 1 at index ${index}`;
}
