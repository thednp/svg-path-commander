import paramCounts from './paramsCount.js'

export default function(state) {
  let cmd = state.pathValue[state.segmentStart], cmdLC = cmd.toLowerCase(), params = state.data;

  // Process duplicated commands (without comand name)
  if (cmdLC === 'm' && params.length > 2) {
    state.segments.push([ cmd, params[0], params[1] ]);
    params = params.slice(2);
    cmdLC = 'l';
    cmd = (cmd === 'm') ? 'l' : 'L';
  }

  if (cmdLC === 'r') {
    state.segments.push([ cmd ].concat(params));
  } else {

    while (params.length >= paramCounts[cmdLC]) {
      state.segments.push([ cmd ].concat(params.splice(0, paramCounts[cmdLC])));
      if (!paramCounts[cmdLC]) {
        break;
      }
    }
  }
}