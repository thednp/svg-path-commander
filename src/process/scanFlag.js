import invalidPathValue from '../util/invalidPathValue.js';

export default function scanFlag(state) {
  const ch = state.pathValue.charCodeAt(state.index);

  if (ch === 0x30/* 0 */) {
    state.param = 0;
    state.index += 1;
    return;
  }

  if (ch === 0x31/* 1 */) {
    state.param = 1;
    state.index += 1;
    return;
  }

  // state.err = 'SvgPath: arc flag can be 0 or 1 only (at pos ' + state.index + ')';
  state.err = `${invalidPathValue}: invalid Arc flag ${ch}`;
}
