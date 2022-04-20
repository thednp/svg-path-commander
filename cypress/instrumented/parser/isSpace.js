function cov_oyiem0z3g() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isSpace.js";
  var hash = "cd2e8ae80f3c58cf4a77470219ab491350519ced";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isSpace.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 24
        },
        end: {
          line: 10,
          column: 67
        }
      },
      "1": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 14,
          column: 52
        }
      }
    },
    fnMap: {
      "0": {
        name: "isSpace",
        decl: {
          start: {
            line: 7,
            column: 24
          },
          end: {
            line: 7,
            column: 31
          }
        },
        loc: {
          start: {
            line: 7,
            column: 36
          },
          end: {
            line: 15,
            column: 1
          }
        },
        line: 7
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 11,
            column: 9
          },
          end: {
            line: 14,
            column: 51
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 11,
            column: 10
          },
          end: {
            line: 11,
            column: 21
          }
        }, {
          start: {
            line: 11,
            column: 27
          },
          end: {
            line: 11,
            column: 38
          }
        }, {
          start: {
            line: 11,
            column: 44
          },
          end: {
            line: 11,
            column: 57
          }
        }, {
          start: {
            line: 11,
            column: 63
          },
          end: {
            line: 11,
            column: 76
          }
        }, {
          start: {
            line: 13,
            column: 8
          },
          end: {
            line: 13,
            column: 19
          }
        }, {
          start: {
            line: 13,
            column: 25
          },
          end: {
            line: 13,
            column: 36
          }
        }, {
          start: {
            line: 13,
            column: 42
          },
          end: {
            line: 13,
            column: 53
          }
        }, {
          start: {
            line: 13,
            column: 59
          },
          end: {
            line: 13,
            column: 70
          }
        }, {
          start: {
            line: 13,
            column: 76
          },
          end: {
            line: 13,
            column: 87
          }
        }, {
          start: {
            line: 14,
            column: 8
          },
          end: {
            line: 14,
            column: 20
          }
        }, {
          start: {
            line: 14,
            column: 24
          },
          end: {
            line: 14,
            column: 50
          }
        }],
        line: 11
      }
    },
    s: {
      "0": 0,
      "1": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "cd2e8ae80f3c58cf4a77470219ab491350519ced"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_oyiem0z3g = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_oyiem0z3g();

/**
 * Checks if the character is a space.
 *
 * @param {number} ch the character to check
 * @returns {boolean} check result
 */
export default function isSpace(ch) {
  cov_oyiem0z3g().f[0]++;
  const specialSpaces = (cov_oyiem0z3g().s[0]++, [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF]);
  cov_oyiem0z3g().s[1]++;
  return (cov_oyiem0z3g().b[0][0]++, ch === 0x0A) || (cov_oyiem0z3g().b[0][1]++, ch === 0x0D) || (cov_oyiem0z3g().b[0][2]++, ch === 0x2028) || (cov_oyiem0z3g().b[0][3]++, ch === 0x2029) // Line terminators
  // White spaces
  || (cov_oyiem0z3g().b[0][4]++, ch === 0x20) || (cov_oyiem0z3g().b[0][5]++, ch === 0x09) || (cov_oyiem0z3g().b[0][6]++, ch === 0x0B) || (cov_oyiem0z3g().b[0][7]++, ch === 0x0C) || (cov_oyiem0z3g().b[0][8]++, ch === 0xA0) || (cov_oyiem0z3g().b[0][9]++, ch >= 0x1680) && (cov_oyiem0z3g().b[0][10]++, specialSpaces.includes(ch));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzU3BhY2UuanMiXSwibmFtZXMiOlsiaXNTcGFjZSIsImNoIiwic3BlY2lhbFNwYWNlcyIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsT0FBVCxDQUFpQkMsRUFBakIsRUFBcUI7QUFBQTtBQUNsQyxRQUFNQyxhQUFhLDRCQUFHLENBQ3BCLE1BRG9CLEVBQ1osTUFEWSxFQUNKLE1BREksRUFDSSxNQURKLEVBQ1ksTUFEWixFQUNvQixNQURwQixFQUM0QixNQUQ1QixFQUNvQyxNQURwQyxFQUM0QyxNQUQ1QyxFQUVwQixNQUZvQixFQUVaLE1BRlksRUFFSixNQUZJLEVBRUksTUFGSixFQUVZLE1BRlosRUFFb0IsTUFGcEIsRUFFNEIsTUFGNUIsRUFFb0MsTUFGcEMsQ0FBSCxDQUFuQjtBQURrQztBQUlsQyxTQUFPLDRCQUFDRCxFQUFFLEtBQUssSUFBUixpQ0FBa0JBLEVBQUUsS0FBSyxJQUF6QixpQ0FBbUNBLEVBQUUsS0FBSyxNQUExQyxpQ0FBc0RBLEVBQUUsS0FBSyxNQUE3RCxFQUFxRTtBQUMxRTtBQURLLGlDQUVEQSxFQUFFLEtBQUssSUFGTixpQ0FFZ0JBLEVBQUUsS0FBSyxJQUZ2QixpQ0FFaUNBLEVBQUUsS0FBSyxJQUZ4QyxpQ0FFa0RBLEVBQUUsS0FBSyxJQUZ6RCxpQ0FFbUVBLEVBQUUsS0FBSyxJQUYxRSxLQUdELDRCQUFBQSxFQUFFLElBQUksTUFBTixrQ0FBZ0JDLGFBQWEsQ0FBQ0MsUUFBZCxDQUF1QkYsRUFBdkIsQ0FBaEIsQ0FITjtBQUlEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDaGVja3MgaWYgdGhlIGNoYXJhY3RlciBpcyBhIHNwYWNlLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaCB0aGUgY2hhcmFjdGVyIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gY2hlY2sgcmVzdWx0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU3BhY2UoY2gpIHtcbiAgY29uc3Qgc3BlY2lhbFNwYWNlcyA9IFtcbiAgICAweDE2ODAsIDB4MTgwRSwgMHgyMDAwLCAweDIwMDEsIDB4MjAwMiwgMHgyMDAzLCAweDIwMDQsIDB4MjAwNSwgMHgyMDA2LFxuICAgIDB4MjAwNywgMHgyMDA4LCAweDIwMDksIDB4MjAwQSwgMHgyMDJGLCAweDIwNUYsIDB4MzAwMCwgMHhGRUZGXTtcbiAgcmV0dXJuIChjaCA9PT0gMHgwQSkgfHwgKGNoID09PSAweDBEKSB8fCAoY2ggPT09IDB4MjAyOCkgfHwgKGNoID09PSAweDIwMjkpIC8vIExpbmUgdGVybWluYXRvcnNcbiAgICAvLyBXaGl0ZSBzcGFjZXNcbiAgICB8fCAoY2ggPT09IDB4MjApIHx8IChjaCA9PT0gMHgwOSkgfHwgKGNoID09PSAweDBCKSB8fCAoY2ggPT09IDB4MEMpIHx8IChjaCA9PT0gMHhBMClcbiAgICB8fCAoY2ggPj0gMHgxNjgwICYmIHNwZWNpYWxTcGFjZXMuaW5jbHVkZXMoY2gpKTtcbn1cbiJdfQ==