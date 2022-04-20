function cov_2asra6ppdj() {
  var path = "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\reverseCurve.js";
  var hash = "d2f1a2f8d11639dc15a0c9f2ffe6e7452a3402c6";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "D:\\! At Work\\5OpenSource\\svg-path-commander\\src\\process\\reverseCurve.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 23
        },
        end: {
          line: 14,
          column: 14
        }
      },
      "1": {
        start: {
          line: 10,
          column: 31
        },
        end: {
          line: 12,
          column: 54
        }
      },
      "2": {
        start: {
          line: 13,
          column: 16
        },
        end: {
          line: 13,
          column: 68
        }
      },
      "3": {
        start: {
          line: 13,
          column: 32
        },
        end: {
          line: 13,
          column: 67
        }
      },
      "4": {
        start: {
          line: 17,
          column: 2
        },
        end: {
          line: 18,
          column: 54
        }
      },
      "5": {
        start: {
          line: 18,
          column: 31
        },
        end: {
          line: 18,
          column: 51
        }
      }
    },
    fnMap: {
      "0": {
        name: "reverseCurve",
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
            line: 19,
            column: 1
          }
        },
        line: 8
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 10,
            column: 9
          },
          end: {
            line: 10,
            column: 10
          }
        },
        loc: {
          start: {
            line: 10,
            column: 31
          },
          end: {
            line: 12,
            column: 54
          }
        },
        line: 10
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 13,
            column: 9
          },
          end: {
            line: 13,
            column: 10
          }
        },
        loc: {
          start: {
            line: 13,
            column: 16
          },
          end: {
            line: 13,
            column: 68
          }
        },
        line: 13
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 13,
            column: 22
          },
          end: {
            line: 13,
            column: 23
          }
        },
        loc: {
          start: {
            line: 13,
            column: 32
          },
          end: {
            line: 13,
            column: 67
          }
        },
        line: 13
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 18,
            column: 24
          },
          end: {
            line: 18,
            column: 25
          }
        },
        loc: {
          start: {
            line: 18,
            column: 31
          },
          end: {
            line: 18,
            column: 51
          }
        },
        line: 18
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 10,
            column: 31
          },
          end: {
            line: 12,
            column: 54
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 11,
            column: 8
          },
          end: {
            line: 11,
            column: 44
          }
        }, {
          start: {
            line: 12,
            column: 8
          },
          end: {
            line: 12,
            column: 54
          }
        }],
        line: 10
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "d2f1a2f8d11639dc15a0c9f2ffe6e7452a3402c6"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2asra6ppdj = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2asra6ppdj();

/**
 * Reverses all segments of a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param {SVGPath.curveArray} path the source `pathArray`
 * @returns {SVGPath.curveArray} the reversed `pathArray`
 */
export default function reverseCurve(path) {
  cov_2asra6ppdj().f[0]++;
  const rotatedCurve = (cov_2asra6ppdj().s[0]++, path.slice(1).map((x, i, curveOnly) => {
    cov_2asra6ppdj().f[1]++;
    cov_2asra6ppdj().s[1]++;
    return !i ? (cov_2asra6ppdj().b[0][0]++, [...path[0].slice(1), ...x.slice(1)]) : (cov_2asra6ppdj().b[0][1]++, [...curveOnly[i - 1].slice(-2), ...x.slice(1)]);
  }).map(x => {
    cov_2asra6ppdj().f[2]++;
    cov_2asra6ppdj().s[2]++;
    return x.map((_, i) => {
      cov_2asra6ppdj().f[3]++;
      cov_2asra6ppdj().s[3]++;
      return x[x.length - i - 2 * (1 - i % 2)];
    });
  }).reverse()); // @ts-ignore -- expected on reverse operations

  cov_2asra6ppdj().s[4]++;
  return [['M', ...rotatedCurve[0].slice(0, 2)], ...rotatedCurve.map(x => {
    cov_2asra6ppdj().f[4]++;
    cov_2asra6ppdj().s[5]++;
    return ['C', ...x.slice(2)];
  })];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJldmVyc2VDdXJ2ZS5qcyJdLCJuYW1lcyI6WyJyZXZlcnNlQ3VydmUiLCJwYXRoIiwicm90YXRlZEN1cnZlIiwic2xpY2UiLCJtYXAiLCJ4IiwiaSIsImN1cnZlT25seSIsIl8iLCJsZW5ndGgiLCJyZXZlcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7OztBQWZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTQSxZQUFULENBQXNCQyxJQUF0QixFQUE0QjtBQUFBO0FBQ3pDLFFBQU1DLFlBQVksNkJBQUdELElBQUksQ0FBQ0UsS0FBTCxDQUFXLENBQVgsRUFDbEJDLEdBRGtCLENBQ2QsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQU9DLFNBQVAsS0FBc0I7QUFBQTtBQUFBO0FBQUEsWUFBQ0QsQ0FBRCxnQ0FDdkIsQ0FBQyxHQUFHTCxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVFFLEtBQVIsQ0FBYyxDQUFkLENBQUosRUFBc0IsR0FBR0UsQ0FBQyxDQUFDRixLQUFGLENBQVEsQ0FBUixDQUF6QixDQUR1QixpQ0FFdkIsQ0FBQyxHQUFHSSxTQUFTLENBQUNELENBQUMsR0FBRyxDQUFMLENBQVQsQ0FBaUJILEtBQWpCLENBQXVCLENBQUMsQ0FBeEIsQ0FBSixFQUFnQyxHQUFHRSxDQUFDLENBQUNGLEtBQUYsQ0FBUSxDQUFSLENBQW5DLENBRnVCO0FBRXVCLEdBSC9CLEVBSWxCQyxHQUprQixDQUliQyxDQUFELElBQU87QUFBQTtBQUFBO0FBQUEsV0FBQUEsQ0FBQyxDQUFDRCxHQUFGLENBQU0sQ0FBQ0ksQ0FBRCxFQUFJRixDQUFKLEtBQVU7QUFBQTtBQUFBO0FBQUEsYUFBQUQsQ0FBQyxDQUFDQSxDQUFDLENBQUNJLE1BQUYsR0FBV0gsQ0FBWCxHQUFlLEtBQUssSUFBS0EsQ0FBQyxHQUFHLENBQWQsQ0FBaEIsQ0FBRDtBQUFtQyxLQUFuRDtBQUFvRCxHQUo3QyxFQUtsQkksT0FMa0IsRUFBSCxDQUFsQixDQUR5QyxDQVF6Qzs7QUFSeUM7QUFTekMsU0FBTyxDQUFDLENBQUMsR0FBRCxFQUFNLEdBQUdSLFlBQVksQ0FBQyxDQUFELENBQVosQ0FBZ0JDLEtBQWhCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQVQsQ0FBRCxFQUNMLEdBQUdELFlBQVksQ0FBQ0UsR0FBYixDQUFrQkMsQ0FBRCxJQUFPO0FBQUE7QUFBQTtBQUFBLFlBQUMsR0FBRCxFQUFNLEdBQUdBLENBQUMsQ0FBQ0YsS0FBRixDQUFRLENBQVIsQ0FBVDtBQUFvQixHQUE1QyxDQURFLENBQVA7QUFFRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV2ZXJzZXMgYWxsIHNlZ21lbnRzIG9mIGEgYHBhdGhBcnJheWBcbiAqIHdoaWNoIGNvbnNpc3RzIG9mIG9ubHkgQyAoY3ViaWMtYmV6aWVyKSBwYXRoIGNvbW1hbmRzLlxuICpcbiAqIEBwYXJhbSB7U1ZHUGF0aC5jdXJ2ZUFycmF5fSBwYXRoIHRoZSBzb3VyY2UgYHBhdGhBcnJheWBcbiAqIEByZXR1cm5zIHtTVkdQYXRoLmN1cnZlQXJyYXl9IHRoZSByZXZlcnNlZCBgcGF0aEFycmF5YFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXZlcnNlQ3VydmUocGF0aCkge1xuICBjb25zdCByb3RhdGVkQ3VydmUgPSBwYXRoLnNsaWNlKDEpXG4gICAgLm1hcCgoeCwgaSwgY3VydmVPbmx5KSA9PiAoIWlcbiAgICAgID8gWy4uLnBhdGhbMF0uc2xpY2UoMSksIC4uLnguc2xpY2UoMSldXG4gICAgICA6IFsuLi5jdXJ2ZU9ubHlbaSAtIDFdLnNsaWNlKC0yKSwgLi4ueC5zbGljZSgxKV0pKVxuICAgIC5tYXAoKHgpID0+IHgubWFwKChfLCBpKSA9PiB4W3gubGVuZ3RoIC0gaSAtIDIgKiAoMSAtIChpICUgMikpXSkpXG4gICAgLnJldmVyc2UoKTtcblxuICAvLyBAdHMtaWdub3JlIC0tIGV4cGVjdGVkIG9uIHJldmVyc2Ugb3BlcmF0aW9uc1xuICByZXR1cm4gW1snTScsIC4uLnJvdGF0ZWRDdXJ2ZVswXS5zbGljZSgwLCAyKV0sXG4gICAgLi4ucm90YXRlZEN1cnZlLm1hcCgoeCkgPT4gWydDJywgLi4ueC5zbGljZSgyKV0pXTtcbn1cbiJdfQ==