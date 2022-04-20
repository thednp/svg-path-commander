function cov_1ds2x370hr() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\skipSpaces.js";
  var hash = "8320d9cdd78c5094c83b95959e994e62b9757f10";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\skipSpaces.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 29
        },
        end: {
          line: 11,
          column: 33
        }
      },
      "1": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 14,
          column: 3
        }
      },
      "2": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 20
        }
      }
    },
    fnMap: {
      "0": {
        name: "skipSpaces",
        decl: {
          start: {
            line: 10,
            column: 24
          },
          end: {
            line: 10,
            column: 34
          }
        },
        loc: {
          start: {
            line: 10,
            column: 41
          },
          end: {
            line: 15,
            column: 1
          }
        },
        line: 10
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 12,
            column: 9
          },
          end: {
            line: 12,
            column: 70
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 12,
            column: 9
          },
          end: {
            line: 12,
            column: 25
          }
        }, {
          start: {
            line: 12,
            column: 29
          },
          end: {
            line: 12,
            column: 70
          }
        }],
        line: 12
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "8320d9cdd78c5094c83b95959e994e62b9757f10"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1ds2x370hr = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1ds2x370hr();
import isSpace from './isSpace';
/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */

export default function skipSpaces(path) {
  cov_1ds2x370hr().f[0]++;
  const {
    pathValue,
    max
  } = (cov_1ds2x370hr().s[0]++, path);
  cov_1ds2x370hr().s[1]++;

  while ((cov_1ds2x370hr().b[0][0]++, path.index < max) && (cov_1ds2x370hr().b[0][1]++, isSpace(pathValue.charCodeAt(path.index)))) {
    cov_1ds2x370hr().s[2]++;
    path.index += 1;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNraXBTcGFjZXMuanMiXSwibmFtZXMiOlsiaXNTcGFjZSIsInNraXBTcGFjZXMiLCJwYXRoIiwicGF0aFZhbHVlIiwibWF4IiwiaW5kZXgiLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxPQUFQLE1BQW9CLFdBQXBCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxVQUFULENBQW9CQyxJQUFwQixFQUEwQjtBQUFBO0FBQ3ZDLFFBQU07QUFBRUMsSUFBQUEsU0FBRjtBQUFhQyxJQUFBQTtBQUFiLGdDQUFxQkYsSUFBckIsQ0FBTjtBQUR1Qzs7QUFFdkMsU0FBTyw2QkFBQUEsSUFBSSxDQUFDRyxLQUFMLEdBQWFELEdBQWIsa0NBQW9CSixPQUFPLENBQUNHLFNBQVMsQ0FBQ0csVUFBVixDQUFxQkosSUFBSSxDQUFDRyxLQUExQixDQUFELENBQTNCLENBQVAsRUFBc0U7QUFBQTtBQUNwRUgsSUFBQUEsSUFBSSxDQUFDRyxLQUFMLElBQWMsQ0FBZDtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNTcGFjZSBmcm9tICcuL2lzU3BhY2UnO1xuXG4vKipcbiAqIFBvaW50cyB0aGUgcGFyc2VyIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpbiB0aGVcbiAqIHBhdGggc3RyaW5nIGV2ZXJ5IHRpbWUgaXQgZW5jb3VudGVycyBhbnkga2luZCBvZlxuICogc3BhY2UgY2hhcmFjdGVyLlxuICpcbiAqIEBwYXJhbSB7U1ZHUGF0aC5QYXRoUGFyc2VyfSBwYXRoIHRoZSBgUGF0aFBhcnNlcmAgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2tpcFNwYWNlcyhwYXRoKSB7XG4gIGNvbnN0IHsgcGF0aFZhbHVlLCBtYXggfSA9IHBhdGg7XG4gIHdoaWxlIChwYXRoLmluZGV4IDwgbWF4ICYmIGlzU3BhY2UocGF0aFZhbHVlLmNoYXJDb2RlQXQocGF0aC5pbmRleCkpKSB7XG4gICAgcGF0aC5pbmRleCArPSAxO1xuICB9XG59XG4iXX0=