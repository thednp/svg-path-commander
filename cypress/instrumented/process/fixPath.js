function cov_1mxcbi5sk8() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\fixPath.js";
  var hash = "40e5130b68199cc2491a97bbe5a93fdc9978c0cb";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\fixPath.js",
    statementMap: {
      "0": {
        start: {
          line: 17,
          column: 20
        },
        end: {
          line: 17,
          column: 46
        }
      },
      "1": {
        start: {
          line: 18,
          column: 22
        },
        end: {
          line: 18,
          column: 46
        }
      },
      "2": {
        start: {
          line: 19,
          column: 21
        },
        end: {
          line: 19,
          column: 30
        }
      },
      "3": {
        start: {
          line: 20,
          column: 19
        },
        end: {
          line: 20,
          column: 54
        }
      },
      "4": {
        start: {
          line: 21,
          column: 21
        },
        end: {
          line: 21,
          column: 55
        }
      },
      "5": {
        start: {
          line: 23,
          column: 19
        },
        end: {
          line: 23,
          column: 42
        }
      },
      "6": {
        start: {
          line: 24,
          column: 17
        },
        end: {
          line: 24,
          column: 50
        }
      },
      "7": {
        start: {
          line: 26,
          column: 2
        },
        end: {
          line: 29,
          column: 3
        }
      },
      "8": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 28,
          column: 34
        }
      },
      "9": {
        start: {
          line: 30,
          column: 2
        },
        end: {
          line: 30,
          column: 19
        }
      }
    },
    fnMap: {
      "0": {
        name: "fixPath",
        decl: {
          start: {
            line: 16,
            column: 24
          },
          end: {
            line: 16,
            column: 31
          }
        },
        loc: {
          start: {
            line: 16,
            column: 43
          },
          end: {
            line: 31,
            column: 1
          }
        },
        line: 16
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 21,
            column: 21
          },
          end: {
            line: 21,
            column: 55
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 21,
            column: 32
          },
          end: {
            line: 21,
            column: 42
          }
        }, {
          start: {
            line: 21,
            column: 45
          },
          end: {
            line: 21,
            column: 55
          }
        }],
        line: 21
      },
      "1": {
        loc: {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 29,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 29,
            column: 3
          }
        }, {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 29,
            column: 3
          }
        }],
        line: 26
      },
      "2": {
        loc: {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 38
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 14
          }
        }, {
          start: {
            line: 26,
            column: 18
          },
          end: {
            line: 26,
            column: 26
          }
        }, {
          start: {
            line: 26,
            column: 30
          },
          end: {
            line: 26,
            column: 38
          }
        }],
        line: 26
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
      "9": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "40e5130b68199cc2491a97bbe5a93fdc9978c0cb"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1mxcbi5sk8 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1mxcbi5sk8();
import parsePathString from '../parser/parsePathString';
import normalizePath from './normalizePath';
/**
 * Checks a `pathArray` for an unnecessary `Z` segment
 * and returns a new `pathArray` without it.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param {SVGPath.pathArray | string} pathInput the `pathArray` source
 * @return {SVGPath.pathArray} a fixed `pathArray`
 */

export default function fixPath(pathInput) {
  cov_1mxcbi5sk8().f[0]++;
  const pathArray = (cov_1mxcbi5sk8().s[0]++, parsePathString(pathInput));
  const normalArray = (cov_1mxcbi5sk8().s[1]++, normalizePath(pathArray));
  const {
    length
  } = (cov_1mxcbi5sk8().s[2]++, pathArray);
  const isClosed = (cov_1mxcbi5sk8().s[3]++, normalArray.slice(-1)[0][0] === 'Z');
  const segBeforeZ = (cov_1mxcbi5sk8().s[4]++, isClosed ? (cov_1mxcbi5sk8().b[0][0]++, length - 2) : (cov_1mxcbi5sk8().b[0][1]++, length - 1));
  const [mx, my] = (cov_1mxcbi5sk8().s[5]++, normalArray[0].slice(1));
  const [x, y] = (cov_1mxcbi5sk8().s[6]++, normalArray[segBeforeZ].slice(-2));
  cov_1mxcbi5sk8().s[7]++;

  if ((cov_1mxcbi5sk8().b[2][0]++, isClosed) && (cov_1mxcbi5sk8().b[2][1]++, mx === x) && (cov_1mxcbi5sk8().b[2][2]++, my === y)) {
    cov_1mxcbi5sk8().b[1][0]++;
    cov_1mxcbi5sk8().s[8]++;
    // @ts-ignore -- `pathSegment[]` is quite a `pathArray`
    return pathArray.slice(0, -1);
  } else {
    cov_1mxcbi5sk8().b[1][1]++;
  }

  cov_1mxcbi5sk8().s[9]++;
  return pathArray;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpeFBhdGguanMiXSwibmFtZXMiOlsicGFyc2VQYXRoU3RyaW5nIiwibm9ybWFsaXplUGF0aCIsImZpeFBhdGgiLCJwYXRoSW5wdXQiLCJwYXRoQXJyYXkiLCJub3JtYWxBcnJheSIsImxlbmd0aCIsImlzQ2xvc2VkIiwic2xpY2UiLCJzZWdCZWZvcmVaIiwibXgiLCJteSIsIngiLCJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsZUFBUCxNQUE0QiwyQkFBNUI7QUFDQSxPQUFPQyxhQUFQLE1BQTBCLGlCQUExQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLE9BQVQsQ0FBaUJDLFNBQWpCLEVBQTRCO0FBQUE7QUFDekMsUUFBTUMsU0FBUyw2QkFBR0osZUFBZSxDQUFDRyxTQUFELENBQWxCLENBQWY7QUFDQSxRQUFNRSxXQUFXLDZCQUFHSixhQUFhLENBQUNHLFNBQUQsQ0FBaEIsQ0FBakI7QUFDQSxRQUFNO0FBQUVFLElBQUFBO0FBQUYsZ0NBQWFGLFNBQWIsQ0FBTjtBQUNBLFFBQU1HLFFBQVEsNkJBQUdGLFdBQVcsQ0FBQ0csS0FBWixDQUFrQixDQUFDLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCLE1BQWdDLEdBQW5DLENBQWQ7QUFDQSxRQUFNQyxVQUFVLDZCQUFHRixRQUFRLGdDQUFHRCxNQUFNLEdBQUcsQ0FBWixpQ0FBZ0JBLE1BQU0sR0FBRyxDQUF6QixDQUFYLENBQWhCO0FBRUEsUUFBTSxDQUFDSSxFQUFELEVBQUtDLEVBQUwsOEJBQVdOLFdBQVcsQ0FBQyxDQUFELENBQVgsQ0FBZUcsS0FBZixDQUFxQixDQUFyQixDQUFYLENBQU47QUFDQSxRQUFNLENBQUNJLENBQUQsRUFBSUMsQ0FBSiw4QkFBU1IsV0FBVyxDQUFDSSxVQUFELENBQVgsQ0FBd0JELEtBQXhCLENBQThCLENBQUMsQ0FBL0IsQ0FBVCxDQUFOO0FBUnlDOztBQVV6QyxNQUFJLDZCQUFBRCxRQUFRLGtDQUFJRyxFQUFFLEtBQUtFLENBQVgsQ0FBUixpQ0FBd0JELEVBQUUsS0FBS0UsQ0FBL0IsQ0FBSixFQUFzQztBQUFBO0FBQUE7QUFDcEM7QUFDQSxXQUFPVCxTQUFTLENBQUNJLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBQyxDQUFwQixDQUFQO0FBQ0QsR0FIRDtBQUFBO0FBQUE7O0FBVnlDO0FBY3pDLFNBQU9KLFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXJzZVBhdGhTdHJpbmcgZnJvbSAnLi4vcGFyc2VyL3BhcnNlUGF0aFN0cmluZyc7XG5pbXBvcnQgbm9ybWFsaXplUGF0aCBmcm9tICcuL25vcm1hbGl6ZVBhdGgnO1xuXG4vKipcbiAqIENoZWNrcyBhIGBwYXRoQXJyYXlgIGZvciBhbiB1bm5lY2Vzc2FyeSBgWmAgc2VnbWVudFxuICogYW5kIHJldHVybnMgYSBuZXcgYHBhdGhBcnJheWAgd2l0aG91dCBpdC5cbiAqXG4gKiBUaGUgYHBhdGhJbnB1dGAgbXVzdCBiZSBhIHNpbmdsZSBwYXRoLCB3aXRob3V0XG4gKiBzdWItcGF0aHMuIEZvciBtdWx0aS1wYXRoIGA8cGF0aD5gIGVsZW1lbnRzLFxuICogdXNlIGBzcGxpdFBhdGhgIGZpcnN0IGFuZCBhcHBseSB0aGlzIHV0aWxpdHkgb24gZWFjaFxuICogc3ViLXBhdGggc2VwYXJhdGVseS5cbiAqXG4gKiBAcGFyYW0ge1NWR1BhdGgucGF0aEFycmF5IHwgc3RyaW5nfSBwYXRoSW5wdXQgdGhlIGBwYXRoQXJyYXlgIHNvdXJjZVxuICogQHJldHVybiB7U1ZHUGF0aC5wYXRoQXJyYXl9IGEgZml4ZWQgYHBhdGhBcnJheWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZml4UGF0aChwYXRoSW5wdXQpIHtcbiAgY29uc3QgcGF0aEFycmF5ID0gcGFyc2VQYXRoU3RyaW5nKHBhdGhJbnB1dCk7XG4gIGNvbnN0IG5vcm1hbEFycmF5ID0gbm9ybWFsaXplUGF0aChwYXRoQXJyYXkpO1xuICBjb25zdCB7IGxlbmd0aCB9ID0gcGF0aEFycmF5O1xuICBjb25zdCBpc0Nsb3NlZCA9IG5vcm1hbEFycmF5LnNsaWNlKC0xKVswXVswXSA9PT0gJ1onO1xuICBjb25zdCBzZWdCZWZvcmVaID0gaXNDbG9zZWQgPyBsZW5ndGggLSAyIDogbGVuZ3RoIC0gMTtcblxuICBjb25zdCBbbXgsIG15XSA9IG5vcm1hbEFycmF5WzBdLnNsaWNlKDEpO1xuICBjb25zdCBbeCwgeV0gPSBub3JtYWxBcnJheVtzZWdCZWZvcmVaXS5zbGljZSgtMik7XG5cbiAgaWYgKGlzQ2xvc2VkICYmIG14ID09PSB4ICYmIG15ID09PSB5KSB7XG4gICAgLy8gQHRzLWlnbm9yZSAtLSBgcGF0aFNlZ21lbnRbXWAgaXMgcXVpdGUgYSBgcGF0aEFycmF5YFxuICAgIHJldHVybiBwYXRoQXJyYXkuc2xpY2UoMCwgLTEpO1xuICB9XG4gIHJldHVybiBwYXRoQXJyYXk7XG59XG4iXX0=