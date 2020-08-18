import parsePathString from '../process/parsePathString.js'
import catmullRom2bezier from '../util/catmullRom2bezier.js'
import ellipsePath from '../util/ellipsePath.js'
import roundPath from '../util/roundPath.js'

export default function(pathArray) {
  pathArray = parsePathString(pathArray)

  if (!pathArray || !pathArray.length) {
    return [["M", 0, 0]];
  }

  let resultArray = [], 
      x = 0, y = 0, mx = 0, my = 0, 
      start = 0, ii = pathArray.length,
      crz = pathArray.length === 3 &&
            pathArray[0][0] === "M" &&
            pathArray[1][0].toUpperCase() === "R" &&
            pathArray[2][0].toUpperCase() === "Z";

  if (pathArray[0][0] === "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    resultArray[0] = ["M", x, y];
  }

  for (let i = start; i < ii; i++) {
    let r = [], pa = pathArray[i], pa0 = pa[0], dots = [];
    resultArray.push(r = []);

    if (pa0 !== pa0.toUpperCase()) {
      r[0] = pa0.toUpperCase();
      switch (r[0]) {
        case "A":
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] + x;
          r[7] = +pa[7] + y;
          break;
        case "V":
          r[1] = +pa[1] + y;
          break;
        case "H":
          r[1] = +pa[1] + x;
          break;
        case "R":
          dots = [x, y].concat(pa.slice(1));
          for (let j = 2, jj = dots.length; j < jj; j++) {
            dots[j] = +dots[j] + x;
            dots[++j] = +dots[j] + y;
          }
          resultArray.pop();
          resultArray = resultArray.concat(catmullRom2bezier(dots, crz));
          break;
        case "O":
          resultArray.pop();
          dots = ellipsePath(x, y, +pa[1], +pa[2]);
          dots.push(dots[0]);
          resultArray = resultArray.concat(dots);
          break;
        case "U":
          resultArray.pop();
          resultArray = resultArray.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
          r = ["U"].concat(resultArray[resultArray.length - 1].slice(-2));
          break;
        case "M":
          mx = +pa[1] + x;
          my = +pa[2] + y;
        default:
          for (let k = 1, kk = pa.length; k < kk; k++) {
            r[k] = +pa[k] + ((k % 2) ? x : y);
          }
      }
    } else if (pa0 === "R") {
      dots = [x, y].concat(pa.slice(1));
      resultArray.pop();
      resultArray = resultArray.concat(catmullRom2bezier(dots, crz));
      r = ["R"].concat(pa.slice(-2));
    } else if (pa0 === "O") {
      resultArray.pop();
      dots = ellipsePath(x, y, +pa[1], +pa[2]);
      dots.push(dots[0]);
      resultArray = resultArray.concat(dots);
    } else if (pa0 === "U") {
      resultArray.pop();
      resultArray = resultArray.concat(ellipsePath(x, y, +pa[1], +pa[2], +pa[3]));
      r = ["U"].concat(resultArray[resultArray.length - 1].slice(-2));
    } else {
      pa.map(k=>r.push(k))
    }
    pa0 = pa0.toUpperCase();
    if (pa0 !== "O") {
      switch (r[0]) {
        case "Z":
          x = mx;
          y = my;
          break;
        case "H":
          x = +r[1];
          break;
        case "V":
          y = +r[1];
          break;
        case "M":
          mx = +r[r.length - 2];
          my = +r[r.length - 1];
        default:
          x = +r[r.length - 2];
          y = +r[r.length - 1];
      }
    }
  }
  return roundPath(resultArray)
}