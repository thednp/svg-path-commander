function cov_1qu71cwxu2() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\finalizeSegment.js";
  var hash = "bc5def28202aa88588df48288a8fe0127cee6456";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\parser\\finalizeSegment.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 20
        },
        end: {
          line: 9,
          column: 53
        }
      },
      "1": {
        start: {
          line: 10,
          column: 11
        },
        end: {
          line: 10,
          column: 36
        }
      },
      "2": {
        start: {
          line: 11,
          column: 17
        },
        end: {
          line: 11,
          column: 21
        }
      },
      "3": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 20,
          column: 3
        }
      },
      "4": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 56
        }
      },
      "5": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 25
        }
      },
      "6": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 13
        }
      },
      "7": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 19,
          column: 50
        }
      },
      "8": {
        start: {
          line: 23,
          column: 2
        },
        end: {
          line: 31,
          column: 3
        }
      },
      "9": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 74
        }
      },
      "10": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 30,
          column: 5
        }
      },
      "11": {
        start: {
          line: 29,
          column: 6
        },
        end: {
          line: 29,
          column: 12
        }
      }
    },
    fnMap: {
      "0": {
        name: "finalizeSegment",
        decl: {
          start: {
            line: 8,
            column: 24
          },
          end: {
            line: 8,
            column: 39
          }
        },
        loc: {
          start: {
            line: 8,
            column: 46
          },
          end: {
            line: 32,
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
            line: 14,
            column: 2
          },
          end: {
            line: 20,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 20,
            column: 3
          }
        }, {
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 20,
            column: 3
          }
        }],
        line: 14
      },
      "1": {
        loc: {
          start: {
            line: 14,
            column: 6
          },
          end: {
            line: 14,
            column: 35
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 14,
            column: 6
          },
          end: {
            line: 14,
            column: 16
          }
        }, {
          start: {
            line: 14,
            column: 20
          },
          end: {
            line: 14,
            column: 35
          }
        }],
        line: 14
      },
      "2": {
        loc: {
          start: {
            line: 19,
            column: 18
          },
          end: {
            line: 19,
            column: 49
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 19,
            column: 40
          },
          end: {
            line: 19,
            column: 43
          }
        }, {
          start: {
            line: 19,
            column: 46
          },
          end: {
            line: 19,
            column: 49
          }
        }],
        line: 19
      },
      "3": {
        loc: {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        }, {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        }],
        line: 28
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
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "bc5def28202aa88588df48288a8fe0127cee6456"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1qu71cwxu2 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1qu71cwxu2();
import paramsCount from './paramsCount';
/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */

export default function finalizeSegment(path) {
  cov_1qu71cwxu2().f[0]++;
  let pathCommand = (cov_1qu71cwxu2().s[0]++, path.pathValue[path.segmentStart]);
  let LK = (cov_1qu71cwxu2().s[1]++, pathCommand.toLowerCase());
  let {
    data
  } = (cov_1qu71cwxu2().s[2]++, path); // Process duplicated commands (without comand name)

  cov_1qu71cwxu2().s[3]++;

  if ((cov_1qu71cwxu2().b[1][0]++, LK === 'm') && (cov_1qu71cwxu2().b[1][1]++, data.length > 2)) {
    cov_1qu71cwxu2().b[0][0]++;
    cov_1qu71cwxu2().s[4]++;
    // @ts-ignore
    path.segments.push([pathCommand, data[0], data[1]]);
    cov_1qu71cwxu2().s[5]++;
    data = data.slice(2);
    cov_1qu71cwxu2().s[6]++;
    LK = 'l';
    cov_1qu71cwxu2().s[7]++;
    pathCommand = pathCommand === 'm' ? (cov_1qu71cwxu2().b[2][0]++, 'l') : (cov_1qu71cwxu2().b[2][1]++, 'L');
  } else {
    cov_1qu71cwxu2().b[0][1]++;
  } // @ts-ignore


  cov_1qu71cwxu2().s[8]++;

  while (data.length >= paramsCount[LK]) {
    cov_1qu71cwxu2().s[9]++;
    // path.segments.push([pathCommand].concat(data.splice(0, paramsCount[LK])));
    // @ts-ignore
    path.segments.push([pathCommand, ...data.splice(0, paramsCount[LK])]); // @ts-ignore

    cov_1qu71cwxu2().s[10]++;

    if (!paramsCount[LK]) {
      cov_1qu71cwxu2().b[3][0]++;
      cov_1qu71cwxu2().s[11]++;
      break;
    } else {
      cov_1qu71cwxu2().b[3][1]++;
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbmFsaXplU2VnbWVudC5qcyJdLCJuYW1lcyI6WyJwYXJhbXNDb3VudCIsImZpbmFsaXplU2VnbWVudCIsInBhdGgiLCJwYXRoQ29tbWFuZCIsInBhdGhWYWx1ZSIsInNlZ21lbnRTdGFydCIsIkxLIiwidG9Mb3dlckNhc2UiLCJkYXRhIiwibGVuZ3RoIiwic2VnbWVudHMiLCJwdXNoIiwic2xpY2UiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLE9BQU9BLFdBQVAsTUFBd0IsZUFBeEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLGVBQWUsU0FBU0MsZUFBVCxDQUF5QkMsSUFBekIsRUFBK0I7QUFBQTtBQUM1QyxNQUFJQyxXQUFXLDZCQUFHRCxJQUFJLENBQUNFLFNBQUwsQ0FBZUYsSUFBSSxDQUFDRyxZQUFwQixDQUFILENBQWY7QUFDQSxNQUFJQyxFQUFFLDZCQUFHSCxXQUFXLENBQUNJLFdBQVosRUFBSCxDQUFOO0FBQ0EsTUFBSTtBQUFFQyxJQUFBQTtBQUFGLGdDQUFXTixJQUFYLENBQUosQ0FINEMsQ0FLNUM7O0FBTDRDOztBQU01QyxNQUFJLDZCQUFBSSxFQUFFLEtBQUssR0FBUCxrQ0FBY0UsSUFBSSxDQUFDQyxNQUFMLEdBQWMsQ0FBNUIsQ0FBSixFQUFtQztBQUFBO0FBQUE7QUFDakM7QUFDQVAsSUFBQUEsSUFBSSxDQUFDUSxRQUFMLENBQWNDLElBQWQsQ0FBbUIsQ0FBQ1IsV0FBRCxFQUFjSyxJQUFJLENBQUMsQ0FBRCxDQUFsQixFQUF1QkEsSUFBSSxDQUFDLENBQUQsQ0FBM0IsQ0FBbkI7QUFGaUM7QUFHakNBLElBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDSSxLQUFMLENBQVcsQ0FBWCxDQUFQO0FBSGlDO0FBSWpDTixJQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUppQztBQUtqQ0gsSUFBQUEsV0FBVyxHQUFHQSxXQUFXLEtBQUssR0FBaEIsZ0NBQXNCLEdBQXRCLGlDQUE0QixHQUE1QixDQUFkO0FBQ0QsR0FORDtBQUFBO0FBQUEsR0FONEMsQ0FjNUM7OztBQWQ0Qzs7QUFlNUMsU0FBT0ssSUFBSSxDQUFDQyxNQUFMLElBQWVULFdBQVcsQ0FBQ00sRUFBRCxDQUFqQyxFQUF1QztBQUFBO0FBQ3JDO0FBQ0E7QUFDQUosSUFBQUEsSUFBSSxDQUFDUSxRQUFMLENBQWNDLElBQWQsQ0FBbUIsQ0FBQ1IsV0FBRCxFQUFjLEdBQUdLLElBQUksQ0FBQ0ssTUFBTCxDQUFZLENBQVosRUFBZWIsV0FBVyxDQUFDTSxFQUFELENBQTFCLENBQWpCLENBQW5CLEVBSHFDLENBSXJDOztBQUpxQzs7QUFLckMsUUFBSSxDQUFDTixXQUFXLENBQUNNLEVBQUQsQ0FBaEIsRUFBc0I7QUFBQTtBQUFBO0FBQ3BCO0FBQ0QsS0FGRDtBQUFBO0FBQUE7QUFHRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcmFtc0NvdW50IGZyb20gJy4vcGFyYW1zQ291bnQnO1xuXG4vKipcbiAqIEJyZWFrcyB0aGUgcGFyc2luZyBvZiBhIHBhdGhTdHJpbmcgb25jZSBhIHNlZ21lbnQgaXMgZmluYWxpemVkLlxuICpcbiAqIEBwYXJhbSB7U1ZHUGF0aC5QYXRoUGFyc2VyfSBwYXRoIHRoZSBgUGF0aFBhcnNlcmAgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluYWxpemVTZWdtZW50KHBhdGgpIHtcbiAgbGV0IHBhdGhDb21tYW5kID0gcGF0aC5wYXRoVmFsdWVbcGF0aC5zZWdtZW50U3RhcnRdO1xuICBsZXQgTEsgPSBwYXRoQ29tbWFuZC50b0xvd2VyQ2FzZSgpO1xuICBsZXQgeyBkYXRhIH0gPSBwYXRoO1xuXG4gIC8vIFByb2Nlc3MgZHVwbGljYXRlZCBjb21tYW5kcyAod2l0aG91dCBjb21hbmQgbmFtZSlcbiAgaWYgKExLID09PSAnbScgJiYgZGF0YS5sZW5ndGggPiAyKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHBhdGguc2VnbWVudHMucHVzaChbcGF0aENvbW1hbmQsIGRhdGFbMF0sIGRhdGFbMV1dKTtcbiAgICBkYXRhID0gZGF0YS5zbGljZSgyKTtcbiAgICBMSyA9ICdsJztcbiAgICBwYXRoQ29tbWFuZCA9IHBhdGhDb21tYW5kID09PSAnbScgPyAnbCcgOiAnTCc7XG4gIH1cblxuICAvLyBAdHMtaWdub3JlXG4gIHdoaWxlIChkYXRhLmxlbmd0aCA+PSBwYXJhbXNDb3VudFtMS10pIHtcbiAgICAvLyBwYXRoLnNlZ21lbnRzLnB1c2goW3BhdGhDb21tYW5kXS5jb25jYXQoZGF0YS5zcGxpY2UoMCwgcGFyYW1zQ291bnRbTEtdKSkpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBwYXRoLnNlZ21lbnRzLnB1c2goW3BhdGhDb21tYW5kLCAuLi5kYXRhLnNwbGljZSgwLCBwYXJhbXNDb3VudFtMS10pXSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICghcGFyYW1zQ291bnRbTEtdKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cbiJdfQ==