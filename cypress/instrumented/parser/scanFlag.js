function cov_1onakvp519() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\scanFlag.js";
  var hash = "2ddc3894dfadf35a5b01132278c5acbbbe0c7c0f";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\scanFlag.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 20
        },
        end: {
          line: 10,
          column: 24
        }
      },
      "1": {
        start: {
          line: 11,
          column: 13
        },
        end: {
          line: 11,
          column: 45
        }
      },
      "2": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 17,
          column: 3
        }
      },
      "3": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 19
        }
      },
      "4": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 20
        }
      },
      "5": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 11
        }
      },
      "6": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "7": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 19
        }
      },
      "8": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 20
        }
      },
      "9": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 11
        }
      },
      "10": {
        start: {
          line: 25,
          column: 2
        },
        end: {
          line: 25,
          column: 86
        }
      }
    },
    fnMap: {
      "0": {
        name: "scanFlag",
        decl: {
          start: {
            line: 9,
            column: 24
          },
          end: {
            line: 9,
            column: 32
          }
        },
        loc: {
          start: {
            line: 9,
            column: 39
          },
          end: {
            line: 26,
            column: 1
          }
        },
        line: 9
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 17,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 17,
            column: 3
          }
        }, {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 17,
            column: 3
          }
        }],
        line: 13
      },
      "1": {
        loc: {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 23,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 23,
            column: 3
          }
        }, {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 23,
            column: 3
          }
        }],
        line: 19
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "2ddc3894dfadf35a5b01132278c5acbbbe0c7c0f"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1onakvp519 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1onakvp519();
import error from './error';
/**
 * Validates an A (arc-to) specific path command value.
 * Usually a `large-arc-flag` or `sweep-flag`.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */

export default function scanFlag(path) {
  cov_1onakvp519().f[0]++;
  const {
    index
  } = (cov_1onakvp519().s[0]++, path);
  const ch = (cov_1onakvp519().s[1]++, path.pathValue.charCodeAt(index));
  cov_1onakvp519().s[2]++;

  if (ch === 0x30
  /* 0 */
  ) {
    cov_1onakvp519().b[0][0]++;
    cov_1onakvp519().s[3]++;
    path.param = 0;
    cov_1onakvp519().s[4]++;
    path.index += 1;
    cov_1onakvp519().s[5]++;
    return;
  } else {
    cov_1onakvp519().b[0][1]++;
  }

  cov_1onakvp519().s[6]++;

  if (ch === 0x31
  /* 1 */
  ) {
    cov_1onakvp519().b[1][0]++;
    cov_1onakvp519().s[7]++;
    path.param = 1;
    cov_1onakvp519().s[8]++;
    path.index += 1;
    cov_1onakvp519().s[9]++;
    return;
  } else {
    cov_1onakvp519().b[1][1]++;
  }

  cov_1onakvp519().s[10]++;
  path.err = `${error}: invalid Arc flag "${ch}", expecting 0 or 1 at index ${index}`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjYW5GbGFnLmpzIl0sIm5hbWVzIjpbImVycm9yIiwic2NhbkZsYWciLCJwYXRoIiwiaW5kZXgiLCJjaCIsInBhdGhWYWx1ZSIsImNoYXJDb2RlQXQiLCJwYXJhbSIsImVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxLQUFQLE1BQWtCLFNBQWxCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0I7QUFBQTtBQUNyQyxRQUFNO0FBQUVDLElBQUFBO0FBQUYsZ0NBQVlELElBQVosQ0FBTjtBQUNBLFFBQU1FLEVBQUUsNkJBQUdGLElBQUksQ0FBQ0csU0FBTCxDQUFlQyxVQUFmLENBQTBCSCxLQUExQixDQUFILENBQVI7QUFGcUM7O0FBSXJDLE1BQUlDLEVBQUUsS0FBSztBQUFJO0FBQWYsSUFBd0I7QUFBQTtBQUFBO0FBQ3RCRixJQUFBQSxJQUFJLENBQUNLLEtBQUwsR0FBYSxDQUFiO0FBRHNCO0FBRXRCTCxJQUFBQSxJQUFJLENBQUNDLEtBQUwsSUFBYyxDQUFkO0FBRnNCO0FBR3RCO0FBQ0QsR0FKRDtBQUFBO0FBQUE7O0FBSnFDOztBQVVyQyxNQUFJQyxFQUFFLEtBQUs7QUFBSTtBQUFmLElBQXdCO0FBQUE7QUFBQTtBQUN0QkYsSUFBQUEsSUFBSSxDQUFDSyxLQUFMLEdBQWEsQ0FBYjtBQURzQjtBQUV0QkwsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLElBQWMsQ0FBZDtBQUZzQjtBQUd0QjtBQUNELEdBSkQ7QUFBQTtBQUFBOztBQVZxQztBQWdCckNELEVBQUFBLElBQUksQ0FBQ00sR0FBTCxHQUFZLEdBQUVSLEtBQU0sdUJBQXNCSSxFQUFHLGdDQUErQkQsS0FBTSxFQUFsRjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVycm9yIGZyb20gJy4vZXJyb3InO1xuXG4vKipcbiAqIFZhbGlkYXRlcyBhbiBBIChhcmMtdG8pIHNwZWNpZmljIHBhdGggY29tbWFuZCB2YWx1ZS5cbiAqIFVzdWFsbHkgYSBgbGFyZ2UtYXJjLWZsYWdgIG9yIGBzd2VlcC1mbGFnYC5cbiAqXG4gKiBAcGFyYW0ge1NWR1BhdGguUGF0aFBhcnNlcn0gcGF0aCB0aGUgYFBhdGhQYXJzZXJgIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNjYW5GbGFnKHBhdGgpIHtcbiAgY29uc3QgeyBpbmRleCB9ID0gcGF0aDtcbiAgY29uc3QgY2ggPSBwYXRoLnBhdGhWYWx1ZS5jaGFyQ29kZUF0KGluZGV4KTtcblxuICBpZiAoY2ggPT09IDB4MzAvKiAwICovKSB7XG4gICAgcGF0aC5wYXJhbSA9IDA7XG4gICAgcGF0aC5pbmRleCArPSAxO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaCA9PT0gMHgzMS8qIDEgKi8pIHtcbiAgICBwYXRoLnBhcmFtID0gMTtcbiAgICBwYXRoLmluZGV4ICs9IDE7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcGF0aC5lcnIgPSBgJHtlcnJvcn06IGludmFsaWQgQXJjIGZsYWcgXCIke2NofVwiLCBleHBlY3RpbmcgMCBvciAxIGF0IGluZGV4ICR7aW5kZXh9YDtcbn1cbiJdfQ==