function cov_l6l824or5() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPathLength.js";
  var hash = "038960f33a99c1f7b49eedc60887fe4859897825";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\getPathLength.js",
    statementMap: {
      "0": {
        start: {
          line: 14,
          column: 20
        },
        end: {
          line: 14,
          column: 21
        }
      },
      "1": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 19,
          column: 5
        }
      },
      "2": {
        start: {
          line: 16,
          column: 17
        },
        end: {
          line: 16,
          column: 84
        }
      },
      "3": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 67
        }
      },
      "4": {
        start: {
          line: 20,
          column: 2
        },
        end: {
          line: 20,
          column: 21
        }
      }
    },
    fnMap: {
      "0": {
        name: "getPathLength",
        decl: {
          start: {
            line: 13,
            column: 24
          },
          end: {
            line: 13,
            column: 37
          }
        },
        loc: {
          start: {
            line: 13,
            column: 44
          },
          end: {
            line: 21,
            column: 1
          }
        },
        line: 13
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 15,
            column: 28
          },
          end: {
            line: 15,
            column: 29
          }
        },
        loc: {
          start: {
            line: 15,
            column: 50
          },
          end: {
            line: 19,
            column: 3
          }
        },
        line: 15
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 16,
            column: 17
          },
          end: {
            line: 16,
            column: 84
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 16,
            column: 32
          },
          end: {
            line: 16,
            column: 79
          }
        }, {
          start: {
            line: 16,
            column: 82
          },
          end: {
            line: 16,
            column: 84
          }
        }],
        line: 16
      },
      "1": {
        loc: {
          start: {
            line: 18,
            column: 19
          },
          end: {
            line: 18,
            column: 66
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 18,
            column: 34
          },
          end: {
            line: 18,
            column: 35
          }
        }, {
          start: {
            line: 18,
            column: 38
          },
          end: {
            line: 18,
            column: 66
          }
        }],
        line: 18
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "038960f33a99c1f7b49eedc60887fe4859897825"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_l6l824or5 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_l6l824or5();
import segmentCubicFactory from './segmentCubicFactory';
import pathToCurve from '../convert/pathToCurve';
/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * This is the `pathToCurve` version which is faster and more efficient for
 * paths that are `curveArray`.
 *
 * @param {string | SVGPath.curveArray} path the target `pathArray`
 * @returns {number} the `curveArray` total length
 */

export default function getPathLength(path) {
  cov_l6l824or5().f[0]++;
  let totalLength = (cov_l6l824or5().s[0]++, 0);
  cov_l6l824or5().s[1]++;
  pathToCurve(path).forEach((s, i, curveArray) => {
    cov_l6l824or5().f[1]++;
    const args = (cov_l6l824or5().s[2]++, s[0] !== 'M' ? (cov_l6l824or5().b[0][0]++, [...curveArray[i - 1].slice(-2), ...s.slice(1)]) : (cov_l6l824or5().b[0][1]++, [])); // @ts-ignore

    cov_l6l824or5().s[3]++;
    totalLength += s[0] === 'M' ? (cov_l6l824or5().b[1][0]++, 0) : (cov_l6l824or5().b[1][1]++, segmentCubicFactory(...args));
  });
  cov_l6l824or5().s[4]++;
  return totalLength;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFBhdGhMZW5ndGguanMiXSwibmFtZXMiOlsic2VnbWVudEN1YmljRmFjdG9yeSIsInBhdGhUb0N1cnZlIiwiZ2V0UGF0aExlbmd0aCIsInBhdGgiLCJ0b3RhbExlbmd0aCIsImZvckVhY2giLCJzIiwiaSIsImN1cnZlQXJyYXkiLCJhcmdzIiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLG1CQUFQLE1BQWdDLHVCQUFoQztBQUNBLE9BQU9DLFdBQVAsTUFBd0Isd0JBQXhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsYUFBVCxDQUF1QkMsSUFBdkIsRUFBNkI7QUFBQTtBQUMxQyxNQUFJQyxXQUFXLDRCQUFHLENBQUgsQ0FBZjtBQUQwQztBQUUxQ0gsRUFBQUEsV0FBVyxDQUFDRSxJQUFELENBQVgsQ0FBa0JFLE9BQWxCLENBQTBCLENBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFPQyxVQUFQLEtBQXNCO0FBQUE7QUFDOUMsVUFBTUMsSUFBSSw0QkFBR0gsQ0FBQyxDQUFDLENBQUQsQ0FBRCxLQUFTLEdBQVQsK0JBQWUsQ0FBQyxHQUFHRSxVQUFVLENBQUNELENBQUMsR0FBRyxDQUFMLENBQVYsQ0FBa0JHLEtBQWxCLENBQXdCLENBQUMsQ0FBekIsQ0FBSixFQUFpQyxHQUFHSixDQUFDLENBQUNJLEtBQUYsQ0FBUSxDQUFSLENBQXBDLENBQWYsZ0NBQWlFLEVBQWpFLENBQUgsQ0FBVixDQUQ4QyxDQUU5Qzs7QUFGOEM7QUFHOUNOLElBQUFBLFdBQVcsSUFBSUUsQ0FBQyxDQUFDLENBQUQsQ0FBRCxLQUFTLEdBQVQsK0JBQWUsQ0FBZixnQ0FBbUJOLG1CQUFtQixDQUFDLEdBQUdTLElBQUosQ0FBdEMsQ0FBZjtBQUNELEdBSkQ7QUFGMEM7QUFPMUMsU0FBT0wsV0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlZ21lbnRDdWJpY0ZhY3RvcnkgZnJvbSAnLi9zZWdtZW50Q3ViaWNGYWN0b3J5JztcbmltcG9ydCBwYXRoVG9DdXJ2ZSBmcm9tICcuLi9jb252ZXJ0L3BhdGhUb0N1cnZlJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzaGFwZSB0b3RhbCBsZW5ndGgsIG9yIHRoZSBlcXVpdmFsZW50IHRvIGBzaGFwZS5nZXRUb3RhbExlbmd0aCgpYC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBgcGF0aFRvQ3VydmVgIHZlcnNpb24gd2hpY2ggaXMgZmFzdGVyIGFuZCBtb3JlIGVmZmljaWVudCBmb3JcbiAqIHBhdGhzIHRoYXQgYXJlIGBjdXJ2ZUFycmF5YC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IFNWR1BhdGguY3VydmVBcnJheX0gcGF0aCB0aGUgdGFyZ2V0IGBwYXRoQXJyYXlgXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgYGN1cnZlQXJyYXlgIHRvdGFsIGxlbmd0aFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRQYXRoTGVuZ3RoKHBhdGgpIHtcbiAgbGV0IHRvdGFsTGVuZ3RoID0gMDtcbiAgcGF0aFRvQ3VydmUocGF0aCkuZm9yRWFjaCgocywgaSwgY3VydmVBcnJheSkgPT4ge1xuICAgIGNvbnN0IGFyZ3MgPSBzWzBdICE9PSAnTScgPyBbLi4uY3VydmVBcnJheVtpIC0gMV0uc2xpY2UoLTIpLCAuLi5zLnNsaWNlKDEpXSA6IFtdO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0b3RhbExlbmd0aCArPSBzWzBdID09PSAnTScgPyAwIDogc2VnbWVudEN1YmljRmFjdG9yeSguLi5hcmdzKTtcbiAgfSk7XG4gIHJldHVybiB0b3RhbExlbmd0aDtcbn1cbiJdfQ==