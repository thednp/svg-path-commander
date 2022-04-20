function cov_2ei45iob4p() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\rotateVector.js";
  var hash = "6427a6c5f217f6541ccbc6d9108756517f3a5041";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\math\\rotateVector.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 12
        },
        end: {
          line: 11,
          column: 49
        }
      },
      "1": {
        start: {
          line: 12,
          column: 12
        },
        end: {
          line: 12,
          column: 49
        }
      },
      "2": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 13,
          column: 24
        }
      }
    },
    fnMap: {
      "0": {
        name: "rotateVector",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 36
          }
        },
        loc: {
          start: {
            line: 10,
            column: 48
          },
          end: {
            line: 14,
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
    hash: "6427a6c5f217f6541ccbc6d9108756517f3a5041"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2ei45iob4p = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2ei45iob4p();

/**
 * Returns an {x,y} vector rotated by a given
 * angle in radian.
 *
 * @param {number} x the initial vector x
 * @param {number} y the initial vector y
 * @param {number} rad the radian vector angle
 * @returns {{x: number, y: number}} the rotated vector
 */
export default function rotateVector(x, y, rad) {
  cov_2ei45iob4p().f[0]++;
  const X = (cov_2ei45iob4p().s[0]++, x * Math.cos(rad) - y * Math.sin(rad));
  const Y = (cov_2ei45iob4p().s[1]++, x * Math.sin(rad) + y * Math.cos(rad));
  cov_2ei45iob4p().s[2]++;
  return {
    x: X,
    y: Y
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvdGF0ZVZlY3Rvci5qcyJdLCJuYW1lcyI6WyJyb3RhdGVWZWN0b3IiLCJ4IiwieSIsInJhZCIsIlgiLCJNYXRoIiwiY29zIiwic2luIiwiWSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsWUFBVCxDQUFzQkMsQ0FBdEIsRUFBeUJDLENBQXpCLEVBQTRCQyxHQUE1QixFQUFpQztBQUFBO0FBQzlDLFFBQU1DLENBQUMsNkJBQUdILENBQUMsR0FBR0ksSUFBSSxDQUFDQyxHQUFMLENBQVNILEdBQVQsQ0FBSixHQUFvQkQsQ0FBQyxHQUFHRyxJQUFJLENBQUNFLEdBQUwsQ0FBU0osR0FBVCxDQUEzQixDQUFQO0FBQ0EsUUFBTUssQ0FBQyw2QkFBR1AsQ0FBQyxHQUFHSSxJQUFJLENBQUNFLEdBQUwsQ0FBU0osR0FBVCxDQUFKLEdBQW9CRCxDQUFDLEdBQUdHLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxHQUFULENBQTNCLENBQVA7QUFGOEM7QUFHOUMsU0FBTztBQUFFRixJQUFBQSxDQUFDLEVBQUVHLENBQUw7QUFBUUYsSUFBQUEsQ0FBQyxFQUFFTTtBQUFYLEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJucyBhbiB7eCx5fSB2ZWN0b3Igcm90YXRlZCBieSBhIGdpdmVuXG4gKiBhbmdsZSBpbiByYWRpYW4uXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHggdGhlIGluaXRpYWwgdmVjdG9yIHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5IHRoZSBpbml0aWFsIHZlY3RvciB5XG4gKiBAcGFyYW0ge251bWJlcn0gcmFkIHRoZSByYWRpYW4gdmVjdG9yIGFuZ2xlXG4gKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gdGhlIHJvdGF0ZWQgdmVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJvdGF0ZVZlY3Rvcih4LCB5LCByYWQpIHtcbiAgY29uc3QgWCA9IHggKiBNYXRoLmNvcyhyYWQpIC0geSAqIE1hdGguc2luKHJhZCk7XG4gIGNvbnN0IFkgPSB4ICogTWF0aC5zaW4ocmFkKSArIHkgKiBNYXRoLmNvcyhyYWQpO1xuICByZXR1cm4geyB4OiBYLCB5OiBZIH07XG59XG4iXX0=