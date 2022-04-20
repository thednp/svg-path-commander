function cov_2nyes20mm3() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isDigitStart.js";
  var hash = "23e2620526f86d280913fc60dbcfa966a2d0392d";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isDigitStart.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 12,
          column: 21
        }
      }
    },
    fnMap: {
      "0": {
        name: "isDigitStart",
        decl: {
          start: {
            line: 8,
            column: 24
          },
          end: {
            line: 8,
            column: 36
          }
        },
        loc: {
          start: {
            line: 8,
            column: 43
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 8
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 9,
            column: 9
          },
          end: {
            line: 12,
            column: 20
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 9,
            column: 10
          },
          end: {
            line: 9,
            column: 20
          }
        }, {
          start: {
            line: 9,
            column: 24
          },
          end: {
            line: 9,
            column: 34
          }
        }, {
          start: {
            line: 10,
            column: 7
          },
          end: {
            line: 10,
            column: 20
          }
        }, {
          start: {
            line: 11,
            column: 7
          },
          end: {
            line: 11,
            column: 20
          }
        }, {
          start: {
            line: 12,
            column: 7
          },
          end: {
            line: 12,
            column: 20
          }
        }],
        line: 9
      }
    },
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0, 0, 0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "23e2620526f86d280913fc60dbcfa966a2d0392d"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2nyes20mm3 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2nyes20mm3();

/**
 * Checks if the character is or belongs to a number.
 * [0-9]|+|-|.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
export default function isDigitStart(code) {
  cov_2nyes20mm3().f[0]++;
  cov_2nyes20mm3().s[0]++;
  return (cov_2nyes20mm3().b[0][0]++, code >= 48) && (cov_2nyes20mm3().b[0][1]++, code <= 57)
  /* 0..9 */
  || (cov_2nyes20mm3().b[0][2]++, code === 0x2B)
  /* + */
  || (cov_2nyes20mm3().b[0][3]++, code === 0x2D)
  /* - */
  || (cov_2nyes20mm3().b[0][4]++, code === 0x2E);
  /* . */
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzRGlnaXRTdGFydC5qcyJdLCJuYW1lcyI6WyJpc0RpZ2l0U3RhcnQiLCJjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7Ozs7QUFmWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsWUFBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFBQTtBQUFBO0FBQ3pDLFNBQVEsNkJBQUFBLElBQUksSUFBSSxFQUFSLGtDQUFjQSxJQUFJLElBQUksRUFBdEI7QUFBMEI7QUFBM0Isa0NBQ0ZBLElBQUksS0FBSyxJQURQO0FBQ1k7QUFEWixrQ0FFRkEsSUFBSSxLQUFLLElBRlA7QUFFWTtBQUZaLGtDQUdGQSxJQUFJLEtBQUssSUFIUCxDQUFQO0FBR29CO0FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDaGVja3MgaWYgdGhlIGNoYXJhY3RlciBpcyBvciBiZWxvbmdzIHRvIGEgbnVtYmVyLlxuICogWzAtOV18K3wtfC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSB0aGUgY2hhcmFjdGVyIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gY2hlY2sgcmVzdWx0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRGlnaXRTdGFydChjb2RlKSB7XG4gIHJldHVybiAoY29kZSA+PSA0OCAmJiBjb2RlIDw9IDU3KSAvKiAwLi45ICovXG4gICAgfHwgY29kZSA9PT0gMHgyQiAvKiArICovXG4gICAgfHwgY29kZSA9PT0gMHgyRCAvKiAtICovXG4gICAgfHwgY29kZSA9PT0gMHgyRTsgLyogLiAqL1xufVxuIl19