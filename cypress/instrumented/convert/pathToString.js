function cov_1ejaqt64u4() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\convert\\pathToString.js";
  var hash = "9aa6432131a7064f84501c729810fb16165063a5";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\convert\\pathToString.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 13,
          column: 54
        }
      },
      "1": {
        start: {
          line: 13,
          column: 16
        },
        end: {
          line: 13,
          column: 43
        }
      }
    },
    fnMap: {
      "0": {
        name: "pathToString",
        decl: {
          start: {
            line: 11,
            column: 24
          },
          end: {
            line: 11,
            column: 36
          }
        },
        loc: {
          start: {
            line: 11,
            column: 50
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 11
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 13,
            column: 9
          },
          end: {
            line: 13,
            column: 10
          }
        },
        loc: {
          start: {
            line: 13,
            column: 16
          },
          end: {
            line: 13,
            column: 43
          }
        },
        line: 13
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "9aa6432131a7064f84501c729810fb16165063a5"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1ejaqt64u4 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1ejaqt64u4();
import roundPath from '../process/roundPath';
/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param {SVGPath.pathArray} path the `pathArray` object
 * @param {number | false} round amount of decimals to round values to
 * @returns {string} the concatenated path string
 */

export default function pathToString(path, round) {
  cov_1ejaqt64u4().f[0]++;
  cov_1ejaqt64u4().s[0]++;
  return roundPath(path, round).map(x => {
    cov_1ejaqt64u4().f[1]++;
    cov_1ejaqt64u4().s[1]++;
    return x[0] + x.slice(1).join(' ');
  }).join('');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhdGhUb1N0cmluZy5qcyJdLCJuYW1lcyI6WyJyb3VuZFBhdGgiLCJwYXRoVG9TdHJpbmciLCJwYXRoIiwicm91bmQiLCJtYXAiLCJ4Iiwic2xpY2UiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFNBQVAsTUFBc0Isc0JBQXRCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCQyxLQUE1QixFQUFtQztBQUFBO0FBQUE7QUFDaEQsU0FBT0gsU0FBUyxDQUFDRSxJQUFELEVBQU9DLEtBQVAsQ0FBVCxDQUNKQyxHQURJLENBQ0NDLENBQUQsSUFBTztBQUFBO0FBQUE7QUFBQSxXQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9BLENBQUMsQ0FBQ0MsS0FBRixDQUFRLENBQVIsRUFBV0MsSUFBWCxDQUFnQixHQUFoQixDQUFQO0FBQTJCLEdBRGxDLEVBQ29DQSxJQURwQyxDQUN5QyxFQUR6QyxDQUFQO0FBRUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcm91bmRQYXRoIGZyb20gJy4uL3Byb2Nlc3Mvcm91bmRQYXRoJztcblxuLyoqXG4gKiBSZXR1cm5zIGEgdmFsaWQgYGRgIGF0dHJpYnV0ZSBzdHJpbmcgdmFsdWUgY3JlYXRlZFxuICogYnkgcm91bmRpbmcgdmFsdWVzIGFuZCBjb25jYXRlbmF0aW5nIHRoZSBgcGF0aEFycmF5YCBzZWdtZW50cy5cbiAqXG4gKiBAcGFyYW0ge1NWR1BhdGgucGF0aEFycmF5fSBwYXRoIHRoZSBgcGF0aEFycmF5YCBvYmplY3RcbiAqIEBwYXJhbSB7bnVtYmVyIHwgZmFsc2V9IHJvdW5kIGFtb3VudCBvZiBkZWNpbWFscyB0byByb3VuZCB2YWx1ZXMgdG9cbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBjb25jYXRlbmF0ZWQgcGF0aCBzdHJpbmdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGF0aFRvU3RyaW5nKHBhdGgsIHJvdW5kKSB7XG4gIHJldHVybiByb3VuZFBhdGgocGF0aCwgcm91bmQpXG4gICAgLm1hcCgoeCkgPT4geFswXSArIHguc2xpY2UoMSkuam9pbignICcpKS5qb2luKCcnKTtcbn1cbiJdfQ==