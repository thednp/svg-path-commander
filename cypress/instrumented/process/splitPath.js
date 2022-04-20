function cov_oj64w4m1k() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\splitPath.js";
  var hash = "bb86aaf7971b5ab1dabc148956a01c1e75a98013";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\splitPath.js",
    statementMap: {
      "0": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 18,
          column: 22
        }
      },
      "1": {
        start: {
          line: 17,
          column: 16
        },
        end: {
          line: 17,
          column: 24
        }
      },
      "2": {
        start: {
          line: 18,
          column: 19
        },
        end: {
          line: 18,
          column: 20
        }
      }
    },
    fnMap: {
      "0": {
        name: "splitPath",
        decl: {
          start: {
            line: 13,
            column: 24
          },
          end: {
            line: 13,
            column: 33
          }
        },
        loc: {
          start: {
            line: 13,
            column: 45
          },
          end: {
            line: 19,
            column: 1
          }
        },
        line: 13
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 17,
            column: 9
          },
          end: {
            line: 17,
            column: 10
          }
        },
        loc: {
          start: {
            line: 17,
            column: 16
          },
          end: {
            line: 17,
            column: 24
          }
        },
        line: 17
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 18,
            column: 12
          },
          end: {
            line: 18,
            column: 13
          }
        },
        loc: {
          start: {
            line: 18,
            column: 19
          },
          end: {
            line: 18,
            column: 20
          }
        },
        line: 18
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "bb86aaf7971b5ab1dabc148956a01c1e75a98013"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_oj64w4m1k = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_oj64w4m1k();
import pathToString from '../convert/pathToString';
import pathToAbsolute from '../convert/pathToAbsolute';
/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param {SVGPath.pathArray | string} pathInput the source `pathArray`
 * @return {string[]} an array with all sub-path strings
 */

export default function splitPath(pathInput) {
  cov_oj64w4m1k().f[0]++;
  cov_oj64w4m1k().s[0]++;
  return pathToString(pathToAbsolute(pathInput), 0).replace(/(m|M)/g, '|$1').split('|').map(s => {
    cov_oj64w4m1k().f[1]++;
    cov_oj64w4m1k().s[1]++;
    return s.trim();
  }).filter(s => {
    cov_oj64w4m1k().f[2]++;
    cov_oj64w4m1k().s[2]++;
    return s;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwbGl0UGF0aC5qcyJdLCJuYW1lcyI6WyJwYXRoVG9TdHJpbmciLCJwYXRoVG9BYnNvbHV0ZSIsInNwbGl0UGF0aCIsInBhdGhJbnB1dCIsInJlcGxhY2UiLCJzcGxpdCIsIm1hcCIsInMiLCJ0cmltIiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFlBQVAsTUFBeUIseUJBQXpCO0FBQ0EsT0FBT0MsY0FBUCxNQUEyQiwyQkFBM0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxTQUFULENBQW1CQyxTQUFuQixFQUE4QjtBQUFBO0FBQUE7QUFDM0MsU0FBT0gsWUFBWSxDQUFDQyxjQUFjLENBQUNFLFNBQUQsQ0FBZixFQUE0QixDQUE1QixDQUFaLENBQ0pDLE9BREksQ0FDSSxRQURKLEVBQ2MsS0FEZCxFQUVKQyxLQUZJLENBRUUsR0FGRixFQUdKQyxHQUhJLENBR0NDLENBQUQsSUFBTztBQUFBO0FBQUE7QUFBQSxXQUFBQSxDQUFDLENBQUNDLElBQUY7QUFBUSxHQUhmLEVBSUpDLE1BSkksQ0FJSUYsQ0FBRCxJQUFPQTtBQUFBQTtBQUFBQTtBQUFBQSxXQUFBQSxDQUFDO0FBQUEsR0FKWCxDQUFQO0FBS0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aFRvU3RyaW5nIGZyb20gJy4uL2NvbnZlcnQvcGF0aFRvU3RyaW5nJztcbmltcG9ydCBwYXRoVG9BYnNvbHV0ZSBmcm9tICcuLi9jb252ZXJ0L3BhdGhUb0Fic29sdXRlJztcblxuLyoqXG4gKiBTcGxpdCBhIHBhdGggaW50byBhbiBgQXJyYXlgIG9mIHN1Yi1wYXRoIHN0cmluZ3MuXG4gKlxuICogSW4gdGhlIHByb2Nlc3MsIHZhbHVlcyBhcmUgY29udmVydGVkIHRvIGFic29sdXRlXG4gKiBmb3IgdmlzdWFsIGNvbnNpc3RlbmN5LlxuICpcbiAqIEBwYXJhbSB7U1ZHUGF0aC5wYXRoQXJyYXkgfCBzdHJpbmd9IHBhdGhJbnB1dCB0aGUgc291cmNlIGBwYXRoQXJyYXlgXG4gKiBAcmV0dXJuIHtzdHJpbmdbXX0gYW4gYXJyYXkgd2l0aCBhbGwgc3ViLXBhdGggc3RyaW5nc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzcGxpdFBhdGgocGF0aElucHV0KSB7XG4gIHJldHVybiBwYXRoVG9TdHJpbmcocGF0aFRvQWJzb2x1dGUocGF0aElucHV0KSwgMClcbiAgICAucmVwbGFjZSgvKG18TSkvZywgJ3wkMScpXG4gICAgLnNwbGl0KCd8JylcbiAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAuZmlsdGVyKChzKSA9PiBzKTtcbn1cbiJdfQ==