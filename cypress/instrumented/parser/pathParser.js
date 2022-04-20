function cov_1lwakii2vy() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\pathParser.js";
  var hash = "9dbac207bdcb8bcb4c3ed377330ff68e8f9ccc48";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\pathParser.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 10,
          column: 21
        }
      },
      "1": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 30
        }
      },
      "2": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 14,
          column: 31
        }
      },
      "3": {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 16,
          column: 17
        }
      },
      "4": {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 18,
          column: 19
        }
      },
      "5": {
        start: {
          line: 20,
          column: 2
        },
        end: {
          line: 20,
          column: 24
        }
      },
      "6": {
        start: {
          line: 22,
          column: 2
        },
        end: {
          line: 22,
          column: 17
        }
      },
      "7": {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 24,
          column: 16
        }
      }
    },
    fnMap: {
      "0": {
        name: "PathParser",
        decl: {
          start: {
            line: 7,
            column: 24
          },
          end: {
            line: 7,
            column: 34
          }
        },
        loc: {
          start: {
            line: 7,
            column: 47
          },
          end: {
            line: 25,
            column: 1
          }
        },
        line: 7
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
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "9dbac207bdcb8bcb4c3ed377330ff68e8f9ccc48"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1lwakii2vy = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1lwakii2vy();

/**
 * The `PathParser` is used by the `parsePathString` static method
 * to generate a `pathArray`.
 *
 * @param {string} pathString
 */
export default function PathParser(pathString) {
  cov_1lwakii2vy().f[0]++;
  cov_1lwakii2vy().s[0]++;

  /** @type {SVGPath.pathArray} */
  // @ts-ignore
  this.segments = [];
  /** @type {string} */

  cov_1lwakii2vy().s[1]++;
  this.pathValue = pathString;
  /** @type {number} */

  cov_1lwakii2vy().s[2]++;
  this.max = pathString.length;
  /** @type {number} */

  cov_1lwakii2vy().s[3]++;
  this.index = 0;
  /** @type {number} */

  cov_1lwakii2vy().s[4]++;
  this.param = 0.0;
  /** @type {number} */

  cov_1lwakii2vy().s[5]++;
  this.segmentStart = 0;
  /** @type {any} */

  cov_1lwakii2vy().s[6]++;
  this.data = [];
  /** @type {string} */

  cov_1lwakii2vy().s[7]++;
  this.err = '';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhdGhQYXJzZXIuanMiXSwibmFtZXMiOlsiUGF0aFBhcnNlciIsInBhdGhTdHJpbmciLCJzZWdtZW50cyIsInBhdGhWYWx1ZSIsIm1heCIsImxlbmd0aCIsImluZGV4IiwicGFyYW0iLCJzZWdtZW50U3RhcnQiLCJkYXRhIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsVUFBVCxDQUFvQkMsVUFBcEIsRUFBZ0M7QUFBQTtBQUFBOztBQUM3QztBQUNBO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBOztBQUo2QztBQUs3QyxPQUFLQyxTQUFMLEdBQWlCRixVQUFqQjtBQUNBOztBQU42QztBQU83QyxPQUFLRyxHQUFMLEdBQVdILFVBQVUsQ0FBQ0ksTUFBdEI7QUFDQTs7QUFSNkM7QUFTN0MsT0FBS0MsS0FBTCxHQUFhLENBQWI7QUFDQTs7QUFWNkM7QUFXN0MsT0FBS0MsS0FBTCxHQUFhLEdBQWI7QUFDQTs7QUFaNkM7QUFhN0MsT0FBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNBOztBQWQ2QztBQWU3QyxPQUFLQyxJQUFMLEdBQVksRUFBWjtBQUNBOztBQWhCNkM7QUFpQjdDLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBgUGF0aFBhcnNlcmAgaXMgdXNlZCBieSB0aGUgYHBhcnNlUGF0aFN0cmluZ2Agc3RhdGljIG1ldGhvZFxuICogdG8gZ2VuZXJhdGUgYSBgcGF0aEFycmF5YC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFN0cmluZ1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXRoUGFyc2VyKHBhdGhTdHJpbmcpIHtcbiAgLyoqIEB0eXBlIHtTVkdQYXRoLnBhdGhBcnJheX0gKi9cbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLnNlZ21lbnRzID0gW107XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICB0aGlzLnBhdGhWYWx1ZSA9IHBhdGhTdHJpbmc7XG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICB0aGlzLm1heCA9IHBhdGhTdHJpbmcubGVuZ3RoO1xuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgdGhpcy5pbmRleCA9IDA7XG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICB0aGlzLnBhcmFtID0gMC4wO1xuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgdGhpcy5zZWdtZW50U3RhcnQgPSAwO1xuICAvKiogQHR5cGUge2FueX0gKi9cbiAgdGhpcy5kYXRhID0gW107XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICB0aGlzLmVyciA9ICcnO1xufVxuIl19