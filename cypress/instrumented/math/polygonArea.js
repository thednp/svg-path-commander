function cov_2gvdtvro5e() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\polygonArea.js";
  var hash = "b40ff49289d80c2cad38696dfa5f7e2de10ee120";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\polygonArea.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 12
        },
        end: {
          line: 11,
          column: 26
        }
      },
      "1": {
        start: {
          line: 12,
          column: 10
        },
        end: {
          line: 12,
          column: 12
        }
      },
      "2": {
        start: {
          line: 14,
          column: 10
        },
        end: {
          line: 14,
          column: 24
        }
      },
      "3": {
        start: {
          line: 15,
          column: 13
        },
        end: {
          line: 15,
          column: 14
        }
      },
      "4": {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 22,
          column: 3
        }
      },
      "5": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 19,
          column: 10
        }
      },
      "6": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 19
        }
      },
      "7": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 38
        }
      },
      "8": {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 24,
          column: 18
        }
      }
    },
    fnMap: {
      "0": {
        name: "polygonArea",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 35
          }
        },
        loc: {
          start: {
            line: 10,
            column: 45
          },
          end: {
            line: 25,
            column: 1
          }
        },
        line: 10
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "b40ff49289d80c2cad38696dfa5f7e2de10ee120"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2gvdtvro5e = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2gvdtvro5e();

/**
 * d3-polygon-area
 * https://github.com/d3/d3-polygon
 *
 * Returns the area of a polygon.
 *
 * @param {number[][]} polygon an array of coordinates
 * @returns {number} the polygon area
 */
export default function polygonArea(polygon) {
  cov_2gvdtvro5e().f[0]++;
  const n = (cov_2gvdtvro5e().s[0]++, polygon.length);
  let i = (cov_2gvdtvro5e().s[1]++, -1);
  let a;
  let b = (cov_2gvdtvro5e().s[2]++, polygon[n - 1]);
  let area = (cov_2gvdtvro5e().s[3]++, 0);
  /* eslint-disable-next-line */

  cov_2gvdtvro5e().s[4]++;

  while (++i < n) {
    cov_2gvdtvro5e().s[5]++;
    a = b;
    cov_2gvdtvro5e().s[6]++;
    b = polygon[i];
    cov_2gvdtvro5e().s[7]++;
    area += a[1] * b[0] - a[0] * b[1];
  }

  cov_2gvdtvro5e().s[8]++;
  return area / 2;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvbHlnb25BcmVhLmpzIl0sIm5hbWVzIjpbInBvbHlnb25BcmVhIiwicG9seWdvbiIsIm4iLCJsZW5ndGgiLCJpIiwiYSIsImIiLCJhcmVhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7O0FBZlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTQSxXQUFULENBQXFCQyxPQUFyQixFQUE4QjtBQUFBO0FBQzNDLFFBQU1DLENBQUMsNkJBQUdELE9BQU8sQ0FBQ0UsTUFBWCxDQUFQO0FBQ0EsTUFBSUMsQ0FBQyw2QkFBRyxDQUFDLENBQUosQ0FBTDtBQUNBLE1BQUlDLENBQUo7QUFDQSxNQUFJQyxDQUFDLDZCQUFHTCxPQUFPLENBQUNDLENBQUMsR0FBRyxDQUFMLENBQVYsQ0FBTDtBQUNBLE1BQUlLLElBQUksNkJBQUcsQ0FBSCxDQUFSO0FBRUE7O0FBUDJDOztBQVEzQyxTQUFPLEVBQUVILENBQUYsR0FBTUYsQ0FBYixFQUFnQjtBQUFBO0FBQ2RHLElBQUFBLENBQUMsR0FBR0MsQ0FBSjtBQURjO0FBRWRBLElBQUFBLENBQUMsR0FBR0wsT0FBTyxDQUFDRyxDQUFELENBQVg7QUFGYztBQUdkRyxJQUFBQSxJQUFJLElBQUlGLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT0MsQ0FBQyxDQUFDLENBQUQsQ0FBUixHQUFjRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9DLENBQUMsQ0FBQyxDQUFELENBQTlCO0FBQ0Q7O0FBWjBDO0FBYzNDLFNBQU9DLElBQUksR0FBRyxDQUFkO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGQzLXBvbHlnb24tYXJlYVxuICogaHR0cHM6Ly9naXRodWIuY29tL2QzL2QzLXBvbHlnb25cbiAqXG4gKiBSZXR1cm5zIHRoZSBhcmVhIG9mIGEgcG9seWdvbi5cbiAqXG4gKiBAcGFyYW0ge251bWJlcltdW119IHBvbHlnb24gYW4gYXJyYXkgb2YgY29vcmRpbmF0ZXNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBwb2x5Z29uIGFyZWFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcG9seWdvbkFyZWEocG9seWdvbikge1xuICBjb25zdCBuID0gcG9seWdvbi5sZW5ndGg7XG4gIGxldCBpID0gLTE7XG4gIGxldCBhO1xuICBsZXQgYiA9IHBvbHlnb25bbiAtIDFdO1xuICBsZXQgYXJlYSA9IDA7XG5cbiAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4gIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgYSA9IGI7XG4gICAgYiA9IHBvbHlnb25baV07XG4gICAgYXJlYSArPSBhWzFdICogYlswXSAtIGFbMF0gKiBiWzFdO1xuICB9XG5cbiAgcmV0dXJuIGFyZWEgLyAyO1xufVxuIl19