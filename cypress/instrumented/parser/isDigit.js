function cov_2gp0wbi2x5() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isDigit.js";
  var hash = "748b49b5f994ca28d193b9a3bc1a9661a964f997";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isDigit.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 8,
          column: 36
        }
      }
    },
    fnMap: {
      "0": {
        name: "isDigit",
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
            column: 38
          },
          end: {
            line: 9,
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
            line: 8,
            column: 10
          },
          end: {
            line: 8,
            column: 34
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 8,
            column: 10
          },
          end: {
            line: 8,
            column: 20
          }
        }, {
          start: {
            line: 8,
            column: 24
          },
          end: {
            line: 8,
            column: 34
          }
        }],
        line: 8
      }
    },
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "748b49b5f994ca28d193b9a3bc1a9661a964f997"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2gp0wbi2x5 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2gp0wbi2x5();

/**
 * Checks if a character is a digit.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
export default function isDigit(code) {
  cov_2gp0wbi2x5().f[0]++;
  cov_2gp0wbi2x5().s[0]++;
  return (cov_2gp0wbi2x5().b[0][0]++, code >= 48) && (cov_2gp0wbi2x5().b[0][1]++, code <= 57); // 0..9
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzRGlnaXQuanMiXSwibmFtZXMiOlsiaXNEaWdpdCIsImNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBU0EsT0FBVCxDQUFpQkMsSUFBakIsRUFBdUI7QUFBQTtBQUFBO0FBQ3BDLFNBQVEsNkJBQUFBLElBQUksSUFBSSxFQUFSLGtDQUFjQSxJQUFJLElBQUksRUFBdEIsQ0FBUixDQURvQyxDQUNEO0FBQ3BDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDaGVja3MgaWYgYSBjaGFyYWN0ZXIgaXMgYSBkaWdpdC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSB0aGUgY2hhcmFjdGVyIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gY2hlY2sgcmVzdWx0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRGlnaXQoY29kZSkge1xuICByZXR1cm4gKGNvZGUgPj0gNDggJiYgY29kZSA8PSA1Nyk7IC8vIDAuLjlcbn1cbiJdfQ==