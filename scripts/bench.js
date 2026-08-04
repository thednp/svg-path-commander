"use strict";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import SVGPathCommander from "../dist/index.js";
import SvgPath from "./svgpath/svgpath.js";
import svgPathBbox from "./svgpath/svg-path-bbox.js";
import samplePath from "./sample-path.js";

const RUNS = 10;
const WARMUP = 3;
const SVGPATH_VERSION = "2.6.0";
const SVGPATH_BBOX_VERSION = "2.1.0";

const bench = (fn) => {
  for (let i = 0; i < WARMUP; i += 1) fn();
  const timings = [];
  for (let i = 0; i < RUNS; i += 1) {
    const t0 = new Date().getTime();
    fn();
    timings.push(new Date().getTime() - t0);
  }
  timings.sort((a, b) => a - b);
  const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
  return { avg, best: timings[0] };
};

const results = {};
console.log("\n\nStarting SVGPathCommander Benchmarks...");


{
  // console.log("\n\nSVGPathCommander static");
  const cmdInstance1 = SVGPathCommander.parsePathString(samplePath);
  const r = bench(() => SVGPathCommander.parsePathString(samplePath));
  // console.log("parse duration: %dms avg / %dms best", r.avg, r.best);
  results.parse = { static: r };
  const r2 = bench(() => SVGPathCommander.getPathBBox(cmdInstance1));
  // console.log("bbox duration: %dms avg / %dms best", r2.avg, r2.best);
  results.bbox = { static: r2 };
  const r3 = bench(() => SVGPathCommander.transformPath(cmdInstance1, { scale: 0.8 }));
  // console.log("transform2d duration: %dms avg / %dms best", r3.avg, r3.best);
  results.transform2d = { static: r3 };
  const r3b = bench(() => SVGPathCommander.transformPath(cmdInstance1, { rotate: [15, 15, 30] }));
  // console.log("transform3d duration: %dms avg / %dms best", r3b.avg, r3b.best);
  results.transform3d = { static: r3b };
  const transformed = SVGPathCommander.transformPath(cmdInstance1, { scale: 0.8 });
  const r4 = bench(() => SVGPathCommander.pathToString(transformed));
  // console.log("string duration: %dms avg / %dms best", r4.avg, r4.best);
  results.string = { static: r4 };
}
{
  // console.log("\nSVGPathCommander instance");
  const r = bench(() => new SVGPathCommander(samplePath));
  // console.log("parse duration: %dms avg / %dms best", r.avg, r.best);
  results.parse.instance = r;
  const inst = new SVGPathCommander(samplePath);
  const r2 = bench(() => inst.getBBox());
  // console.log("bbox duration: %dms avg / %dms best", r2.avg, r2.best);
  results.bbox.instance = r2;
  const inst2 = new SVGPathCommander(samplePath);
  const r3 = bench(() => inst2.transform({ scale: 0.8 }));
  // console.log("transform2d duration: %dms avg / %dms best", r3.avg, r3.best);
  results.transform2d.instance = r3;
  const r3b = bench(() => inst2.transform({ rotate: [15, 15, 30] }));
  // console.log("transform3d duration: %dms avg / %dms best", r3b.avg, r3b.best);
  results.transform3d.instance = r3b;
  const r4 = bench(() => inst2.toString());
  // console.log("string duration: %dms avg / %dms best", r4.avg, r4.best);
  results.string.instance = r4;
  inst.dispose();
  inst2.dispose();
}
{
  // console.log("\nSVGPath");
  const r = bench(() => SvgPath(samplePath));
  // console.log("parse duration: %dms avg / %dms best", r.avg, r.best);
  results.parse.svgpath = r;
  const svgInstance = SvgPath(samplePath);
  const r2 = bench(() => svgPathBbox(svgInstance));
  // console.log("bbox duration: %dms avg / %dms best", r2.avg, r2.best);
  results.bbox.svgpath = r2;
  const svgInstance2 = SvgPath(samplePath);
  const r3 = bench(() => svgInstance2.scale(0.8).__evaluateStack());
  // console.log("transform2d duration: %dms avg / %dms best", r3.avg, r3.best);
  results.transform2d.svgpath = r3;
  // console.log("transform3d duration: not supported by svgpath");
  results.transform3d.svgpath = null;
  const r4 = bench(() => svgInstance2.toString());
  // console.log("string duration: %dms avg / %dms best", r4.avg, r4.best);
  results.string.svgpath = r4;

  // console.log("path segments count: %d\n\n", svgInstance2.segments.length);
}
console.log("\n\nShowing results...");


const format = (v) => (Math.round(v * 10) / 10).toString();
const cell = (r) => (r ? `${format(r.avg)} / ${format(r.best)}` : "n/a");
const bold = (v) => `**${v}**`;
const ratio = (a, b) => (a && b ? `${Math.round((a.avg / b.avg) * 10) / 10}x` : "n/a");

const rows = (mode) =>
  Object.keys(results)
    .map((op) => {
      const ours = results[op][mode];
      const theirs = results[op].svgpath;
      const weWin = !theirs || ours.avg < theirs.avg;
      const ratioValue = ratio(ours, theirs);
      const boldRatio = !!theirs && ours.avg < theirs.avg;
      return `| ${op} | ${weWin ? bold(cell(ours)) : cell(ours)} | ${cell(theirs)} | ${boldRatio ? bold(ratioValue) : ratioValue} |`;
    })
    .join("\n");

const table = `# Performance

A comparison of **SVGPathCommander** with the [SvgPath](https://github.com/fontello/svgpath) library v${SVGPATH_VERSION} and its [svg-path-bbox](https://github.com/fontello/svg-path-bbox) helper v${SVGPATH_BBOX_VERSION}, run with \`pnpm bench\` against a sample path with \`${SVGPathCommander.parsePathString(samplePath).length}\` path segments. All values are in **milliseconds**, reported as \`avg / best\` over ${RUNS} runs after ${WARMUP} warmups; lower is better. The \`vs svgpath\` column is the \`avg\` ratio of SVGPathCommander to svgpath.

\`transform2d\` uses \`{ scale: 0.8 }\`, \`transform3d\` uses \`{ rotate: [15, 15, 30] }\`. [SvgPath](https://github.com/fontello/svgpath) only supports 2D transforms, so \`transform3d\` is marked \`n/a\` for it.

## Static methods

| Operation | SVGPathCommander (static) | svgpath | vs svgpath |
| --- | --- | --- | --- |
${rows("static")}

## Instance methods

| Operation | SVGPathCommander (instance) | svgpath | vs svgpath |
| --- | --- | --- | --- |
${rows("instance")}

Last benchmark run on \`${new Date().toISOString().slice(0, 10)}\`. Generated by [\`scripts/bench.js\`](scripts/bench.js); update with \`pnpm bench\`.`;

console.table(results);

const MARK_START = "<!-- BENCH:start -->";
const MARK_END = "<!-- BENCH:end -->";
const README = resolve(dirname(fileURLToPath(import.meta.url)), "../README.md");
const readme = readFileSync(README, "utf8");
const content = `${MARK_START}\n${table}\n${MARK_END}`;
const start = readme.indexOf(MARK_START);
if (start !== -1) {
  const end = readme.indexOf(MARK_END);
  writeFileSync(README, `${readme.slice(0, start)}${content}${readme.slice(end + MARK_END.length)}`, "utf8");
} else {
  const anchor = "# Special Thanks";
  const pos = readme.indexOf(anchor);
  if (pos === -1) throw new Error(`README.md: "${anchor}" anchor not found`);
  writeFileSync(README, `${readme.slice(0, pos)}${content}\n\n\n${readme.slice(pos)}`, "utf8");
}
console.log("README.md benchmark table updated");
