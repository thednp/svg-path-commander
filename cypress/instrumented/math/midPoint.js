function cov_2njeevjswg() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\midPoint.js";
  var hash = "cfc8ee8077a69828c1e92667847cc211931ebebf";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\midPoint.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 19
        },
        end: {
          line: 11,
          column: 20
        }
      },
      "1": {
        start: {
          line: 11,
          column: 39
        },
        end: {
          line: 11,
          column: 40
        }
      },
      "2": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 50
        }
      }
    },
    fnMap: {
      "0": {
        name: "midPoint",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 32
          }
        },
        loc: {
          start: {
            line: 10,
            column: 42
          },
          end: {
            line: 13,
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
      "2": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "cfc8ee8077a69828c1e92667847cc211931ebebf"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2njeevjswg = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2njeevjswg();

/**
 * Returns the coordinates of a specified distance
 * ratio between two points.
 *
 * @param {[number, number]} a the first point coordinates
 * @param {[number, number]} b the second point coordinates
 * @param {number} t the ratio
 * @returns {[number, number]} the midpoint coordinates
 */
export default function midPoint(a, b, t) {
  cov_2njeevjswg().f[0]++;
  const [ax, ay] = (cov_2njeevjswg().s[0]++, a);
  const [bx, by] = (cov_2njeevjswg().s[1]++, b);
  cov_2njeevjswg().s[2]++;
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pZFBvaW50LmpzIl0sIm5hbWVzIjpbIm1pZFBvaW50IiwiYSIsImIiLCJ0IiwiYXgiLCJheSIsImJ4IiwiYnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7Ozs7QUFmWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVNBLFFBQVQsQ0FBa0JDLENBQWxCLEVBQXFCQyxDQUFyQixFQUF3QkMsQ0FBeEIsRUFBMkI7QUFBQTtBQUN4QyxRQUFNLENBQUNDLEVBQUQsRUFBS0MsRUFBTCw4QkFBV0osQ0FBWCxDQUFOO0FBQW9CLFFBQU0sQ0FBQ0ssRUFBRCxFQUFLQyxFQUFMLDhCQUFXTCxDQUFYLENBQU47QUFEb0I7QUFFeEMsU0FBTyxDQUFDRSxFQUFFLEdBQUcsQ0FBQ0UsRUFBRSxHQUFHRixFQUFOLElBQVlELENBQWxCLEVBQXFCRSxFQUFFLEdBQUcsQ0FBQ0UsRUFBRSxHQUFHRixFQUFOLElBQVlGLENBQXRDLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJucyB0aGUgY29vcmRpbmF0ZXMgb2YgYSBzcGVjaWZpZWQgZGlzdGFuY2VcbiAqIHJhdGlvIGJldHdlZW4gdHdvIHBvaW50cy5cbiAqXG4gKiBAcGFyYW0ge1tudW1iZXIsIG51bWJlcl19IGEgdGhlIGZpcnN0IHBvaW50IGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge1tudW1iZXIsIG51bWJlcl19IGIgdGhlIHNlY29uZCBwb2ludCBjb29yZGluYXRlc1xuICogQHBhcmFtIHtudW1iZXJ9IHQgdGhlIHJhdGlvXG4gKiBAcmV0dXJucyB7W251bWJlciwgbnVtYmVyXX0gdGhlIG1pZHBvaW50IGNvb3JkaW5hdGVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1pZFBvaW50KGEsIGIsIHQpIHtcbiAgY29uc3QgW2F4LCBheV0gPSBhOyBjb25zdCBbYngsIGJ5XSA9IGI7XG4gIHJldHVybiBbYXggKyAoYnggLSBheCkgKiB0LCBheSArIChieSAtIGF5KSAqIHRdO1xufVxuIl19