function cov_193fmcuzny() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\quadToCubic.js";
  var hash = "1c430fe1f54db8c9fde5a76454036661ee9e86df";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\quadToCubic.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 14
        },
        end: {
          line: 13,
          column: 19
        }
      },
      "1": {
        start: {
          line: 14,
          column: 14
        },
        end: {
          line: 14,
          column: 19
        }
      },
      "2": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 21,
          column: 4
        }
      }
    },
    fnMap: {
      "0": {
        name: "quadToCubic",
        decl: {
          start: {
            line: 12,
            column: 24
          },
          end: {
            line: 12,
            column: 35
          }
        },
        loc: {
          start: {
            line: 12,
            column: 60
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 12
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "1c430fe1f54db8c9fde5a76454036661ee9e86df"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_193fmcuzny = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_193fmcuzny();

/**
 * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} qx control point x
 * @param {number} qy control point y
 * @param {number} x2 curve end x
 * @param {number} y2 curve end y
 * @returns {number[]} the cubic-bezier segment
 */
export default function quadToCubic(x1, y1, qx, qy, x2, y2) {
  cov_193fmcuzny().f[0]++;
  const r13 = (cov_193fmcuzny().s[0]++, 1 / 3);
  const r23 = (cov_193fmcuzny().s[1]++, 2 / 3);
  cov_193fmcuzny().s[2]++;
  return [r13 * x1 + r23 * qx, // cpx1
  r13 * y1 + r23 * qy, // cpy1
  r13 * x2 + r23 * qx, // cpx2
  r13 * y2 + r23 * qy, // cpy2
  x2, y2 // x,y
  ];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1YWRUb0N1YmljLmpzIl0sIm5hbWVzIjpbInF1YWRUb0N1YmljIiwieDEiLCJ5MSIsInF4IiwicXkiLCJ4MiIsInkyIiwicjEzIiwicjIzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7O0FBZlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsV0FBVCxDQUFxQkMsRUFBckIsRUFBeUJDLEVBQXpCLEVBQTZCQyxFQUE3QixFQUFpQ0MsRUFBakMsRUFBcUNDLEVBQXJDLEVBQXlDQyxFQUF6QyxFQUE2QztBQUFBO0FBQzFELFFBQU1DLEdBQUcsNkJBQUcsSUFBSSxDQUFQLENBQVQ7QUFDQSxRQUFNQyxHQUFHLDZCQUFHLElBQUksQ0FBUCxDQUFUO0FBRjBEO0FBRzFELFNBQU8sQ0FDTEQsR0FBRyxHQUFHTixFQUFOLEdBQVdPLEdBQUcsR0FBR0wsRUFEWixFQUNnQjtBQUNyQkksRUFBQUEsR0FBRyxHQUFHTCxFQUFOLEdBQVdNLEdBQUcsR0FBR0osRUFGWixFQUVnQjtBQUNyQkcsRUFBQUEsR0FBRyxHQUFHRixFQUFOLEdBQVdHLEdBQUcsR0FBR0wsRUFIWixFQUdnQjtBQUNyQkksRUFBQUEsR0FBRyxHQUFHRCxFQUFOLEdBQVdFLEdBQUcsR0FBR0osRUFKWixFQUlnQjtBQUNyQkMsRUFBQUEsRUFMSyxFQUtEQyxFQUxDLENBS0c7QUFMSCxHQUFQO0FBT0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnZlcnRzIGEgUSAocXVhZHJhdGljLWJlemllcikgc2VnbWVudCB0byBDIChjdWJpYy1iZXppZXIpLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSBjdXJ2ZSBzdGFydCB4XG4gKiBAcGFyYW0ge251bWJlcn0geTEgY3VydmUgc3RhcnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IHF4IGNvbnRyb2wgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IHF5IGNvbnRyb2wgcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IHgyIGN1cnZlIGVuZCB4XG4gKiBAcGFyYW0ge251bWJlcn0geTIgY3VydmUgZW5kIHlcbiAqIEByZXR1cm5zIHtudW1iZXJbXX0gdGhlIGN1YmljLWJlemllciBzZWdtZW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHF1YWRUb0N1YmljKHgxLCB5MSwgcXgsIHF5LCB4MiwgeTIpIHtcbiAgY29uc3QgcjEzID0gMSAvIDM7XG4gIGNvbnN0IHIyMyA9IDIgLyAzO1xuICByZXR1cm4gW1xuICAgIHIxMyAqIHgxICsgcjIzICogcXgsIC8vIGNweDFcbiAgICByMTMgKiB5MSArIHIyMyAqIHF5LCAvLyBjcHkxXG4gICAgcjEzICogeDIgKyByMjMgKiBxeCwgLy8gY3B4MlxuICAgIHIxMyAqIHkyICsgcjIzICogcXksIC8vIGNweTJcbiAgICB4MiwgeTIsIC8vIHgseVxuICBdO1xufVxuIl19