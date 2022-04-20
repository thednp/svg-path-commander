function cov_qyzml6mli() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\parsePathString.js";
  var hash = "99deb328939afdaf0a98c997582468d46c7179ad";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\parsePathString.js",
    statementMap: {
      "0": {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 19,
          column: 3
        }
      },
      "1": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 32
        }
      },
      "2": {
        start: {
          line: 22,
          column: 15
        },
        end: {
          line: 22,
          column: 40
        }
      },
      "3": {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 24,
          column: 19
        }
      },
      "4": {
        start: {
          line: 26,
          column: 2
        },
        end: {
          line: 28,
          column: 3
        }
      },
      "5": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 22
        }
      },
      "6": {
        start: {
          line: 30,
          column: 2
        },
        end: {
          line: 36,
          column: 3
        }
      },
      "7": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 35,
          column: 5
        }
      },
      "8": {
        start: {
          line: 32,
          column: 6
        },
        end: {
          line: 32,
          column: 41
        }
      },
      "9": {
        start: {
          line: 34,
          column: 6
        },
        end: {
          line: 34,
          column: 32
        }
      },
      "10": {
        start: {
          line: 38,
          column: 2
        },
        end: {
          line: 38,
          column: 45
        }
      }
    },
    fnMap: {
      "0": {
        name: "parsePathString",
        decl: {
          start: {
            line: 15,
            column: 24
          },
          end: {
            line: 15,
            column: 39
          }
        },
        loc: {
          start: {
            line: 15,
            column: 51
          },
          end: {
            line: 39,
            column: 1
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
            column: 2
          },
          end: {
            line: 19,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 16,
            column: 2
          },
          end: {
            line: 19,
            column: 3
          }
        }, {
          start: {
            line: 16,
            column: 2
          },
          end: {
            line: 19,
            column: 3
          }
        }],
        line: 16
      },
      "1": {
        loc: {
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 26,
            column: 50
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 26,
            column: 30
          }
        }, {
          start: {
            line: 26,
            column: 34
          },
          end: {
            line: 26,
            column: 50
          }
        }],
        line: 26
      },
      "2": {
        loc: {
          start: {
            line: 30,
            column: 2
          },
          end: {
            line: 36,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 2
          },
          end: {
            line: 36,
            column: 3
          }
        }, {
          start: {
            line: 30,
            column: 2
          },
          end: {
            line: 36,
            column: 3
          }
        }],
        line: 30
      },
      "3": {
        loc: {
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 35,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 35,
            column: 5
          }
        }, {
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 35,
            column: 5
          }
        }],
        line: 31
      },
      "4": {
        loc: {
          start: {
            line: 38,
            column: 9
          },
          end: {
            line: 38,
            column: 44
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 38,
            column: 20
          },
          end: {
            line: 38,
            column: 28
          }
        }, {
          start: {
            line: 38,
            column: 31
          },
          end: {
            line: 38,
            column: 44
          }
        }],
        line: 38
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
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "99deb328939afdaf0a98c997582468d46c7179ad"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_qyzml6mli = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_qyzml6mli();
import scanSegment from './scanSegment';
import skipSpaces from './skipSpaces';
import error from './error';
import clonePath from '../process/clonePath';
import PathParser from './pathParser';
import isPathArray from '../util/isPathArray';
/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param {SVGPath.pathArray | string} pathInput the string to be parsed
 * @returns {SVGPath.pathArray | string} the resulted `pathArray`
 */

export default function parsePathString(pathInput) {
  cov_qyzml6mli().f[0]++;
  cov_qyzml6mli().s[0]++;

  if (isPathArray(pathInput)) {
    cov_qyzml6mli().b[0][0]++;
    cov_qyzml6mli().s[1]++;
    // @ts-ignore -- isPathArray also checks if it's an `Array`
    return clonePath(pathInput);
  } else {
    cov_qyzml6mli().b[0][1]++;
  } // @ts-ignore -- pathInput is now string


  const path = (cov_qyzml6mli().s[2]++, new PathParser(pathInput));
  cov_qyzml6mli().s[3]++;
  skipSpaces(path);
  cov_qyzml6mli().s[4]++;

  while ((cov_qyzml6mli().b[1][0]++, path.index < path.max) && (cov_qyzml6mli().b[1][1]++, !path.err.length)) {
    cov_qyzml6mli().s[5]++;
    scanSegment(path);
  }

  cov_qyzml6mli().s[6]++;

  if (!path.err.length) {
    cov_qyzml6mli().b[2][0]++;
    cov_qyzml6mli().s[7]++;

    if (!'mM'.includes(path.segments[0][0])) {
      cov_qyzml6mli().b[3][0]++;
      cov_qyzml6mli().s[8]++;
      path.err = `${error}: missing M/m`;
    } else {
      cov_qyzml6mli().b[3][1]++;
      cov_qyzml6mli().s[9]++;
      path.segments[0][0] = 'M';
    }
  } else {
    cov_qyzml6mli().b[2][1]++;
  }

  cov_qyzml6mli().s[10]++;
  return path.err ? (cov_qyzml6mli().b[4][0]++, path.err) : (cov_qyzml6mli().b[4][1]++, path.segments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlUGF0aFN0cmluZy5qcyJdLCJuYW1lcyI6WyJzY2FuU2VnbWVudCIsInNraXBTcGFjZXMiLCJlcnJvciIsImNsb25lUGF0aCIsIlBhdGhQYXJzZXIiLCJpc1BhdGhBcnJheSIsInBhcnNlUGF0aFN0cmluZyIsInBhdGhJbnB1dCIsInBhdGgiLCJpbmRleCIsIm1heCIsImVyciIsImxlbmd0aCIsImluY2x1ZGVzIiwic2VnbWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsV0FBUCxNQUF3QixlQUF4QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7QUFDQSxPQUFPQyxLQUFQLE1BQWtCLFNBQWxCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixzQkFBdEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBQ0EsT0FBT0MsV0FBUCxNQUF3QixxQkFBeEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFlLFNBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLEVBQW9DO0FBQUE7QUFBQTs7QUFDakQsTUFBSUYsV0FBVyxDQUFDRSxTQUFELENBQWYsRUFBNEI7QUFBQTtBQUFBO0FBQzFCO0FBQ0EsV0FBT0osU0FBUyxDQUFDSSxTQUFELENBQWhCO0FBQ0QsR0FIRDtBQUFBO0FBQUEsR0FEaUQsQ0FNakQ7OztBQUNBLFFBQU1DLElBQUksNEJBQUcsSUFBSUosVUFBSixDQUFlRyxTQUFmLENBQUgsQ0FBVjtBQVBpRDtBQVNqRE4sRUFBQUEsVUFBVSxDQUFDTyxJQUFELENBQVY7QUFUaUQ7O0FBV2pELFNBQU8sNEJBQUFBLElBQUksQ0FBQ0MsS0FBTCxHQUFhRCxJQUFJLENBQUNFLEdBQWxCLGlDQUF5QixDQUFDRixJQUFJLENBQUNHLEdBQUwsQ0FBU0MsTUFBbkMsQ0FBUCxFQUFrRDtBQUFBO0FBQ2hEWixJQUFBQSxXQUFXLENBQUNRLElBQUQsQ0FBWDtBQUNEOztBQWJnRDs7QUFlakQsTUFBSSxDQUFDQSxJQUFJLENBQUNHLEdBQUwsQ0FBU0MsTUFBZCxFQUFzQjtBQUFBO0FBQUE7O0FBQ3BCLFFBQUksQ0FBQyxLQUFLQyxRQUFMLENBQWNMLElBQUksQ0FBQ00sUUFBTCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsQ0FBZCxDQUFMLEVBQXlDO0FBQUE7QUFBQTtBQUN2Q04sTUFBQUEsSUFBSSxDQUFDRyxHQUFMLEdBQVksR0FBRVQsS0FBTSxlQUFwQjtBQUNELEtBRkQsTUFFTztBQUFBO0FBQUE7QUFDTE0sTUFBQUEsSUFBSSxDQUFDTSxRQUFMLENBQWMsQ0FBZCxFQUFpQixDQUFqQixJQUFzQixHQUF0QjtBQUNEO0FBQ0YsR0FORDtBQUFBO0FBQUE7O0FBZmlEO0FBdUJqRCxTQUFPTixJQUFJLENBQUNHLEdBQUwsK0JBQVdILElBQUksQ0FBQ0csR0FBaEIsZ0NBQXNCSCxJQUFJLENBQUNNLFFBQTNCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzY2FuU2VnbWVudCBmcm9tICcuL3NjYW5TZWdtZW50JztcbmltcG9ydCBza2lwU3BhY2VzIGZyb20gJy4vc2tpcFNwYWNlcyc7XG5pbXBvcnQgZXJyb3IgZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgY2xvbmVQYXRoIGZyb20gJy4uL3Byb2Nlc3MvY2xvbmVQYXRoJztcbmltcG9ydCBQYXRoUGFyc2VyIGZyb20gJy4vcGF0aFBhcnNlcic7XG5pbXBvcnQgaXNQYXRoQXJyYXkgZnJvbSAnLi4vdXRpbC9pc1BhdGhBcnJheSc7XG5cbi8qKlxuICogUGFyc2VzIGEgcGF0aCBzdHJpbmcgdmFsdWUgYW5kIHJldHVybnMgYW4gYXJyYXlcbiAqIG9mIHNlZ21lbnRzIHdlIGxpa2UgdG8gY2FsbCBgcGF0aEFycmF5YC5cbiAqXG4gKiBAcGFyYW0ge1NWR1BhdGgucGF0aEFycmF5IHwgc3RyaW5nfSBwYXRoSW5wdXQgdGhlIHN0cmluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtTVkdQYXRoLnBhdGhBcnJheSB8IHN0cmluZ30gdGhlIHJlc3VsdGVkIGBwYXRoQXJyYXlgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlUGF0aFN0cmluZyhwYXRoSW5wdXQpIHtcbiAgaWYgKGlzUGF0aEFycmF5KHBhdGhJbnB1dCkpIHtcbiAgICAvLyBAdHMtaWdub3JlIC0tIGlzUGF0aEFycmF5IGFsc28gY2hlY2tzIGlmIGl0J3MgYW4gYEFycmF5YFxuICAgIHJldHVybiBjbG9uZVBhdGgocGF0aElucHV0KTtcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmUgLS0gcGF0aElucHV0IGlzIG5vdyBzdHJpbmdcbiAgY29uc3QgcGF0aCA9IG5ldyBQYXRoUGFyc2VyKHBhdGhJbnB1dCk7XG5cbiAgc2tpcFNwYWNlcyhwYXRoKTtcblxuICB3aGlsZSAocGF0aC5pbmRleCA8IHBhdGgubWF4ICYmICFwYXRoLmVyci5sZW5ndGgpIHtcbiAgICBzY2FuU2VnbWVudChwYXRoKTtcbiAgfVxuXG4gIGlmICghcGF0aC5lcnIubGVuZ3RoKSB7XG4gICAgaWYgKCEnbU0nLmluY2x1ZGVzKHBhdGguc2VnbWVudHNbMF1bMF0pKSB7XG4gICAgICBwYXRoLmVyciA9IGAke2Vycm9yfTogbWlzc2luZyBNL21gO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRoLnNlZ21lbnRzWzBdWzBdID0gJ00nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoLmVyciA/IHBhdGguZXJyIDogcGF0aC5zZWdtZW50cztcbn1cbiJdfQ==