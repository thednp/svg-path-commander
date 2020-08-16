import parsePathString from '../process/parsePathString.js'
import roundPath from '../util/roundPath.js'

export default function (pathArray) {
  pathArray = parsePathString(pathArray)

  let res = [], x = 0, y = 0, mx = 0, my = 0, start = 0, ii = pathArray.length;

  if (pathArray[0][0] === "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    res.push(["M", x, y]);
  }

  for (let i = start; i < ii; i++) {
    let r, pa = pathArray[i];
    res.push(r = []);

    if (pa[0] !== pa[0].toLowerCase() ) {
      r[0] = pa[0].toLowerCase();
      switch (r[0]) {
        case "a":
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] - x;
          r[7] = +pa[7] - y
          break;
        case "v":
          r[1] = +pa[1] - y;
          break;
        case "m":
          mx = +pa[1];
          my = +pa[2];
        default:
          for (let j = 1, jj = pa.length; j < jj; j++) {
            r[j] = +pa[j] - ((j % 2) ? x : y)
          }
      }
    } else {
      r = [];
      res[i] = r;
      if (pa[0] === "m") {
        mx = +pa[1] + x;
        my = +pa[2] + y;
      }
      pa.map(k=>res[i].push(k))
    }
    let len = res[i].length;
    switch (res[i][0]) {
      case "z":
        x = mx;
        y = my;
        break;
      case "h":
        x += res[i][len - 1];
        break;
      case "v":
        y += res[i][len - 1];
        break;
      default:
        x += res[i][len - 2];
        y += res[i][len - 1];
    }
  }
  return roundPath(res,path.isClosed)
}