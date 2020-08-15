import clonePath from '../util/clonePath.js'
import roundPath from '../util/roundPath.js'
// import setPathSpecs from '../util/setPathSpecs.js';

// Parses given path string into an array of arrays of path segments
export default function(pathString) {
  if (!pathString) {
    return null;
  }
  if( Array.isArray(pathString) ) {
    return clonePath(pathString);
  } else {
    // tracer minifier cannot compute this string for some reason
    // let spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
    let spaces = `\\${("x09|x0a|x0b|x0c|x0d|x20|xa0|u1680|u180e|u2000|u2001|u2002|u2003|u2004|u2005|u2006|u2007|u2008|u2009|u200a|u202f|u205f|u3000|u2028|u2029").split('|').join('\\')}`,
        pcReg = new RegExp(`([a-z])[${spaces},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${spaces}]*,?[${spaces}]*)+)`, `ig`),
        pathValues = new RegExp(`(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${spaces}]*,?[${spaces}]*`, `ig`),
        // pathBooleans = new RegExp(`(?<=[01${spaces}]+)([01])[${spaces}]*`, `g`),
        paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [],
        isClosed = 0;

    pathString.replace(pcReg, (a, b, c) => {
      let params = [], pathCommand = b.toLowerCase()
      
      c.replace(pathValues, (a, b) => b && params.push(b))
      params = params.filter(x=>x)

      if (pathCommand !== "a" && params.length < paramCounts[pathCommand]) {
        throw Error(`${pathCommand} path command requires ${paramCounts[pathCommand]} coordinates, only ${params.length + ' given: ['+params.join(',')}]`)
      }

      if (pathCommand === "m" && params.length > 2) {
        data.push([b].concat(params.splice(0, 2)));
        pathCommand = "l";
        b = b == "m" ? "l" : "L";
      }
      if (pathCommand === "o" && params.length === 1) {
        data.push([b, params[0]]);
      }
      if (pathCommand === "r") {
        data.push([b].concat(params));
      } 
      if (pathCommand === "z") {
        isClosed++
      } 
      // try and solve arcTo path command coordinates over-optimization
      // expected arcTo coordinates [rx ry xAxisRotation largeArcFlag sweepFlag dx dy]
      if ( pathCommand === 'a' && params.length < paramCounts[pathCommand]){
        for (let i=0, ln = params.length; i<ln; i++){
          if ( (i === 3 || i === 4) && params[i].length > 1 ) {
            params = params.slice(0,i) // first part of array
                          .concat(params[i][0]) // extract largeArcFlag OR sweepFlag
                          .concat( 
                              params[i].slice(1).replace(/(\-\d|\-\.\d|\.\d*(?=\.))/g,'|$1').split('|'), // separate sweepFlag from dx
                              params.slice(i+1)) // continue after flag
                          .filter(x=>x) // remove added empty "space" items
            ln = params.length // update length
          }
        }
        if (params.length === paramCounts[pathCommand]) {
          data.push([b].concat(params.splice(0, paramCounts[pathCommand])));
        }
      } else while (params.length >= paramCounts[pathCommand]) {
        data.push([b].concat(params.splice(0, paramCounts[pathCommand])));
        if (!paramCounts[pathCommand]) {
          break;
        }
      }
    });
    return roundPath(data)
  }
}