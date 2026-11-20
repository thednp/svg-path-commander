"use strict";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import SVGPathCommander from "../dist/index.js";
import SvgPath from "./svgpath/svgpath.js";
import svgPathBbox from "./svgpath/svg-path-bbox.js";
import samplePath from "./sample-path.js";

const RUNS = 30;
const WARMUP = 5;
const SVGPATH_VERSION = "2.6.0";
const SVGPATH_BBOX_VERSION = "2.1.0";
// the README is only rewritten when the flag is passed, a benchmark run
// should never leave the working tree dirty on its own
const WRITE = process.argv.slice(2).includes("--write");

const bench = (fn) => {
  for (let i = 0; i < WARMUP; i += 1) fn();
  const timings = [];
  for (let i = 0; i < RUNS; i += 1) {
    const t0 = performance.now();
    fn();
    timings.push(performance.now() - t0);
  }
  timings.sort((a, b) => a - b);
  // the median is the value that is not skewed by a single slow run
  const median = timings[Math.floor(timings.length / 2)];
  return { median, best: timings[0] };
};

const results = {};
console.log("\n\nStarting SVGPathCommander Benchmarks...");

{
  // console.log("\n\nSVGPathCommander static");
  const cmdInstance1 = SVGPathCommander.parsePathString(samplePath);
  const r = bench(() => SVGPathCommander.parsePathString(samplePath));
  // console.log("parse duration: %dms median / %dms best", r.median, r.best);
  results.parse = { static: r };
  const r2 = bench(() => SVGPathCommander.getPathBBox(cmdInstance1));
  // console.log("bbox duration: %dms median / %dms best", r2.median, r2.best);
  results.bbox = { static: r2 };
  const r3 = bench(() => SVGPathCommander.transformPath(cmdInstance1, { scale: 0.8 }));
  // console.log("transform2d duration: %dms median / %dms best", r3.median, r3.best);
  results.transform2d = { static: r3 };
  const r3b = bench(() => SVGPathCommander.transformPath(cmdInstance1, { rotate: [15, 15, 30] }));
  // console.log("transform3d duration: %dms median / %dms best", r3b.median, r3b.best);
  results.transform3d = { static: r3b };
  const transformed = SVGPathCommander.transformPath(cmdInstance1, { scale: 0.8 });
  const r4 = bench(() => SVGPathCommander.pathToString(transformed));
  // console.log("string duration: %dms median / %dms best", r4.median, r4.best);
  results.string = { static: r4 };
}
{
  // console.log("\nSVGPathCommander instance");
  const r = bench(() => new SVGPathCommander(samplePath));
  // console.log("parse duration: %dms median / %dms best", r.median, r.best);
  results.parse.instance = r;
  const inst = new SVGPathCommander(samplePath);
  const r2 = bench(() => inst.getBBox());
  // console.log("bbox duration: %dms median / %dms best", r2.median, r2.best);
  results.bbox.instance = r2;
  const inst2 = new SVGPathCommander(samplePath);
  const r3 = bench(() => inst2.transform({ scale: 0.8 }));
  // console.log("transform2d duration: %dms median / %dms best", r3.median, r3.best);
  results.transform2d.instance = r3;
  const r3b = bench(() => inst2.transform({ rotate: [15, 15, 30] }));
  // console.log("transform3d duration: %dms median / %dms best", r3b.median, r3b.best);
  results.transform3d.instance = r3b;
  const r4 = bench(() => inst2.toString());
  // console.log("string duration: %dms median / %dms best", r4.median, r4.best);
  results.string.instance = r4;
  inst.dispose();
  inst2.dispose();
}
{
  // console.log("\nSVGPath");
  const r = bench(() => SvgPath(samplePath));
  // console.log("parse duration: %dms median / %dms best", r.median, r.best);
  results.parse.svgpath = r;
  const svgInstance = SvgPath(samplePath);
  const r2 = bench(() => svgPathBbox(svgInstance));
  // console.log("bbox duration: %dms median / %dms best", r2.median, r2.best);
  results.bbox.svgpath = r2;
  const svgInstance2 = SvgPath(samplePath);
  const r3 = bench(() => svgInstance2.scale(0.8).__evaluateStack());
  // console.log("transform2d duration: %dms median / %dms best", r3.median, r3.best);
  results.transform2d.svgpath = r3;
  // console.log("transform3d duration: not supported by svgpath");
  results.transform3d.svgpath = null;
  const r4 = bench(() => svgInstance2.toString());
  // console.log("string duration: %dms median / %dms best", r4.median, r4.best);
  results.string.svgpath = r4;

  // console.log("path segments count: %d\n\n", svgInstance2.segments.length);
}
console.log("\n\nShowing results...");

const format = (v) => (Math.round(v * 10) / 10).toString();
const cell = (r) => (r ? format(r.median) : "n/a");
const best = (r) => (r ? format(r.best) : "n/a");
const bold = (v) => `**${v}**`;
const ratio = (a, b) => (a && b ? `${Math.round((a.median / b.median) * 10) / 10}x` : "n/a");

const headers = [
  "Operation",
  "SVGPathCommander median",
  "SVGPathCommander best",
  "svgpath median",
  "svgpath best",
  "vs svgpath",
];

const rows = (mode) =>
  Object.keys(results).map((op) => {
    const ours = results[op][mode];
    const theirs = results[op].svgpath;
    const weWin = !theirs || ours.median < theirs.median;
    const ratioValue = ratio(ours, theirs);
    const boldRatio = !!theirs && ours.median < theirs.median;
    return [
      op,
      weWin ? bold(cell(ours)) : cell(ours),
      best(ours),
      cell(theirs),
      best(theirs),
      boldRatio ? bold(ratioValue) : ratioValue,
    ];
  });

// a markdown table with the columns padded to the same width
const table = (rows) => {
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => row[index].length)),
  );
  const line = (cells) =>
    `| ${cells.map((cell, index) => cell.padEnd(widths[index])).join(" | ")} |`;
  const separator = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
  return [line(headers), separator, ...rows.map(line)].join("\n");
};

const staticRows = rows("static");
const instanceRows = rows("instance");

const content = `# Performance

A comparison of **SVGPathCommander** with the [SvgPath](https://github.com/fontello/svgpath) library v${SVGPATH_VERSION} and its [svg-path-bbox](https://github.com/fontello/svg-path-bbox) helper v${SVGPATH_BBOX_VERSION}, run with \`vpr bench\` against a sample path with \`${SVGPathCommander.parsePathString(samplePath).length}\` path segments. All values are in **milliseconds**, reported as the **median** and the **best** of ${RUNS} runs after ${WARMUP} warmups; lower is better. The \`vs svgpath\` column is the median ratio of SVGPathCommander to svgpath.

\`transform2d\` uses \`{ scale: 0.8 }\`, \`transform3d\` uses \`{ rotate: [15, 15, 30] }\`. [SvgPath](https://github.com/fontello/svgpath) only supports 2D transforms, so \`transform3d\` is marked \`n/a\` for it.

## Static methods

${table(staticRows)}

## Instance methods

${table(instanceRows)}

Last benchmark run on \`${new Date().toISOString().slice(0, 10)}\`. Generated by [\`scripts/bench.js\`](scripts/bench.js); update with \`vpr bench --write\`.`;

console.table(results);
console.log(`\n${content}\n`);

if (!WRITE) {
  console.log("README.md left untouched, pass --write to update it");
} else {
  const MARK_START = "<!-- BENCH:start -->";
  const MARK_END = "<!-- BENCH:end -->";
  const README = resolve(dirname(fileURLToPath(import.meta.url)), "../README.md");
  const readme = readFileSync(README, "utf8");
  const block = `${MARK_START}\n\n${content}\n\n${MARK_END}`;
  const start = readme.indexOf(MARK_START);
  if (start !== -1) {
    const end = readme.indexOf(MARK_END);
    writeFileSync(
      README,
      `${readme.slice(0, start)}${block}${readme.slice(end + MARK_END.length)}`,
      "utf8",
    );
  } else {
    const anchor = "# Special Thanks";
    const pos = readme.indexOf(anchor);
    if (pos === -1) throw new Error(`README.md: "${anchor}" anchor not found`);
    writeFileSync(README, `${readme.slice(0, pos)}${block}\n\n\n${readme.slice(pos)}`, "utf8");
  }
  console.log("README.md benchmark table updated");
}
