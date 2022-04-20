function cov_6skz7b4tn() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isValidPath.js";
  var hash = "32482fb9a258e199532b2c075eb9869b9024fcab";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\util\\isValidPath.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 15,
          column: 3
        }
      },
      "1": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 17
        }
      },
      "2": {
        start: {
          line: 17,
          column: 15
        },
        end: {
          line: 17,
          column: 41
        }
      },
      "3": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 19,
          column: 19
        }
      },
      "4": {
        start: {
          line: 21,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "5": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 22
        }
      },
      "6": {
        start: {
          line: 25,
          column: 2
        },
        end: {
          line: 25,
          column: 64
        }
      }
    },
    fnMap: {
      "0": {
        name: "isValidPath",
        decl: {
          start: {
            line: 12,
            column: 24
          },
          end: {
            line: 12,
            column: 35
          }
        },
        loc: {
          start: {
            line: 12,
            column: 48
          },
          end: {
            line: 26,
            column: 1
          }
        },
        line: 12
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
            line: 15,
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
            line: 15,
            column: 3
          }
        }, {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 15,
            column: 3
          }
        }],
        line: 13
      },
      "1": {
        loc: {
          start: {
            line: 21,
            column: 9
          },
          end: {
            line: 21,
            column: 50
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 21,
            column: 9
          },
          end: {
            line: 21,
            column: 30
          }
        }, {
          start: {
            line: 21,
            column: 34
          },
          end: {
            line: 21,
            column: 50
          }
        }],
        line: 21
      },
      "2": {
        loc: {
          start: {
            line: 25,
            column: 9
          },
          end: {
            line: 25,
            column: 63
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 25,
            column: 9
          },
          end: {
            line: 25,
            column: 25
          }
        }, {
          start: {
            line: 25,
            column: 29
          },
          end: {
            line: 25,
            column: 63
          }
        }],
        line: 25
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "32482fb9a258e199532b2c075eb9869b9024fcab"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_6skz7b4tn = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_6skz7b4tn();
import scanSegment from '../parser/scanSegment';
import skipSpaces from '../parser/skipSpaces';
import PathParser from '../parser/pathParser';
/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param {string} pathString the path string to be parsed
 * @returns {boolean} the path string validity
 */

export default function isValidPath(pathString) {
  cov_6skz7b4tn().f[0]++;
  cov_6skz7b4tn().s[0]++;

  if (typeof pathString !== 'string') {
    cov_6skz7b4tn().b[0][0]++;
    cov_6skz7b4tn().s[1]++;
    return false;
  } else {
    cov_6skz7b4tn().b[0][1]++;
  }

  const path = (cov_6skz7b4tn().s[2]++, new PathParser(pathString));
  cov_6skz7b4tn().s[3]++;
  skipSpaces(path);
  cov_6skz7b4tn().s[4]++;

  while ((cov_6skz7b4tn().b[1][0]++, path.index < path.max) && (cov_6skz7b4tn().b[1][1]++, !path.err.length)) {
    cov_6skz7b4tn().s[5]++;
    scanSegment(path);
  }

  cov_6skz7b4tn().s[6]++;
  return (cov_6skz7b4tn().b[2][0]++, !path.err.length) && (cov_6skz7b4tn().b[2][1]++, 'mM'.includes(path.segments[0][0]));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzVmFsaWRQYXRoLmpzIl0sIm5hbWVzIjpbInNjYW5TZWdtZW50Iiwic2tpcFNwYWNlcyIsIlBhdGhQYXJzZXIiLCJpc1ZhbGlkUGF0aCIsInBhdGhTdHJpbmciLCJwYXRoIiwiaW5kZXgiLCJtYXgiLCJlcnIiLCJsZW5ndGgiLCJpbmNsdWRlcyIsInNlZ21lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlosT0FBT0EsV0FBUCxNQUF3Qix1QkFBeEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLHNCQUF2QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsc0JBQXZCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxTQUFTQyxXQUFULENBQXFCQyxVQUFyQixFQUFpQztBQUFBO0FBQUE7O0FBQzlDLE1BQUksT0FBT0EsVUFBUCxLQUFzQixRQUExQixFQUFvQztBQUFBO0FBQUE7QUFDbEMsV0FBTyxLQUFQO0FBQ0QsR0FGRDtBQUFBO0FBQUE7O0FBSUEsUUFBTUMsSUFBSSw0QkFBRyxJQUFJSCxVQUFKLENBQWVFLFVBQWYsQ0FBSCxDQUFWO0FBTDhDO0FBTzlDSCxFQUFBQSxVQUFVLENBQUNJLElBQUQsQ0FBVjtBQVA4Qzs7QUFTOUMsU0FBTyw0QkFBQUEsSUFBSSxDQUFDQyxLQUFMLEdBQWFELElBQUksQ0FBQ0UsR0FBbEIsaUNBQXlCLENBQUNGLElBQUksQ0FBQ0csR0FBTCxDQUFTQyxNQUFuQyxDQUFQLEVBQWtEO0FBQUE7QUFDaERULElBQUFBLFdBQVcsQ0FBQ0ssSUFBRCxDQUFYO0FBQ0Q7O0FBWDZDO0FBYTlDLFNBQU8sNkJBQUNBLElBQUksQ0FBQ0csR0FBTCxDQUFTQyxNQUFWLGlDQUFvQixLQUFLQyxRQUFMLENBQWNMLElBQUksQ0FBQ00sUUFBTCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsQ0FBZCxDQUFwQixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2NhblNlZ21lbnQgZnJvbSAnLi4vcGFyc2VyL3NjYW5TZWdtZW50JztcbmltcG9ydCBza2lwU3BhY2VzIGZyb20gJy4uL3BhcnNlci9za2lwU3BhY2VzJztcbmltcG9ydCBQYXRoUGFyc2VyIGZyb20gJy4uL3BhcnNlci9wYXRoUGFyc2VyJztcblxuLyoqXG4gKiBQYXJzZXMgYSBwYXRoIHN0cmluZyB2YWx1ZSB0byBkZXRlcm1pbmUgaXRzIHZhbGlkaXR5XG4gKiB0aGVuIHJldHVybnMgdHJ1ZSBpZiBpdCdzIHZhbGlkIG9yIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFN0cmluZyB0aGUgcGF0aCBzdHJpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdGhlIHBhdGggc3RyaW5nIHZhbGlkaXR5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVmFsaWRQYXRoKHBhdGhTdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBwYXRoU3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHBhdGggPSBuZXcgUGF0aFBhcnNlcihwYXRoU3RyaW5nKTtcblxuICBza2lwU3BhY2VzKHBhdGgpO1xuXG4gIHdoaWxlIChwYXRoLmluZGV4IDwgcGF0aC5tYXggJiYgIXBhdGguZXJyLmxlbmd0aCkge1xuICAgIHNjYW5TZWdtZW50KHBhdGgpO1xuICB9XG5cbiAgcmV0dXJuICFwYXRoLmVyci5sZW5ndGggJiYgJ21NJy5pbmNsdWRlcyhwYXRoLnNlZ21lbnRzWzBdWzBdKTtcbn1cbiJdfQ==