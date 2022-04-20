function cov_1g5bvr2ya4() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isPathCommand.js";
  var hash = "615b80d683735a738b01d851a628b47093888fbc";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isPathCommand.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 24,
          column: 3
        }
      },
      "1": {
        start: {
          line: 21,
          column: 6
        },
        end: {
          line: 21,
          column: 18
        }
      },
      "2": {
        start: {
          line: 23,
          column: 6
        },
        end: {
          line: 23,
          column: 19
        }
      }
    },
    fnMap: {
      "0": {
        name: "isPathCommand",
        decl: {
          start: {
            line: 7,
            column: 24
          },
          end: {
            line: 7,
            column: 37
          }
        },
        loc: {
          start: {
            line: 7,
            column: 44
          },
          end: {
            line: 25,
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
            line: 9,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        },
        type: "switch",
        locations: [{
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 21
          }
        }, {
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 11,
            column: 21
          }
        }, {
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 12,
            column: 21
          }
        }, {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 21
          }
        }, {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 14,
            column: 21
          }
        }, {
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 15,
            column: 21
          }
        }, {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 21
          }
        }, {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 21
          }
        }, {
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 18,
            column: 21
          }
        }, {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 21,
            column: 18
          }
        }, {
          start: {
            line: 22,
            column: 4
          },
          end: {
            line: 23,
            column: 19
          }
        }],
        line: 9
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
      "0": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "615b80d683735a738b01d851a628b47093888fbc"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1g5bvr2ya4 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1g5bvr2ya4();

/**
 * Checks if the character is a path command.
 *
 * @param {any} code the character to check
 * @returns {boolean} check result
 */
export default function isPathCommand(code) {
  cov_1g5bvr2ya4().f[0]++;
  cov_1g5bvr2ya4().s[0]++;

  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  switch (code | 0x20) {
    case 0x6D
    /* m */
    :
      cov_1g5bvr2ya4().b[0][0]++;

    case 0x7A
    /* z */
    :
      cov_1g5bvr2ya4().b[0][1]++;

    case 0x6C
    /* l */
    :
      cov_1g5bvr2ya4().b[0][2]++;

    case 0x68
    /* h */
    :
      cov_1g5bvr2ya4().b[0][3]++;

    case 0x76
    /* v */
    :
      cov_1g5bvr2ya4().b[0][4]++;

    case 0x63
    /* c */
    :
      cov_1g5bvr2ya4().b[0][5]++;

    case 0x73
    /* s */
    :
      cov_1g5bvr2ya4().b[0][6]++;

    case 0x71
    /* q */
    :
      cov_1g5bvr2ya4().b[0][7]++;

    case 0x74
    /* t */
    :
      cov_1g5bvr2ya4().b[0][8]++;

    case 0x61
    /* a */
    :
      cov_1g5bvr2ya4().b[0][9]++;
      cov_1g5bvr2ya4().s[1]++;
      // case 0x72/* r */:
      return true;

    default:
      cov_1g5bvr2ya4().b[0][10]++;
      cov_1g5bvr2ya4().s[2]++;
      return false;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzUGF0aENvbW1hbmQuanMiXSwibmFtZXMiOlsiaXNQYXRoQ29tbWFuZCIsImNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7Ozs7QUFmWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVNBLGFBQVQsQ0FBdUJDLElBQXZCLEVBQTZCO0FBQUE7QUFBQTs7QUFDMUM7QUFDQSxVQUFRQSxJQUFJLEdBQUcsSUFBZjtBQUNFLFNBQUs7QUFBSTtBQUFUO0FBQUE7O0FBQ0EsU0FBSztBQUFJO0FBQVQ7QUFBQTs7QUFDQSxTQUFLO0FBQUk7QUFBVDtBQUFBOztBQUNBLFNBQUs7QUFBSTtBQUFUO0FBQUE7O0FBQ0EsU0FBSztBQUFJO0FBQVQ7QUFBQTs7QUFDQSxTQUFLO0FBQUk7QUFBVDtBQUFBOztBQUNBLFNBQUs7QUFBSTtBQUFUO0FBQUE7O0FBQ0EsU0FBSztBQUFJO0FBQVQ7QUFBQTs7QUFDQSxTQUFLO0FBQUk7QUFBVDtBQUFBOztBQUNBLFNBQUs7QUFBSTtBQUFUO0FBQUE7QUFBQTtBQUNBO0FBQ0UsYUFBTyxJQUFQOztBQUNGO0FBQUE7QUFBQTtBQUNFLGFBQU8sS0FBUDtBQWRKO0FBZ0JEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDaGVja3MgaWYgdGhlIGNoYXJhY3RlciBpcyBhIHBhdGggY29tbWFuZC5cbiAqXG4gKiBAcGFyYW0ge2FueX0gY29kZSB0aGUgY2hhcmFjdGVyIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gY2hlY2sgcmVzdWx0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzUGF0aENvbW1hbmQoY29kZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZSAtLSBJbXBvc3NpYmxlIHRvIHNhdGlzZnlcbiAgc3dpdGNoIChjb2RlIHwgMHgyMCkge1xuICAgIGNhc2UgMHg2RC8qIG0gKi86XG4gICAgY2FzZSAweDdBLyogeiAqLzpcbiAgICBjYXNlIDB4NkMvKiBsICovOlxuICAgIGNhc2UgMHg2OC8qIGggKi86XG4gICAgY2FzZSAweDc2LyogdiAqLzpcbiAgICBjYXNlIDB4NjMvKiBjICovOlxuICAgIGNhc2UgMHg3My8qIHMgKi86XG4gICAgY2FzZSAweDcxLyogcSAqLzpcbiAgICBjYXNlIDB4NzQvKiB0ICovOlxuICAgIGNhc2UgMHg2MS8qIGEgKi86XG4gICAgLy8gY2FzZSAweDcyLyogciAqLzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==