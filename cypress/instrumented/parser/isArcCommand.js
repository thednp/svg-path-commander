function cov_1z3vqy0ldq() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isArcCommand.js";
  var hash = "41478160423ce4cf9b8bf5306246f2406f3dfa7d";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\isArcCommand.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 32
        }
      }
    },
    fnMap: {
      "0": {
        name: "isArcCommand",
        decl: {
          start: {
            line: 7,
            column: 24
          },
          end: {
            line: 7,
            column: 36
          }
        },
        loc: {
          start: {
            line: 7,
            column: 43
          },
          end: {
            line: 10,
            column: 1
          }
        },
        line: 7
      }
    },
    branchMap: {},
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "41478160423ce4cf9b8bf5306246f2406f3dfa7d"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1z3vqy0ldq = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1z3vqy0ldq();

/**
 * Checks if the character is an A (arc-to) path command.
 *
 * @param {number} code the character to check
 * @returns {boolean} check result
 */
export default function isArcCommand(code) {
  cov_1z3vqy0ldq().f[0]++;
  cov_1z3vqy0ldq().s[0]++;
  // eslint-disable-next-line no-bitwise -- Impossible to satisfy
  return (code | 0x20) === 0x61;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzQXJjQ29tbWFuZC5qcyJdLCJuYW1lcyI6WyJpc0FyY0NvbW1hbmQiLCJjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7Ozs7QUFmWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVNBLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQUE7QUFBQTtBQUN6QztBQUNBLFNBQU8sQ0FBQ0EsSUFBSSxHQUFHLElBQVIsTUFBa0IsSUFBekI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2hlY2tzIGlmIHRoZSBjaGFyYWN0ZXIgaXMgYW4gQSAoYXJjLXRvKSBwYXRoIGNvbW1hbmQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgdGhlIGNoYXJhY3RlciB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59IGNoZWNrIHJlc3VsdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0FyY0NvbW1hbmQoY29kZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZSAtLSBJbXBvc3NpYmxlIHRvIHNhdGlzZnlcbiAgcmV0dXJuIChjb2RlIHwgMHgyMCkgPT09IDB4NjE7XG59XG4iXX0=