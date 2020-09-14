import paramCounts from '../util/paramsCount.js'

export default function(state) {
  let pathCommand = state.pathValue[state.segmentStart], 
      pathComLK = pathCommand.toLowerCase(), 
      params = state.data;

  // Process duplicated commands (without comand name)
  if (pathComLK === 'm' && params.length > 2) {
    state.segments.push([ pathCommand, params[0], params[1] ]);
    params = params.slice(2);
    pathComLK = 'l';
    pathCommand = (pathCommand === 'm') ? 'l' : 'L';
  }

  if (pathComLK === 'r') {
    state.segments.push([ pathCommand ].concat(params));
  } else {

    while (params.length >= paramCounts[pathComLK]) {
      state.segments.push([ pathCommand ].concat(params.splice(0, paramCounts[pathComLK])));
      if (!paramCounts[pathComLK]) {
        break;
      }
    }
  }
}