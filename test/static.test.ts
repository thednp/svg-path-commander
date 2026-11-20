import { expect, test, describe, beforeEach, vi } from "vite-plus/test";
import CSSMatrix from "@thednp/dommatrix";
import SVGPathCommander, {
  type PathArray,
  type CurveArray,
  type ShapeTypes,
  PolylineArray,
} from "../src/index";
// import SVGPathCommanderUtil from '~/util';
import { invalidPathValue } from "../src/parser/invalidPathValue";
import { error } from "../src/util/error";
import { getRotatedPath, getRotations } from "../src/morph/getRotatedPath";
import { samplePolygon } from "../src/morph/samplePolygon";
import { getPathSplits } from "../src/morph/getPathSplits";
import { pathToPolyline } from "../src/morph/pathToPolyline";
import { splitCurvePathToCount } from "../src/morph/splitCurvePathToCount";
import { splitLinePathToCount } from "../src/morph/splitLinePathToCount";
import splitLineToCount from "../src/morph/splitLineToCount";
import { classifyPaths } from "../src/morph/classifyPaths";
import { matchPaths } from "../src/morph/matchPaths";
import { getPolyPath } from "../src/util/shapeToPathArray";
import { iterate } from "../src/process/iterate";
import { distanceToSegment } from "../src/math/distanceToSegment";
import type {
  CSegment,
  IntersectionPoint,
  LSegment,
  MorphPathArray,
  NormalArray,
  PathFeature,
} from "../src/types";
import type { SegmentProperties } from "../src/interface";

import getMarkup from "./fixtures/getMarkup";
import simpleShapes from "./fixtures/simpleShapes";
import shapes from "./fixtures/shapes";
import shapeObjects from "./fixtures/shapeObjects";
import { intersectionFixtures, equalizeFixtures } from "./fixtures/intersectionEqualize";
import {
  buildReverseCase,
  commandSequences,
  expectedReverse,
  sameGeometry,
} from "./fixtures/reversePathMatrix";

import "../docs/assets/style.css";
import { defaultOptions } from "../src/options/options";

/**
 * Returns the segment metadata of a segment lookup, without the frame.
 */
const segmentMeta = (properties?: SegmentProperties) => {
  if (!properties) return undefined;
  const { segment, index, length, lengthAtSegment } = properties;
  return { segment, index, length, lengthAtSegment };
};

/**
 * Compares two points, with a tolerance for the last bits of the floats.
 */
const expectPointClose = (actual: { x: number; y: number }, expected: { x: number; y: number }) => {
  expect(actual.x).to.be.closeTo(expected.x, 1e-9);
  expect(actual.y).to.be.closeTo(expected.y, 1e-9);
};

describe("SVGPathCommander Static Methods", () => {
  const wrapper = document.createElement("div");
  document.body.append(wrapper);

  beforeEach(async () => {
    wrapper.innerHTML = "";
  });

  test("Convert shape to path with incomplete values should return false", () => {
    const shapes = ["line", "circle", "ellipse", "rect", "polygon", "polyline", "glyph"] as const;
    shapes.forEach((SHAPE) => {
      expect(
        // @ts-expect-error
        SVGPathCommander.shapeToPath({ type: SHAPE, fill: "red" }),
        `${SHAPE} with no specific attributes`,
      ).to.be.false;
    });
  });

  test("Convert shape to pathArray with incomplete values should return false", () => {
    const shapes: string[] = [
      "line",
      "circle",
      "ellipse",
      "rect",
      "polygon",
      "polyline",
      "glyph",
    ] as const;
    shapes.forEach((SHAPE) => {
      expect(
        // @ts-expect-error
        SVGPathCommander.shapeToPathArray({ type: SHAPE, fill: "red" }),
        `${SHAPE} with no specific attributes`,
      ).to.be.false;
    });
  });

  test(`Throws error when invalid path value`, () => {
    const { parsePathString } = SVGPathCommander;
    try {
      parsePathString("10 50q15 -25");
      // console.log(path);
    } catch (e) {
      // console.log(e)
      expect(e).to.be.instanceOf(TypeError);
      expect(e).to.have.property(
        "message",
        `${error}: Invalid path value "1" is not a path command at index 0`,
      );
    }
  });

  ["wombat", "line", "circle", "ellipse", "rect", "polygon", "polyline", "glyph", "path"].forEach(
    (SHAPE) => {
      test(`Convert <${SHAPE}> to path`, async () => {
        wrapper.append(getMarkup());
        await vi.waitFor(() => wrapper.querySelector("svg") as SVGElement, { timeout: 200 });
        const svg = await vi.waitFor(() => wrapper.querySelector("svg") as SVGElement, {
          timeout: 200,
        });
        svg.setAttribute("viewBox", "0 0 182 72");
        svg.innerHTML = `<line id="line" x1="0" y1="0" x2="182" y2="72" stroke="turquoise" stroke-width="2" />
          <circle id="circle" cx="27.5" cy="36.9" r="23.5" fill="orangered"/>
          <ellipse id="ellipse" cx="68.3" cy="37" rx="15.1" fill="darkorange"/>
          <wombat id="wombat" fill="black"/>
          <polygon id="polygon" points="107.4,13 113.7,28.8 127.9,31.3 117.6,43.5 120.1,60.8 107.4,52.6 94.6,60.8 97.1,43.5 86.8,31.3 101,28.8" fill="yellow"/>
          <polyline id="polyline" points="107.39,17.78 112.43,30.42 123.79,32.42 115.55,42.18 117.55,56.02 107.39,49.46 97.15,56.02 99.15,42.18 90.91,32.42 102.27,30.42" fill="none" stroke="black" stroke-width="2"/>
          <rect id="rect" x="131" y="13.2" width="47.5" height="47.6" rx="25" fill="yellowgreen"/>
          <path id="path" d="M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3" fill="rgba(255,255,255,0.3)"/>
          <glyph id="glyph" d="M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3" fill="rgba(255,255,255,0.3)"/>`;

        const shape = await vi.waitFor(() => wrapper.querySelector(SHAPE) as SVGElement, {
          timeout: 200,
        });
        if (SHAPE === "wombat") {
          try {
            SVGPathCommander.shapeToPathArray(shape as unknown as SVGCircleElement);
          } catch (er) {
            expect(er).to.be.instanceOf(TypeError);
            expect(er).to.have.property("message", `${error}: "${SHAPE}" is not SVGElement`);
          }
          try {
            SVGPathCommander.shapeToPath(
              shape as unknown as SVGCircleElement,
              true,
              shape.ownerDocument,
            );
          } catch (er) {
            expect(er).to.be.instanceOf(TypeError);
            expect(er).to.have.property("message", `${error}: "${SHAPE}" is not SVGElement`);
          }
        } else if (SHAPE === "path") {
          try {
            SVGPathCommander.shapeToPath(
              shape as unknown as SVGCircleElement,
              true,
              shape.ownerDocument,
            );
          } catch (er) {
            expect(er).to.be.instanceOf(TypeError);
            expect(er).to.have.property(
              "message",
              `${error}: "${SHAPE}" is already SVGPathElement`,
            );
          }
        } else {
          SVGPathCommander.shapeToPath(shape as unknown as ShapeTypes, true, shape.ownerDocument);
          expect(svg.querySelector(SHAPE)).to.not.exist;
          expect(svg.querySelector(`#${SHAPE}`)).to.exist;
          expect(svg.querySelector(`#${SHAPE}`)?.getAttribute("d")).to.have.length.greaterThan(0);
        }
      });
    },
  );

  shapeObjects.forEach((SHAPE) => {
    test(`Convert "${SHAPE.type}" Object to pathArray`, () => {
      expect(
        SVGPathCommander.shapeToPathArray(SHAPE as unknown as ShapeTypes),
      ).to.have.length.greaterThan(0);
    });
  });

  test(`Convert <wombat> Object to pathArray should throw error`, () => {
    try {
      SVGPathCommander.shapeToPathArray({ type: "wombat", fill: "red" } as unknown as ShapeTypes);
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property("message", `${error}: "wombat" is not SVGElement`);
    }
  });

  shapeObjects.forEach((SHAPE) => {
    test(`Convert "${SHAPE.type}" Object to path`, async () => {
      wrapper.append(getMarkup());
      await vi.waitFor(() => wrapper.querySelector("svg") as SVGElement, { timeout: 200 });
      const svg = await vi.waitFor(() => wrapper.querySelector("svg") as SVGElement, {
        timeout: 200,
      });
      svg.setAttribute("viewBox", "0 0 182 72");

      svg.append(SVGPathCommander.shapeToPath(SHAPE as unknown as ShapeTypes) as SVGPathElement);
      const shape = svg.querySelector(`#${SHAPE.type}`);
      expect(shape).to.exist;
      expect(shape?.getAttribute("d")).to.have.length.greaterThan(0);
    });
  });

  simpleShapes.normalized.forEach((SHAPE, i) => {
    test(`Can do optimizePath #${i}`, () => {
      const path = new SVGPathCommander(SHAPE);

      expect(path.optimize().toString()).to.equal(simpleShapes.initial[i]);
    });
  });

  test(`Can disable round, use a given decimal amount or revert back to default round option`, () => {
    const sample = [
      ["M", 0, 0],
      ["L", 181.99955, 0],
      ["L", 91, 72],
      ["L", 0, 0],
      ["Z"],
    ] as PathArray;
    const rounded = [
      ["M", 0, 0],
      ["L", 181.9996, 0],
      ["L", 91, 72],
      ["L", 0, 0],
      ["Z"],
    ] as PathArray;

    expect(SVGPathCommander.roundPath(sample, 4), `can use number setting`).to.deep.equal(rounded);
    expect(SVGPathCommander.roundPath(sample, "off"), `can use "off" setting`).to.deep.equal(
      sample,
    );
    expect(
      SVGPathCommander.roundPath(sample, -1),
      `use 4 decimals when negative number is provided`,
    ).to.deep.equal(rounded);
    expect(
      // @ts-expect-error
      SVGPathCommander.roundPath(sample, "wombat"),
      `use 4 decimals when string is provided`,
    ).to.deep.equal(rounded);
  });

  test(`Can do reverseCurve`, () => {
    const path = new SVGPathCommander(simpleShapes.normalized[1]);
    const pathReversed = new SVGPathCommander(simpleShapes.normalized[1]).reverse();
    const reversed = [
      ["M", 170, 90],
      ["C", 150, 90, 155, 10, 130, 10],
      ["C", 105, 10, 110, 90, 90, 90],
      ["C", 70, 90, 75, 10, 50, 10],
      ["C", 25, 10, 30, 90, 10, 90],
    ];

    expect(pathReversed.segments).to.deep.equal(reversed);
    expect(SVGPathCommander.reverseCurve(pathReversed.segments as CurveArray)).to.deep.equal(
      path.segments,
    );
  });

  test(`Can do reversePath`, () => {
    const path = new SVGPathCommander(simpleShapes.normalized[2]);
    const pathReversed = new SVGPathCommander(simpleShapes.normalized[2]).reverse();
    const reversed = [
      ["M", 190, 50],
      ["Q", 175, 75, 160, 50],
      ["Q", 145, 25, 130, 50],
      ["Q", 115, 75, 100, 50],
      ["Q", 85, 25, 70, 50],
      ["Q", 55, 75, 40, 50],
      ["Q", 25, 25, 10, 50],
    ];

    expect(pathReversed.segments).to.deep.equal(reversed);
    expect(SVGPathCommander.reversePath(pathReversed.segments)).to.deep.equal(path.segments);
  });

  test(`Can transformPath with arc segments`, () => {
    const { transformPath, pathToString, reversePath } = SVGPathCommander;

    // This test assumes **SVGPathCommander** static method can work with default
    // transform origin *{0,0,0}* when no origin is provided in the **transformObject**.
    // The test also shows how Arc segments are converted to CubicBezier for transformation.
    const path = pathToString(transformPath(simpleShapes.initial[3], { rotate: 45 }));
    expect(path).to.equal(
      "M-2.8284 11.3137C-6.3778 10.7769 -7.6385 14.9238 -5.0977 18.7783C-2.5569 22.6327 1.8798 23.3038 2.8884 19.9862C3.153 19.1158 3.1321 18.0645 2.8284 16.9706M-2.8284 11.3137C-3.9859 7.1438 -0.9528 4.7691 2.631 7.0393C6.2148 9.3095 7.6616 14.5219 5.2352 16.4216C4.5986 16.92 3.7596 17.1114 2.8284 16.9706M-2.8284 11.3137C-0.4208 11.6779 2.0433 14.1419 2.8284 16.9706M-2.8284 11.3137C-2.0433 14.1423 0.4208 16.6064 2.8284 16.9706",
    );

    const path1 = pathToString(transformPath(simpleShapes.initial[3], { rotate: -45 }));
    expect(path1).to.equal(
      "M11.3137 2.8284C10.7769 6.3778 14.9238 7.6385 18.7783 5.0977C22.6327 2.5569 23.3038 -1.8798 19.9862 -2.8884C19.1158 -3.153 18.0645 -3.1321 16.9706 -2.8284M11.3137 2.8284C7.1438 3.9859 4.7691 0.9528 7.0393 -2.631C9.3095 -6.2148 14.5219 -7.6616 16.4216 -5.2352C16.92 -4.5986 17.1114 -3.7596 16.9706 -2.8284M11.3137 2.8284C11.6779 0.4208 14.1419 -2.0433 16.9706 -2.8284M11.3137 2.8284C14.1423 2.0433 16.6064 -0.4208 16.9706 -2.8284",
    );

    const path2 = pathToString(transformPath(reversePath(simpleShapes.initial[3]), { rotate: 45 }));
    expect(path2).to.equal(
      "M2.8284 16.9706C3.9859 21.1405 0.9528 23.5152 -2.631 21.245C-6.2148 18.9748 -7.6616 13.7624 -5.2352 11.8626C-4.5986 11.3642 -3.7596 11.1729 -2.8284 11.3137M2.8284 16.9706C6.3778 17.5074 7.6385 13.3604 5.0977 9.506C2.5569 5.6516 -1.8798 4.9805 -2.8884 8.2981C-3.153 9.1684 -3.1321 10.2198 -2.8284 11.3137M2.8284 16.9706C2.0433 14.1419 -0.4208 11.6779 -2.8284 11.3137M2.8284 16.9706C0.4208 16.6064 -2.0433 14.1423 -2.8284 11.3137",
    );

    const path3 = pathToString(
      transformPath(reversePath(simpleShapes.initial[3]), { rotate: -45 }),
    );
    expect(path3).to.equal(
      "M16.9706 -2.8284C21.1405 -3.9859 23.5152 -0.9528 21.245 2.631C18.9748 6.2148 13.7624 7.6616 11.8626 5.2352C11.3642 4.5986 11.1729 3.7596 11.3137 2.8284M16.9706 -2.8284C17.5074 -6.3778 13.3604 -7.6385 9.506 -5.0977C5.6516 -2.5569 4.9805 1.8798 8.2981 2.8884C9.1684 3.153 10.2198 3.1321 11.3137 2.8284M16.9706 -2.8284C14.1419 -2.0433 11.6779 0.4208 11.3137 2.8284M16.9706 -2.8284C16.6064 -0.4208 14.1423 2.0433 11.3137 2.8284",
    );
  });

  test(`Can transformPath a PathArray with a relative first command`, () => {
    const { transformPath } = SVGPathCommander;

    const path = transformPath(
      [["m", 10, 10], ["l", 20, 0], ["l", 0, 20], ["z"]] as unknown as PathArray,
      { translate: [5, 7] },
    );
    // a leading relative moveto is a pair of absolute coordinates, so it is
    // rewritten as an absolute one
    expect(path).to.deep.equal([["M", 15, 17], ["H", 35], ["V", 37], ["Z"]]);
  });

  test(`Can do getPropertiesAtLength`, () => {
    try {
      SVGPathCommander.getPropertiesAtLength(
        "M16.9706 -2.8284A4 6 89.5025 0 1 11.3137 2.8284M",
        50,
      );
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property(
        "message",
        `${error}: ${invalidPathValue} at index 48, "pathValue" is missing param`,
      );
    }

    const props0 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 0);
    // cy.log(props50)
    expect(props0.index).to.equal(0);
    expect(props0.lengthAtSegment).to.equal(0);
    expect(props0.segment).to.deep.equal(["M", 10, 10]);

    const props50 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 50);
    // cy.log(props50)
    expect(props50.index).to.equal(1);
    expect(props50.lengthAtSegment).to.equal(0);
    expect(props50.segment).to.deep.equal(["l", 80, 80]);

    const props400 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 400);
    // cy.log(props50)
    expect(props400.index).to.equal(3);
    expect(props400.lengthAtSegment).to.equal(193.1370849898476);
    expect(props400.segment).to.deep.equal(["H", 50]);
  });

  test(`Can do getPropertiesAtPoint`, () => {
    const { getPropertiesAtPoint } = SVGPathCommander;

    // getPropertiesAtPoint first point
    const propsPoint0 = getPropertiesAtPoint(simpleShapes.initial[1], { x: 10, y: 90 });
    expect(propsPoint0.closest).to.deep.equal({ x: 10, y: 90 });
    expect(propsPoint0.distance).to.equal(0);
    expect(segmentMeta(propsPoint0.segment)).to.deep.equal({
      segment: ["M", 10, 90],
      index: 0,
      length: 0,
      lengthAtSegment: 0,
    });

    // getPropertiesAtPoint mid point
    const propsPoint50 = getPropertiesAtPoint(simpleShapes.initial[1], {
      x: 30.072453006153214,
      y: 41.42818552481854,
    });
    expect(propsPoint50.closest).to.deep.equal({ x: 30.07238133899532, y: 41.42817259194202 });
    expect(propsPoint50.distance).to.equal(0.00007282472667645927);
    expect(segmentMeta(propsPoint50.segment)).to.deep.equal({
      segment: ["C", 30, 90, 25, 10, 50, 10],
      index: 1,
      length: 94.75724347727943,
      lengthAtSegment: 0,
    });

    // getPropertiesAtPoint last point
    const propsPoint400 = getPropertiesAtPoint(simpleShapes.initial[1], { x: 50, y: 10 });
    expect(propsPoint400.closest).to.deep.equal({ x: 50.000003352761084, y: 10.000000000000481 });
    expect(propsPoint400.distance).to.equal(0.0000033527610838746457);
    expect(segmentMeta(propsPoint400.segment)).to.deep.equal({
      segment: ["s", 20, 80, 40, 80],
      index: 2,
      length: 94.75724347727943,
      lengthAtSegment: 94.75724347727943,
    });
  });

  test(`Can do getSegmentAtLength`, () => {
    const { getSegmentAtLength } = SVGPathCommander;
    expect(getSegmentAtLength(simpleShapes.initial[1])).to.deep.equal(["M", 10, 90]);
    expect(getSegmentAtLength(simpleShapes.initial[1], 0)).to.deep.equal(["M", 10, 90]);
    expect(getSegmentAtLength(simpleShapes.initial[3], 15)).to.deep.equal([
      "a",
      6,
      4,
      10,
      1,
      0,
      8,
      0,
    ]);
    expect(getSegmentAtLength(simpleShapes.initial[3], 400)).to.deep.equal([
      "a",
      6,
      4,
      10,
      0,
      0,
      8,
      0,
    ]);
  });

  test(`Can do getSegmentOfPoint`, () => {
    const { getSegmentOfPoint } = SVGPathCommander;
    // first point
    expect(segmentMeta(getSegmentOfPoint(simpleShapes.initial[1], { x: 10, y: 90 }))).to.deep.equal(
      {
        segment: ["M", 10, 90],
        index: 0,
        length: 0,
        lengthAtSegment: 0,
      },
    );
    // mid point
    expect(segmentMeta(getSegmentOfPoint(simpleShapes.initial[3], { x: 9, y: 9 }))).to.deep.equal({
      segment: ["a", 6, 4, 10, 0, 1, 8, 0],
      index: 5,
      length: 8.400637172969368,
      /* point: { x: 6, y: 10 },*/ lengthAtSegment: 46.660484011223645,
    });
  });

  test(`Can do getClosestPoint`, () => {
    const { getClosestPoint } = SVGPathCommander;
    // first point
    expect(getClosestPoint(simpleShapes.initial[1], { x: 10, y: 90 })).to.deep.equal({
      x: 10,
      y: 90,
    });
    // mid point
    expect(getClosestPoint(simpleShapes.initial[3], { x: 9, y: 9 })).to.deep.equal({
      x: 8.99551618007375,
      y: 8.952969847534355,
    });
  });

  test(`Can find the closest point on the closing segment of a closed path`, () => {
    const { getPropertiesAtPoint, getClosestPoint, isPointInStroke } = SVGPathCommander;
    const path = "M0 0L100 0L100 100L0 100Z";
    // the point is on the closing segment, so the distance is zero
    const props = getPropertiesAtPoint(path, { x: 0, y: 1 });
    expect(props.closest).to.deep.equal({ x: 0, y: 1 });
    expect(props.distance).to.equal(0);
    expect(props.segment?.segment).to.deep.equal(["Z"]);
    expect(getClosestPoint(path, { x: 0, y: 1 })).to.deep.equal({ x: 0, y: 1 });
    expect(isPointInStroke(path, { x: 0, y: 1 })).to.be.true;
    // the join of the loop is the end of the path and the start of it
    expect(getClosestPoint(path, { x: 0.5, y: 0 })).to.deep.equal({ x: 0.5, y: 0 });
  });

  test(`Can find the closest point over the join of a loop`, () => {
    const { getClosestPoint } = SVGPathCommander;
    // the length of the path is 370, so the coarse scan ends at 368 and the
    // search has to walk over the end of the path
    const path = "M0 0L100 0L100 85L0 85Z";
    expect(getClosestPoint(path, { x: -2, y: 2 })).to.deep.equal({ x: 0, y: 2 });
    // an open path is not walked over its end
    expect(getClosestPoint("M0 0L100 0L100 85L0 85", { x: -2, y: 2 })).to.deep.equal({
      x: 0,
      y: 0,
    });
    expect(getClosestPoint("M0 0L370 0", { x: 368, y: 1 })).to.deep.equal({ x: 368, y: 0 });
  });

  test(`Can do isPointInStroke`, () => {
    const { isPointInStroke } = SVGPathCommander;
    // first point
    expect(isPointInStroke(simpleShapes.initial[1], { x: 10, y: 90 })).to.be.true;
    // mid point'
    // expect(isPointInStroke(simpleShapes.initial[1], { x: 28.94438057441916, y: 46.29922469345143 })).to.be.true;
    expect(isPointInStroke(simpleShapes.initial[1], { x: 90, y: 90 })).to.be.true;
    // ({ x: 10, y: 10 })
    expect(isPointInStroke(simpleShapes.initial[1], { x: 10, y: 10 })).to.be.false;
    // ({ x: 45.355339, y: 45.355339 })
    expect(isPointInStroke(simpleShapes.initial[1], { x: 45.355339, y: 45.355339 })).to.be.false;
    // ({ x: 50, y: 10 })
    expect(isPointInStroke(simpleShapes.initial[1], { x: 50, y: 10 })).to.be.true;
  });

  test(`Can do isPointInStroke with a width`, () => {
    const { isPointInStroke } = SVGPathCommander;
    const line = "M0 0L100 0";
    // without a width the point has to be on the path
    expect(isPointInStroke(line, { x: 50, y: 0 })).to.be.true;
    expect(isPointInStroke(line, { x: 50, y: 5 })).to.be.false;
    // with a width the stroke is the band around the path
    expect(isPointInStroke(line, { x: 50, y: 5 }, { width: 10 })).to.be.true;
    expect(isPointInStroke(line, { x: 50, y: 6 }, { width: 10 })).to.be.false;
    expect(isPointInStroke(line, { x: 50, y: 0 }, { width: 10 })).to.be.true;
    // the ends of an open path are treated as round caps
    expect(isPointInStroke(line, { x: 105, y: 0 }, { width: 10 })).to.be.true;
    expect(isPointInStroke(line, { x: 106, y: 0 }, { width: 10 })).to.be.false;
    // a width of zero is the path itself
    expect(isPointInStroke(line, { x: 50, y: 0 }, { width: 0 })).to.be.true;
    expect(isPointInStroke(line, { x: 50, y: 5 }, { width: 0 })).to.be.false;
  });

  test(`Can reject an invalid stroke width`, () => {
    const { isPointInStroke } = SVGPathCommander;
    [-1, Number.NaN, Number.POSITIVE_INFINITY, "10"].forEach((width) => {
      try {
        isPointInStroke("M0 0L100 0", { x: 50, y: 0 }, { width: width as never });
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
      }
    });
  });

  test(`Can do getDrawDirection`, () => {
    const { getDrawDirection } = SVGPathCommander;
    expect(getDrawDirection(simpleShapes.reversed[1])).to.be.true;
    expect(getDrawDirection(simpleShapes.initial[1])).to.be.false;
  });

  describe("Point in path", () => {
    const { isPointInPath } = SVGPathCommander;
    // the native hit test of the browser, the reference of the tool
    const nativeIsPointInFill = (path: string, x: number, y: number, fillRule = "nonzero") => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "200");
      svg.setAttribute("height", "200");
      const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
      element.setAttribute("d", path);
      element.setAttribute("fill-rule", fillRule);
      svg.append(element);
      document.body.append(svg);
      // the browser answers from the rendered path, so the layout has to run
      svg.getBoundingClientRect();
      const result = element.isPointInFill(new DOMPoint(x, y));
      svg.remove();
      return result;
    };

    test("Can tell if a point is inside a shape", () => {
      const square = "M0 0L100 0L100 100L0 100Z";
      expect(isPointInPath(square, { x: 50, y: 50 })).to.be.true;
      expect(isPointInPath(square, { x: 150, y: 50 })).to.be.false;
      expect(isPointInPath(square, { x: 50, y: 150 })).to.be.false;
      expect(isPointInPath(square, { x: -50, y: 50 })).to.be.false;
      // a point on the boundary of the shape is inside of it
      expect(isPointInPath(square, { x: 0, y: 50 })).to.be.true;
      expect(isPointInPath(square, { x: 0, y: 0 })).to.be.true;
    });

    test("Can tell if a point is inside a curve", () => {
      const curve = "M0 0C50 100 100 100 150 0";
      expect(isPointInPath(curve, { x: 75, y: 50 })).to.be.true;
      expect(isPointInPath(curve, { x: 75, y: 90 })).to.be.false;
      expect(isPointInPath(curve, { x: 75, y: -10 })).to.be.false;
    });

    test("Can tell if a point is inside an arc", () => {
      const circle = "M50 0A50 50 0 1 0 50 100A50 50 0 1 0 50 0Z";
      expect(isPointInPath(circle, { x: 50, y: 50 })).to.be.true;
      expect(isPointInPath(circle, { x: 150, y: 50 })).to.be.false;
      expect(isPointInPath(circle, { x: 50, y: 150 })).to.be.false;
    });

    test("Can fill an open path as if it was closed", () => {
      expect(isPointInPath("M0 0L100 0L100 100L0 100", { x: 50, y: 50 })).to.be.true;
      expect(isPointInPath("M0 0L100 0L100 100L0 100", { x: 50, y: 150 })).to.be.false;
    });

    test("Can tell if a point is inside a hole", () => {
      // the two squares are drawn in the same direction, so the inner one is
      // not a hole with the nonzero rule
      const same = "M0 0L100 0L100 100L0 100ZM25 25L75 25L75 75L25 75Z";
      expect(isPointInPath(same, { x: 50, y: 50 })).to.be.true;
      expect(isPointInPath(same, { x: 50, y: 50 }, { fillRule: "evenodd" })).to.be.false;
      // the two squares are drawn in the opposite direction, so the inner one
      // is a hole with both rules
      const opposite = "M0 0L100 0L100 100L0 100ZM25 75L75 75L75 25L25 25Z";
      expect(isPointInPath(opposite, { x: 50, y: 50 })).to.be.false;
      expect(isPointInPath(opposite, { x: 50, y: 50 }, { fillRule: "evenodd" })).to.be.false;
    });

    test("Can tell if a point is inside a path array", () => {
      expect(
        isPointInPath([["M", 0, 0], ["L", 100, 0], ["L", 100, 100], ["L", 0, 100], ["Z"]], {
          x: 50,
          y: 50,
        }),
      ).to.be.true;
    });

    test("Can tell that an empty path has no inside", () => {
      expect(isPointInPath("", { x: 0, y: 0 })).to.be.false;
    });

    test("Can tell that a moveto without a shape has no inside", () => {
      expect(isPointInPath("M0 0L100 0M200 200", { x: 200, y: 200 })).to.be.false;
      expect(isPointInPath("M0 0L100 0M200 200", { x: 50, y: 0 })).to.be.true;
    });

    test("Can reject an invalid fill rule", () => {
      try {
        isPointInPath(
          "M0 0L100 0L100 100L0 100Z",
          { x: 50, y: 50 },
          {
            fillRule: "invalid" as never,
          },
        );
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
      }
    });

    test("Can reject an invalid tolerance", () => {
      [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "1"].forEach((tolerance) => {
        try {
          isPointInPath(
            "M0 0L100 0L100 100L0 100Z",
            { x: 50, y: 50 },
            {
              tolerance: tolerance as never,
            },
          );
          expect.fail("should have thrown");
        } catch (e) {
          expect(e).to.be.instanceOf(TypeError);
        }
      });
    });

    test("Can answer like the browser does", () => {
      // the shapes of the test, the points of every shape are chosen away
      // from the boundaries of the curves, where the flattening of the path
      // can answer differently than the browser
      const cases: { path: string; points: { x: number; y: number }[] }[] = [
        {
          path: "M0 0L100 0L100 100L0 100Z",
          points: [
            { x: 50, y: 50 },
            { x: 10, y: 10 },
            { x: 25, y: 75 },
            { x: 75, y: 25 },
            { x: 120, y: 20 },
            { x: -20, y: 120 },
            { x: 50, y: 5 },
            // the points of the boundary of the shape are inside of it
            { x: 0, y: 50 },
            { x: 50, y: 0 },
            { x: 100, y: 50 },
            { x: 50, y: 100 },
            { x: 0, y: 0 },
          ],
        },
        {
          path: "M0 0C50 100 100 100 150 0",
          points: [
            { x: 50, y: 50 },
            { x: 10, y: 10 },
            { x: 75, y: 25 },
            { x: 120, y: 20 },
            { x: 50, y: 5 },
            { x: 30, y: 80 },
          ],
        },
        {
          path: "M50 0A50 50 0 1 0 50 100A50 50 0 1 0 50 0Z",
          points: [
            { x: 50, y: 50 },
            { x: 25, y: 75 },
            { x: 75, y: 25 },
            { x: 50, y: 5 },
            { x: 5, y: 50 },
            { x: 95, y: 50 },
          ],
        },
        {
          path: "M0 0L100 0L100 100L0 100ZM25 25L75 25L75 75L25 75Z",
          points: [
            { x: 50, y: 50 },
            { x: 10, y: 10 },
            { x: 25, y: 75 },
            { x: 75, y: 25 },
            { x: 120, y: 20 },
            { x: 50, y: 5 },
            // the boundary of the inner square is inside of the shape
            { x: 25, y: 50 },
            { x: 50, y: 25 },
          ],
        },
        {
          path: "M0 0L100 0L100 100L0 100ZM25 75L75 75L75 25L25 25Z",
          points: [
            { x: 10, y: 10 },
            { x: 25, y: 75 },
            { x: 75, y: 25 },
            { x: 120, y: 20 },
            { x: 50, y: 5 },
            // the boundary of the hole is inside of the shape
            { x: 25, y: 50 },
            { x: 50, y: 25 },
          ],
        },
        {
          // the shape touches itself at (50,50), the point of the pinch is
          // not tested, the browser answers it with false and the flattening
          // of the path answers it with true
          path: "M0 0Q50 100 100 0L100 50L0 50Z",
          points: [
            { x: 10, y: 10 },
            { x: 75, y: 25 },
            { x: 120, y: 20 },
            { x: 50, y: 5 },
            { x: 25, y: 45 },
            { x: 75, y: 45 },
          ],
        },
      ];
      const mismatches: string[] = [];

      cases.forEach(({ path, points }) => {
        points.forEach((point) => {
          const mine = isPointInPath(path, point);
          const native = nativeIsPointInFill(path, point.x, point.y);
          if (mine !== native) {
            mismatches.push(`${path} @ ${point.x},${point.y} -> mine ${mine}, native ${native}`);
          }
        });
      });

      expect(mismatches).to.deep.equal([]);
    });

    test("Can answer like the browser does for a lot of points", () => {
      // the points of the sweep are random, but the seed is fixed, so the
      // test always asks the same questions
      const random = (seed: number) => {
        let state = seed;
        return () => {
          state = (state + 0x6d2b79f5) | 0;
          let value = Math.imul(state ^ (state >>> 15), 1 | state);
          value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
          return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        };
      };
      const paths = [
        "M0 0L100 0L100 100L0 100Z",
        "M0 0C50 100 100 100 150 0",
        "M50 0A50 50 0 1 0 50 100A50 50 0 1 0 50 0Z",
        "M0 0L100 0L100 100L0 100ZM25 25L75 25L75 75L25 75Z",
        "M0 0L100 0L100 100L0 100ZM25 75L75 75L75 25L25 25Z",
        "M10 10Q80 0 90 60T30 90L20 20Z",
      ];
      const next = random(20241120);
      const mismatches: string[] = [];

      paths.forEach((path) => {
        for (let i = 0; i < 60; i += 1) {
          const point = { x: next() * 140 - 20, y: next() * 140 - 20 };
          ["nonzero", "evenodd"].forEach((fillRule) => {
            const rule = fillRule as "nonzero" | "evenodd";
            // the tolerance is tight, so the flattening of the curves is
            // closer to the shape than the points of the sweep
            const mine = isPointInPath(path, point, { fillRule: rule, tolerance: 0.001 });
            const native = nativeIsPointInFill(path, point.x, point.y, rule);
            if (mine !== native) {
              mismatches.push(
                `${path} [${rule}] @ ${point.x},${point.y} -> mine ${mine}, native ${native}`,
              );
            }
          });
        }
      });

      expect(mismatches).to.deep.equal([]);
    });
  });

  test(`Can do splitCubicSegment`, () => {
    const { splitCubicSegment } = SVGPathCommander;
    expect(splitCubicSegment(70, 60, 70, 80, 110, 80, 110, 60, 0.5)).to.deep.equal([
      [70, 60, 70, 70, 80, 75, 90, 75],
      [90, 75, 100, 75, 110, 70, 110, 60],
    ]);
  });

  test(`Can do polygonLength`, () => {
    const { polygonTools } = SVGPathCommander;
    expect(
      polygonTools.polygonLength([
        [100, 100],
        [150, 25],
        [150, 75],
        [200, 0],
      ]),
    ).to.equal(230.27756377319946);
  });

  test(`Can do polygonArea`, () => {
    const { polygonTools } = SVGPathCommander;
    expect(
      polygonTools.polygonArea([
        [107.4, 13],
        [113.7, 28.8],
        [127.9, 31.3],
        [117.6, 43.5],
        [120.1, 60.8],
        [107.4, 52.6],
        [94.6, 60.8],
        [97.1, 43.5],
        [86.8, 31.3],
        [101, 28.8],
      ]),
    ).to.equal(-836.69);
  });

  test(`Can do polygonCentroid`, () => {
    const { polygonTools } = SVGPathCommander;
    expect(
      polygonTools
        .polygonCentroid([
          [107.4, 13],
          [113.7, 28.8],
          [127.9, 31.3],
          [117.6, 43.5],
          [120.1, 60.8],
          [107.4, 52.6],
          [94.6, 60.8],
          [97.1, 43.5],
          [86.8, 31.3],
          [101, 28.8],
        ])
        .map((c) => Math.round(c * 100) / 100),
    ).to.deep.equal([107.36, 39.44]);
    expect(polygonTools.polygonCentroid([])).to.deep.equal([0, 0]);
  });

  test(`Can do transformPath with empty object`, () => {
    const { transformPath, pathToString } = SVGPathCommander;
    const path = pathToString(transformPath(simpleShapes.normalized[0] as string));
    expect(path).to.equal(simpleShapes.normalized[0]);
    const path1 = pathToString(transformPath(simpleShapes.normalized[0], {}));
    expect(path1).to.equal(simpleShapes.normalized[0]);
    const path2 = pathToString(transformPath(simpleShapes.normalized[0], { origin: [0, 0, 0] }));
    expect(path2).to.equal(simpleShapes.normalized[0]);
  });

  test(`Can check path type`, () => {
    const {
      parsePathString,
      isPathArray,
      isCurveArray,
      isAbsoluteArray,
      isRelativeArray,
      isNormalizedArray,
    } = SVGPathCommander;
    // const
    expect(isPathArray(simpleShapes.initial[0])).to.be.false;
    expect(isPathArray(parsePathString(simpleShapes.initial[0]))).to.be.true;
    expect(isAbsoluteArray(simpleShapes.normalized[0])).to.be.false;
    expect(isAbsoluteArray(parsePathString(simpleShapes.normalized[0]))).to.be.true;
    expect(isRelativeArray(shapes.relative[7])).to.be.false;
    // console.log(parsePathString(shapes.relative[7]))
    expect(isRelativeArray(parsePathString(shapes.relative[7]))).to.be.true;
    expect(isNormalizedArray(simpleShapes.normalized[0])).to.be.false;
    expect(isNormalizedArray(parsePathString(simpleShapes.normalized[0]))).to.be.true;
    expect(isCurveArray(simpleShapes.normalized[1])).to.be.false;
    expect(isCurveArray(parsePathString(simpleShapes.normalized[1]))).to.be.true;
  });

  describe(`Can do paths intersection`, () => {
    const { pathsIntersection } = SVGPathCommander;

    intersectionFixtures.intersecting.forEach(({ path1, path2, expectedCount }, i) => {
      test(`Can do intersecting paths #${i} (count)`, () => {
        expect(pathsIntersection(path1, path2, true)).to.equal(expectedCount);
      });

      test(`Can do intersecting paths #${i} (points)`, () => {
        const points = pathsIntersection(path1, path2, false) as {
          x: number;
          y: number;
          t1: number;
          t2: number;
        }[];
        expect(points).to.have.length(expectedCount);
        points.forEach((pt) => {
          expect(pt).to.have.property("x");
          expect(pt).to.have.property("y");
          expect(pt).to.have.property("t1");
          expect(pt).to.have.property("t2");
        });
      });
    });

    intersectionFixtures.nonIntersecting.forEach(({ path1, path2, expectedCount }, i) => {
      test(`Can do non-intersecting paths #${i}`, () => {
        expect(pathsIntersection(path1, path2, true)).to.equal(expectedCount);
        expect(pathsIntersection(path1, path2, false)).to.have.length(0);
      });
    });

    test(`Can do isPointInsideBBox`, () => {
      const { isPointInsideBBox } = SVGPathCommander;
      const bbox: [number, number, number, number] = [0, 0, 100, 100];
      expect(isPointInsideBBox(bbox, [50, 50])).to.be.true;
      expect(isPointInsideBBox(bbox, [0, 0])).to.be.true;
      expect(isPointInsideBBox(bbox, [100, 100])).to.be.true;
      expect(isPointInsideBBox(bbox, [-1, 50])).to.be.false;
      expect(isPointInsideBBox(bbox, [101, 50])).to.be.false;
      expect(isPointInsideBBox(bbox, [50, -1])).to.be.false;
      expect(isPointInsideBBox(bbox, [50, 101])).to.be.false;
    });

    test(`Can do boundingBoxIntersect`, () => {
      const { boundingBoxIntersect } = SVGPathCommander;
      const a: [number, number, number, number] = [0, 0, 100, 100];
      const b: [number, number, number, number] = [50, 50, 150, 150];
      const c: [number, number, number, number] = [200, 200, 300, 300];
      expect(boundingBoxIntersect(a, b)).to.be.true;
      expect(boundingBoxIntersect(b, a)).to.be.true;
      expect(boundingBoxIntersect(a, c)).to.be.false;
      expect(boundingBoxIntersect(c, a)).to.be.false;
    });

    test(`Can do intersecting paths with line segments (Z closing line)`, () => {
      const path1 = "M0 0L50 0L50 50L0 50Z";
      const path2 = "M25 -10L25 60";
      const count = pathsIntersection(path1, path2, true);
      expect(count).to.be.greaterThan(0);
      const points = pathsIntersection(path1, path2, false) as { x: number; y: number }[];
      expect(points.length).to.be.greaterThan(0);
    });

    test(`Can do intersecting paths with mixed line and curve segments`, () => {
      const path1 = "M0 0L100 0L100 100L0 100Z";
      const path2 = "M50 0L50 100";
      const count = pathsIntersection(path1, path2, true);
      expect(count).to.be.greaterThan(0);
    });

    test(`Can do intersecting paths with Z-to-Z closing lines`, () => {
      const path1 = "M0 0L100 0L100 50L0 50Z";
      const path2 = "M-10 25L110 25";
      const count = pathsIntersection(path1, path2);
      expect(count).to.be.greaterThan(0);
    });

    test(`Can do pathsIntersection with PathArray input`, () => {
      const { parsePathString } = SVGPathCommander;
      const p1 = parsePathString("M0 0L100 0L100 100L0 100Z");
      const p2 = parsePathString("M50 0L50 100");
      const count = pathsIntersection(p1, p2);
      expect(count).to.be.greaterThan(0);
    });
  });

  describe(`Can do equalizeSegments`, () => {
    const {
      equalizeSegments,
      pathToString,
      reversePath,
      parsePathString,
      pathToCurve,
      roundPath,
      normalizePath,
    } = SVGPathCommander;

    test(`Can do equalizeSegments simple shapes`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
      );
      expect(eq1.length).to.equal(eq2.length);
      expect(eq1[0][0]).to.equal("M");
      expect(eq2[0][0]).to.equal("M");
    });

    test(`Can do equalizeSegments getRotatedPath throw error`, () => {
      const p1 = parsePathString(equalizeFixtures.simple.triangle);
      const p2 = parsePathString(equalizeFixtures.simple.square);

      try {
        // @ts-expect-error -  testing an error
        getRotatedPath(p1, p2);
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property(
          "message",
          `${error}: paths must have the same number of segments after equalization`,
        );
      }
    });

    test(`Can do equalizeSegments getRotatedPath with precomputed rotations`, () => {
      const p1 = parsePathString("M0 0L10 0L20 0L30 0") as MorphPathArray;
      const p2 = parsePathString("M10 0L20 0L30 0L10 0") as MorphPathArray;
      const rotations = getRotations(p1);
      expect(rotations).to.have.lengthOf(p1.length);
      // the rotation that starts at the second segment matches the path
      expect(getRotatedPath(p1, p2, rotations)).to.deep.equal(rotations[1]);
      expect(getRotatedPath(p1, p2)).to.deep.equal(rotations[1]);
    });

    test(`Can do equalizeSegments getRotatedPath with an empty path`, () => {
      // an empty path has no rotation, but the result still has to be well formed
      expect(
        getRotatedPath([] as unknown as MorphPathArray, [] as unknown as MorphPathArray),
      ).to.deep.equal([]);
      expect(equalizeSegments("", "")).to.deep.equal([[], []]);
    });

    test(`Can do equalizeSegments splitCurvePathToCount edge cases`, () => {
      const p1 = roundPath(pathToCurve("M0 0H50"), 2);

      expect(splitCurvePathToCount(p1, 1)).to.deep.equal([
        ["M", 0, 0],
        ["C", 16.67, 0, 33.33, 0, 50, 0],
      ]);
      expect(splitCurvePathToCount([["M", 0, 0]], 5)).to.deep.equal([["M", 0, 0]]);
    });

    test(`Can do equalizeSegments splitLinePathToCount edge cases`, () => {
      const p1 = roundPath(normalizePath("M0 0H50") as PolylineArray, 2);

      expect(splitLinePathToCount(p1, 1)).to.deep.equal([
        ["M", 0, 0],
        ["L", 50, 0],
      ]);
      expect(splitLinePathToCount([["M", 0, 0]], 5)).to.deep.equal([["M", 0, 0]]);
    });

    test(`Can do equalizeSegments getPathSplits edge cases`, () => {
      const path: PolylineArray = [
        ["M", 0, 0],
        ["L", 0, 0],
      ];
      const path2: PolylineArray = [
        ["M", 0, 0],
        ["L", 50, 0],
        ["L", 50, 150],
      ];

      expect(getPathSplits(path, 2)).to.deep.equal([1, 1]);
      expect(getPathSplits(path2, 20)).to.deep.equal([1, 4, 15]);
      expect(getPathSplits(path2, 30)).to.deep.equal([1, 7, 22]);
      expect(getPathSplits(path2, 50)).to.deep.equal([1, 12, 37]);

      try {
        expect(getPathSplits(path, 1));
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property("message", `${error}: target must be >= 2`);
      }
    });

    test(`Can do equalizeSegments getPathSplits without hanging`, () => {
      const path: PolylineArray = [
        ["M", 0, 0],
        ["L", 10, 0],
        ["L", 20, 0],
      ];

      // the target is below the segment count, so it cannot be reached
      expect(getPathSplits(path, 2)).to.deep.equal([1, 1, 1]);
      // a fractional target used to make the adjustment loop spin forever
      expect(getPathSplits(path, 2.5)).to.deep.equal([1, 1, 1]);
    });

    test(`Can do equalizeSegments getPathSplits without hanging on a long path`, () => {
      const path: PolylineArray = [["M", 0, 0]];
      for (let i = 1; i <= 10; i += 1) path.push(["L", i * 10, 0]);

      expect(getPathSplits(path, 5)).to.deep.equal([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      expect(getPathSplits(path, 5)).to.have.lengthOf(path.length);
    });

    test(`Can do equalizeSegments getPathSplits with a non finite target`, () => {
      const path: PolylineArray = [
        ["M", 0, 0],
        ["L", 10, 0],
      ];

      [Infinity, -Infinity, NaN].forEach((target) => {
        try {
          expect(getPathSplits(path, target));
        } catch (e) {
          expect(e).to.be.instanceOf(TypeError);
          expect(e).to.have.property("message", `${error}: target must be a finite number`);
        }
      });
    });

    test(`Can do equalizeSegments getPathSplits with the exact target`, () => {
      const path: PolylineArray = [["M", 0, 0]];
      for (let i = 1; i <= 9; i += 1) path.push(["L", i * 10, 0]);

      for (const target of [2, 3, 5, 10, 11, 20, 50, 100, 1000]) {
        const splits = getPathSplits(path, target);
        expect(splits).to.have.lengthOf(path.length);
        // the target cannot be lower than the segment count
        expect(splits.reduce((total, count) => total + count, 0)).to.equal(
          Math.max(target, path.length),
        );
      }
    });

    test(`Can do equalizeSegments getPathSplits with an empty path`, () => {
      expect(getPathSplits([] as unknown as PolylineArray, 5)).to.deep.equal([]);
      expect(getPathSplits([["M", 0, 0]] as unknown as PolylineArray, 5)).to.deep.equal([1]);
    });

    test(`Can do equalizeSegments getPathSplits with segments that are not lines or curves`, () => {
      const path = parsePathString("M0 0H10V10Z") as unknown as PolylineArray;
      const splits = getPathSplits(path, 4);
      expect(splits).to.deep.equal([1, 1, 1, 1]);
      expect(splits.some((count) => Number.isNaN(count))).to.be.false;
    });

    test(`Can do equalizeSegments getPathSplits with a target above the proportional share`, () => {
      const path: PolylineArray = [["M", 0, 0]];
      for (let i = 1; i <= 10; i += 1) path.push(["L", i, 0]);

      // every segment is one unit long, so the proportional share of each is
      // below one and the extra splits have to be handed out afterwards
      expect(getPathSplits(path, 13)).to.deep.equal([1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]);
    });

    test(`Can do equalizeSegments pathToPolyline edge cases`, () => {
      const parsed1 = parsePathString("M0 0C0 0 0 0 5 5");
      const parsed2 = parsePathString("M0 0H50") as PolylineArray;
      const parsed3 = parsePathString("M0 0H50Z") as PolylineArray;
      // const normalized2 = normalizePath(parsed2);

      expect(pathToPolyline(parsed2)).to.deep.equal([
        ["M", 0, 0],
        ["L", 50, 0],
      ]);
      expect(pathToPolyline(parsed3)).to.deep.equal([
        ["M", 0, 0],
        ["L", 50, 0],
        ["L", 0, 0],
      ]);

      try {
        // @ts-expect-error -  testing an error
        pathToPolyline(parsed1);
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property("message", `${error}: pathValue is not a polyline/polygon`);
      }
    });

    test(`Can do equalizeSegments samplePolygon throw error`, () => {
      const p1 = parsePathString("M0 0H50");

      try {
        // @ts-expect-error -  testing an error
        samplePolygon(p1);
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property("message", `${error}: path command "H" is not supported`);
      }
    });

    test(`Can do equalizeSegments curves`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.curves.circle,
        equalizeFixtures.curves.ellipse,
      );
      expect(eq1.length).to.equal(eq2.length);
      expect(eq1.every((s) => s[0] === "M" || s[0] === "C")).to.be.true;
      expect(eq2.every((s) => s[0] === "M" || s[0] === "C")).to.be.true;
    });

    test(`Can do equalizeSegments complex shapes`, () => {
      const reverseHeart = reversePath(parsePathString(equalizeFixtures.complex.heart));
      const [eq1, eq2] = equalizeSegments(equalizeFixtures.complex.star, reverseHeart);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizeSegments with incorrect target option`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.complex.star,
        equalizeFixtures.complex.heart,
        { target: 1 },
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizeSegments with close option`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { close: true },
      );
      expect(eq1[eq1.length - 1][0]).to.equal("Z");
      expect(eq2[eq2.length - 1][0]).to.equal("Z");
    });

    test(`Can do equalizeSegments with roundValues option`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { roundValues: 2 },
      );
      const s1 = pathToString(eq1, 2);
      const s2 = pathToString(eq2, 2);
      expect(s1).to.be.a("string");
      expect(s2).to.be.a("string");
    });

    test(`Can do equalizeSegments with target option`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { target: 20 },
      );
      expect(eq1.length).to.be.at.least(20);
      expect(eq2.length).to.be.at.least(20);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizeSegments with mode "curve"`, () => {
      const tri = "M0 0L100 0L50 100Z";
      const sq = "M0 0L100 0L100 100L0 100Z";
      const [eq1, eq2] = equalizeSegments(tri, sq, { mode: "curve" });
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizeSegments with reverse false`, () => {
      const [eq1, eq2] = equalizeSegments(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { reverse: false },
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizeSegments without leaking the options into the defaults`, () => {
      const line = "M0 0L10 0L20 0L30 0";

      equalizeSegments(line, line, { mode: "curve" });

      // the default mode is still "auto", which keeps the path a polyline
      const [eq1] = equalizeSegments(line, line);
      expect(eq1.map((segment) => segment[0])).to.deep.equal(["M", "L", "L", "L"]);
    });
  });

  describe(`Can do equalizePaths`, () => {
    const { equalizePaths, equalizeSegments, pathToString } = SVGPathCommander;

    test(`Can do equalizePaths single subpath`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
      );
      expect(eq1.length).to.equal(eq2.length);
      expect(eq1[0][0]).to.equal("M");
    });

    test(`Can do equalizePaths curves`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.curves.circle,
        equalizeFixtures.curves.ellipse,
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths complex shapes`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.complex.star,
        equalizeFixtures.complex.heart,
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths multi-subpath`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.multiSubpath.twoRects1,
        equalizeFixtures.multiSubpath.twoRects2,
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with close option`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { close: true },
      );
      expect(eq1.some((s) => s[0] === "Z")).to.be.true;
      expect(eq2.some((s) => s[0] === "Z")).to.be.true;
    });

    test(`Can do equalizePaths with roundValues option`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { roundValues: 2 },
      );
      const s1 = pathToString(eq1, 2);
      const s2 = pathToString(eq2, 2);
      expect(s1).to.be.a("string");
      expect(s2).to.be.a("string");
    });

    test(`Can do equalizePaths with mode "auto"`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with mode "curve"`, () => {
      const [eq1, eq2] = equalizePaths(
        equalizeFixtures.simple.triangle,
        equalizeFixtures.simple.square,
        { mode: "curve" },
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with string input`, () => {
      const [eq1, eq2] = equalizePaths("M0 0L100 0L50 100Z", "M0 0L100 0L100 100L0 100Z");
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with PathArray input`, () => {
      const { parsePathString } = SVGPathCommander;
      const p1 = parsePathString("M0 0L100 0L50 100Z");
      const p2 = parsePathString("M0 0L100 0L100 100L0 100Z");
      const [eq1, eq2] = equalizePaths(p1, p2);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with multipaths #1`, () => {
      const p1 = shapes.initial[0];
      const p2 = shapes.initial[1];
      const [eq1, eq2] = equalizePaths(p1, p2);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with multipaths #2`, () => {
      const p1 = shapes.initial[1];
      const p2 = shapes.initial[3];
      const [eq1, eq2] = equalizePaths(p1, p2);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalizePaths with the reverse false option`, () => {
      const { getDrawDirection } = SVGPathCommander;
      const opposite = "M0 0L10 0L10 10L0 10Z";
      const other = "M0 0L0 10L10 10L10 0Z";

      const [eq1, eq2] = equalizePaths(opposite, other, { reverse: false });
      expect(eq1.length).to.equal(eq2.length);
      // the paths keep their own winding
      expect(getDrawDirection(eq1)).to.not.equal(getDrawDirection(eq2));
    });

    test(`Can do equalizePaths with paths that draw the same way`, () => {
      const clockwise = "M0 0L0 10L10 10L10 0ZM20 20L20 30L30 30L30 20Z";
      const [eq1, eq2] = equalizePaths(clockwise, clockwise);
      expect(eq1.length).to.equal(eq2.length);
      // the paths are not reversed, they already draw the same way
      expect(eq1[0]).to.deep.equal(["M", 0, 0]);
    });

    test(`Can do equalizePaths with paths that draw in opposite ways`, () => {
      const { getDrawDirection } = SVGPathCommander;
      const opposite = "M0 0L10 0L10 10L0 10Z";
      const other = "M0 0L0 10L10 10L10 0Z";
      const [eq1, eq2] = equalizePaths(opposite, other);
      expect(eq1.length).to.equal(eq2.length);
      // the winding of the two paths is normalized, so they match
      expect(getDrawDirection(eq1)).to.equal(getDrawDirection(eq2));
    });

    test(`Can do equalizePaths without leaking the reverse option into the defaults`, () => {
      const opposite = "M0 0L10 0L10 10L0 10Z";
      const other = "M0 0L0 10L10 10L10 0Z";

      const before = equalizeSegments(opposite, other);

      equalizePaths("M0 0L10 0L10 10ZM0 0L5 5L5 0Z", "M0 0L10 0L10 10ZM0 0L5 5L5 0Z");

      const after = equalizeSegments(opposite, other);

      // the winding of both paths is still normalized to match
      expect(after).to.deep.equal(before);
      expect(pathToString(after[0])).to.equal(pathToString(after[1]));
    });
  });

  describe(`Can do resamplePath`, () => {
    const { resamplePath, normalizePath } = SVGPathCommander;

    test(`Can resample a path to evenly spaced points`, () => {
      const resampled = resamplePath("M0 0L100 0L100 100", 3, "line");
      // the corner of the path is a point of the result too
      expect(resampled).to.deep.equal([
        ["M", 0, 0],
        ["L", 100, 0],
        ["L", 100, 100],
      ]);
    });

    test(`Can resample a path to the corners of a polygon`, () => {
      const resampled = resamplePath("M0 0L100 0L100 100L0 100Z", 5, "line");
      expect(resampled).to.deep.equal([
        ["M", 0, 0],
        ["L", 100, 0],
        ["L", 100, 100],
        ["L", 0, 100],
        ["L", 0, 0],
      ]);
    });

    test(`Can resample a path to the corners of a polygon with more points`, () => {
      const resampled = resamplePath("M0 0L100 0L100 100L0 100Z", 8, "line");
      // the corners are kept and the edges hold a point of their own
      expect(resampled).to.deep.equal([
        ["M", 0, 0],
        ["L", 50, 0],
        ["L", 100, 0],
        ["L", 100, 50],
        ["L", 100, 100],
        ["L", 50, 100],
        ["L", 0, 100],
        ["L", 0, 0],
      ]);
    });

    test(`Can resample a path to curves`, () => {
      const resampled = resamplePath("M0 0L100 0", 2, "curve");
      // a straight span stays a straight line, the control points sit at a
      // third of the span
      expect(resampled).to.deep.equal([
        ["M", 0, 0],
        ["C", 33.333333333333336, 0, 66.66666666666666, 0, 100, 0],
      ]);
    });

    test(`Can resample a path with a curve`, () => {
      const resampled = resamplePath("M0 0C50 100 100 100 150 0", 4, "curve");
      expect(resampled).to.have.lengthOf(4);
      expect(resampled.every((segment) => segment[0] === "M" || segment[0] === "C")).to.be.true;
      // the ends of the path are kept
      expect(resampled[0]).to.deep.equal(["M", 0, 0]);
      expect((resampled[3] as CSegment).slice(-2)).to.deep.equal([150, 0]);
    });

    test(`Can resample a path with a quadratic segment`, () => {
      const resampled = resamplePath("M0 0Q50 100 100 0", 3, "line");
      expect(resampled).to.have.lengthOf(3);
      expect((resampled[1] as LSegment)[1]).to.be.closeTo(50, 1e-5);
      expect((resampled[1] as LSegment)[2]).to.be.closeTo(50, 1e-5);
    });

    test(`Can resample a path with an arc`, () => {
      const resampled = resamplePath("M0 0A50 50 0 0 1 100 0", 3, "line");
      expect(resampled).to.have.lengthOf(3);
      expect((resampled[1] as LSegment)[1]).to.be.closeTo(50, 1e-5);
      expect((resampled[1] as LSegment)[2]).to.be.closeTo(-50, 1e-5);
    });

    test(`Can resample a path without a length`, () => {
      expect(resamplePath("M10 10", 4, "line")).to.deep.equal([["M", 10, 10]]);
    });

    test(`Can resample an empty path`, () => {
      expect(resamplePath("", 4, "line")).to.deep.equal([]);
    });

    test(`Can resample a path with a single point`, () => {
      expect(resamplePath("M10 10L10 10", 4, "line")).to.deep.equal([["M", 10, 10]]);
    });

    test(`Can resample a path with a fractional count`, () => {
      expect(resamplePath("M0 0L100 0", 2.7, "line")).to.deep.equal([
        ["M", 0, 0],
        ["L", 100, 0],
      ]);
    });

    test(`Can resample a path with more corners than points`, () => {
      const resampled = resamplePath("M0 0L100 0L100 100L0 100Z", 2, "line");
      // the corners do not fit, so the points are spread evenly
      expect(resampled).to.deep.equal([
        ["M", 0, 0],
        ["L", 0, 0],
      ]);
    });

    test(`Can sample the polygon of a path with a quadratic segment`, () => {
      const path = normalizePath("M0 0Q50 100 100 0") as NormalArray;
      expect(samplePolygon(path)).to.deep.equal([
        [0, 0],
        [100, 0],
      ]);
    });

    test(`Can resample a path with a segment without a length`, () => {
      const resampled = resamplePath("M0 0L0 0L10 0", 2, "line");
      expect(resampled).to.deep.equal([
        ["M", 0, 0],
        ["L", 10, 0],
      ]);
    });

    test(`Can resample a path with a segment without a direction`, () => {
      const resampled = resamplePath("M0 0C0 0 10 0 10 0L20 0", 2, "line");
      expect(resampled).to.have.lengthOf(2);
      expect((resampled[1] as LSegment)[1]).to.be.closeTo(20, 1e-9);
    });

    test(`Can resample a path with a segment without a direction at its start`, () => {
      const resampled = resamplePath("M0 0L10 0C10 0 20 0 20 0", 2, "line");
      expect(resampled).to.have.lengthOf(2);
      expect((resampled[1] as LSegment)[1]).to.be.closeTo(20, 1e-9);
    });

    test(`Can resample a path with the default mode`, () => {
      expect(resamplePath("M0 0L100 0", 2)).to.deep.equal([
        ["M", 0, 0],
        ["L", 100, 0],
      ]);
    });

    test(`Can resample a path to a single point`, () => {
      expect(resamplePath("M0 0L100 0", 1)).to.deep.equal([["M", 0, 0]]);
    });
  });

  describe(`Can do equalize`, () => {
    const { equalize, equalizeSegments, pathToString } = SVGPathCommander;
    const triangle = "M0 0L100 0L50 100Z";
    const square = "M0 0L100 0L100 100L0 100Z";

    test(`Can do equalize with the default options`, () => {
      const [eq1, eq2] = equalize(triangle, square);
      expect(eq1.length).to.equal(eq2.length);
      expect(eq1[0][0]).to.equal("M");
      expect(eq2[0][0]).to.equal("M");
    });

    test(`Can do equalize with the arc length strategy`, () => {
      const [eq1, eq2] = equalize(triangle, square, { strategy: "arcLength" });
      expect(eq1.length).to.equal(eq2.length);
      // the corners of the paths are kept
      expect(eq1.some((segment) => segment[0] === "L" && segment[1] === 100)).to.be.true;
      expect(eq2.some((segment) => segment[0] === "L" && segment[1] === 100)).to.be.true;
    });

    test(`Can do equalize with the arc length strategy and a number of points`, () => {
      const [eq1, eq2] = equalize(triangle, square, { strategy: "arcLength", points: 6 });
      expect(eq1.length).to.equal(6);
      expect(eq2.length).to.equal(6);
    });

    test(`Can do equalize with the arc length strategy and the curve mode`, () => {
      const [eq1, eq2] = equalize(triangle, square, {
        strategy: "arcLength",
        mode: "curve",
        points: 4,
      });
      expect(eq1.length).to.equal(eq2.length);
      expect(eq1.every((segment) => segment[0] === "M" || segment[0] === "C")).to.be.true;
      expect(eq2.every((segment) => segment[0] === "M" || segment[0] === "C")).to.be.true;
    });

    test(`Can do equalize with the arc length strategy and the line mode`, () => {
      const [eq1, eq2] = equalize("M0 0C50 100 100 100 150 0", square, {
        strategy: "arcLength",
        mode: "line",
        points: 4,
      });
      expect(eq1.length).to.equal(4);
      expect(eq2.length).to.equal(4);
      expect(eq1.every((segment) => segment[0] === "M" || segment[0] === "L")).to.be.true;
    });

    test(`Can do equalize with the reverse auto mode`, () => {
      const path1 = "M0 0L100 0L50 100";
      const path2 = "M10 300L300 200L200 200";

      const [eq1, eq2] = equalize(path1, path2, { reverse: "auto", strategy: "arcLength" });
      // the first path is the one that is reversed: its end is closer to the
      // start of the second path than its start
      expect(eq1[0]).to.deep.equal(["M", 50, 100]);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize with the reverse auto mode and a closed path`, () => {
      const path1 = "M0 0L100 0L50 100";
      const path2 = "M200 200L250 300L300 200Z";

      const [eq1, eq2] = equalize(path1, path2, { reverse: "auto", strategy: "arcLength" });
      // the closed path ends at its own start, so the first path is the one
      // that is reversed
      expect(eq1[0]).to.deep.equal(["M", 50, 100]);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize with the reverse true mode`, () => {
      const path1 = "M0 0L100 0L50 100";
      const path2 = "M10 300L300 200L200 200";

      const [eq1, eq2] = equalize(path1, path2, { reverse: true, strategy: "arcLength" });
      // the second path is the one that is reversed
      expect(eq1[0]).to.deep.equal(["M", 0, 0]);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize with the reverse false mode`, () => {
      const path1 = "M0 0L100 0L50 100";
      const path2 = "M10 300L300 200L200 200";

      const [eq1, eq2] = equalize(path1, path2, { reverse: false, strategy: "arcLength" });
      expect(eq1[0]).to.deep.equal(["M", 0, 0]);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize without the alignment`, () => {
      const path1 = "M0 0L100 0L50 100";
      const path2 = "M10 300L300 200L200 200";

      const [eq1, eq2] = equalize(path1, path2, {
        align: false,
        reverse: false,
        strategy: "arcLength",
      });
      // the second path keeps its own start
      expect(eq2[0]).to.deep.equal(["M", 10, 300]);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize without the alignment and the segment strategy`, () => {
      const path1 = "M0 0L100 0L50 100";
      const path2 = "M10 300L300 200L200 200";

      const [eq1, eq2] = equalize(path1, path2, { align: false, reverse: false });
      expect(eq2[0]).to.deep.equal(["M", 10, 300]);
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize with the arc length strategy and the auto mode`, () => {
      // a path with a curve is not a polyline, so the result holds curves
      const [eq1, eq2] = equalize("M0 0C50 100 100 100 150 0", square, {
        strategy: "arcLength",
        points: 4,
      });
      expect(eq1.length).to.equal(eq2.length);
      expect(eq1.every((segment) => segment[0] === "M" || segment[0] === "C")).to.be.true;
      expect(eq2.every((segment) => segment[0] === "M" || segment[0] === "C")).to.be.true;
    });

    test(`Can do equalize with multiple sub-paths`, () => {
      const [eq1, eq2] = equalize(
        equalizeFixtures.multiSubpath.twoRects1,
        equalizeFixtures.multiSubpath.twoRects2,
        { strategy: "arcLength" },
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize with multiple sub-paths and a number of points`, () => {
      const [eq1, eq2] = equalize(
        equalizeFixtures.multiSubpath.twoRects1,
        equalizeFixtures.multiSubpath.twoRects2,
        { strategy: "arcLength", points: 8 },
      );
      expect(eq1.length).to.equal(eq2.length);
    });

    test(`Can do equalize with the close option`, () => {
      const [eq1, eq2] = equalize(triangle, square, { close: true, strategy: "arcLength" });
      expect(eq1[eq1.length - 1][0]).to.equal("Z");
      expect(eq2[eq2.length - 1][0]).to.equal("Z");
    });

    test(`Can do equalize with the roundValues option`, () => {
      const [eq1, eq2] = equalize(triangle, square, {
        roundValues: 2,
        strategy: "arcLength",
      });
      expect(pathToString(eq1, 2)).to.be.a("string");
      expect(pathToString(eq2, 2)).to.be.a("string");
    });

    test(`Can do equalize without leaking the options into the defaults`, () => {
      const line = "M0 0L10 0L20 0L30 0";

      equalize(line, line, { mode: "curve", strategy: "arcLength" });

      // the default strategy is still "segment", which keeps the points of
      // the path
      const [eq1] = equalize(line, line);
      expect(eq1.map((segment) => segment[0])).to.deep.equal(["M", "L", "L", "L"]);
      // and the default mode is still "auto", which keeps the path a polyline
      const [eq2] = equalizeSegments(line, line);
      expect(eq2.map((segment) => segment[0])).to.deep.equal(["M", "L", "L", "L"]);
    });

    test(`Can do equalize with an invalid number of points`, () => {
      expect(() => equalize(triangle, square, { points: 1 })).to.throw(
        TypeError,
        `${error}: points must be a number greater than 1`,
      );
      expect(() => equalize(triangle, square, { points: Number.NaN })).to.throw(
        TypeError,
        `${error}: points must be a number greater than 1`,
      );
    });
  });

  describe(`Can do matchPaths`, () => {
    const { getPathBBox, normalizePath } = SVGPathCommander;

    function makeFeature(path: string): PathFeature {
      const p = normalizePath(path);
      const bbox = getPathBBox(path);
      return {
        path: p,
        bbox,
        size: bbox.width * bbox.height,
        signedArea: 0,
        area: 0,
        isPoly: false,
      };
    }

    test(`Can do matchPaths with overlapping inners`, () => {
      const target = makeFeature("M40 40L60 40L60 60L40 60Z");
      const candidate1 = makeFeature("M35 35L65 35L65 65L35 65Z");
      const candidate2 = makeFeature("M0 0L10 0L10 10L0 10Z");

      const fromFeatures = [target];
      const toFeatures = [candidate1, candidate2];

      const pairs = matchPaths(fromFeatures, toFeatures);
      expect(pairs.length).to.equal(2);
      expect(pairs[0][0]).to.deep.equal(target.path);
      expect(pairs[0][1]).to.deep.equal(candidate1.path);
    });

    test(`Can do matchPaths picks closest when multiple overlap`, () => {
      const target = makeFeature("M50 50L60 50L60 60L50 60Z");
      const closer = makeFeature("M45 45L65 45L65 65L45 65Z");
      const farther = makeFeature("M0 0L100 0L100 100L0 100Z");

      const fromFeatures = [target];
      const toFeatures = [farther, closer];

      const pairs = matchPaths(fromFeatures, toFeatures);
      expect(pairs.length).to.equal(2);
      expect(pairs[0][1]).to.deep.equal(closer.path);
    });

    test(`Can do matchPaths with no overlap returns placeholder`, () => {
      const target = makeFeature("M0 0L10 0L10 10L0 10Z");
      const candidate = makeFeature("M100 100L110 100L110 110L100 110Z");

      const fromFeatures = [target];
      const toFeatures = [candidate];

      const pairs = matchPaths(fromFeatures, toFeatures);
      expect(pairs.length).to.equal(2);
      expect(pairs[0][0]).to.deep.equal(target.path);
      expect(pairs[0][1][0][0]).to.equal("M");
    });

    test(`Can do matchPaths with more from paths than to paths`, () => {
      const from1 = makeFeature("M0 0L100 0L100 100L0 100Z");
      const from2 = makeFeature("M200 200L210 200L210 210L200 210Z");
      const to1 = makeFeature("M0 0L100 0L100 100L0 100Z");

      const fromFeatures = [from1, from2];
      const toFeatures = [to1];

      const pairs = matchPaths(fromFeatures, toFeatures);
      expect(pairs.length).to.equal(2);
      expect(pairs[0][0]).to.deep.equal(from1.path);
      expect(pairs[0][1]).to.deep.equal(to1.path);
      expect(pairs[1][0]).to.deep.equal(from2.path);
      expect(pairs[1][1][0][0]).to.equal("M");
    });

    test(`Can do matchPaths with more to paths than from paths`, () => {
      const from1 = makeFeature("M0 0L100 0L100 100L0 100Z");
      const to1 = makeFeature("M0 0L100 0L100 100L0 100Z");
      const to2 = makeFeature("M200 200L210 200L210 210L200 210Z");

      const fromFeatures = [from1];
      const toFeatures = [to1, to2];

      const pairs = matchPaths(fromFeatures, toFeatures);
      expect(pairs.length).to.equal(2);
      expect(pairs[0][0]).to.deep.equal(from1.path);
      expect(pairs[0][1]).to.deep.equal(to1.path);
      expect(pairs[1][0][0][0]).to.equal("M");
      expect(pairs[1][1]).to.deep.equal(to2.path);
    });

    test(`Can do matchPaths with empty arrays`, () => {
      const pairs = matchPaths([], []);
      expect(pairs).to.deep.equal([]);
    });

    test(`Can do matchPaths sorts by size descending`, () => {
      const small = makeFeature("M0 0L10 0L10 10L0 10Z");
      const large = makeFeature("M0 0L100 0L100 100L0 100Z");
      const smallTarget = makeFeature("M5 5L15 5L15 15L5 15Z");
      const largeTarget = makeFeature("M0 0L100 0L100 100L0 100Z");

      const fromFeatures = [smallTarget, largeTarget];
      const toFeatures = [small, large];

      const pairs = matchPaths(fromFeatures, toFeatures);
      expect(pairs.length).to.equal(2);
      expect(pairs[0][0]).to.deep.equal(largeTarget.path);
      expect(pairs[0][1]).to.deep.equal(large.path);
      expect(pairs[1][0]).to.deep.equal(smallTarget.path);
      expect(pairs[1][1]).to.deep.equal(small.path);
    });
  });

  test(`Can cover all remaining branches`, () => {
    const {
      isMultiPath,
      roundPath,
      paramsParser,
      shortenSegment,
      splitPath,
      pathToString,
      optimizePath,
      parsePathString,
      getPathBBox,
      getPointAtLength,
      getTotalLength,
      roundTo,
    } = SVGPathCommander;
    expect(roundTo(3.456, 0), `can round with 0 decimals`).to.equal(3);
    expect(parsePathString("M0 0L+10 10"), `can parse a number starting with +`).to.deep.equal([
      ["M", 0, 0],
      ["L", 10, 10],
    ]);
    expect(parsePathString("M0 0L1e+2 0"), `can parse a positive exponent`).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
    ]);
    expect(parsePathString("M0 0L1e-2 0"), `can parse a negative exponent`).to.deep.equal([
      ["M", 0, 0],
      ["L", 0.01, 0],
    ]);
    expect(parsePathString("M0 0L1e25 0"), `can parse a large exponent`).to.deep.equal([
      ["M", 0, 0],
      ["L", 1e25, 0],
    ]);
    expect(parsePathString("M0 0L1e-25 0"), `can parse a tiny exponent`).to.deep.equal([
      ["M", 0, 0],
      ["L", 1e-25, 0],
    ]);
    expect(
      getPointAtLength(simpleShapes.normalized[3], 2 * getTotalLength("M6 10A6 4 10 1 0 14 10")),
    ).to.deep.equal({ x: 14, y: 10 });
    expect(getPointAtLength(simpleShapes.normalized[0], 0)).to.deep.equal({ x: 10, y: 10 });
    expect(getPointAtLength(simpleShapes.normalized[3], undefined)).to.deep.equal({ x: 6, y: 10 });
    expect(getTotalLength(simpleShapes.normalized[0])).to.be.above(233);
    expect(getPathBBox(simpleShapes.normalized[2])).to.deep.equal({
      cx: 100,
      cy: 50,
      cz: 192.5,
      height: 25,
      width: 180,
      x: 10,
      y: 37.5,
      x2: 190,
      y2: 62.5,
    });
    expect(getPathBBox(simpleShapes.normalized[1])).to.deep.equal({
      cx: 90,
      cy: 50,
      cz: 200,
      height: 80,
      width: 160,
      x: 10,
      y: 10,
      x2: 170,
      y2: 90,
    });
    expect(splitPath(parsePathString(shapes.relative[1])).length).to.equal(7);
    expect(isMultiPath("M10 50Q25 25 40 50")).to.eq(false);
    expect(isMultiPath("1")).to.eq(false);

    try {
      // @ts-expect-error - testing weird value
      isMultiPath(false);
    } catch (e) {
      expect(e).to.be.instanceOf(TypeError);
      expect(e).to.have.property("message", `${error}: expected string or PathArray`);
    }

    expect(
      pathToString(
        optimizePath(
          parsePathString(
            // 'M10 50q15 -25 30 0Q55 75 70 50Q85 25 100 50T130 50Q145 25 160 50t30 0'
            simpleShapes.normalized[2],
          ),
          2,
        ),
      ),
    ).to.equal(simpleShapes.initial[2]);

    // @ts-expect-error - testing weird default round value
    defaultOptions.round = "-1";
    expect(shortenSegment(["L", 0, 0], ["L", 0, 0], { ...paramsParser }, "A")).to.deep.equal([
      "V",
      0,
    ]);
    expect(
      optimizePath([
        ["M", 0, 0],
        ["L", 0, 0],
      ]),
    ).to.deep.equal([
      ["M", 0, 0],
      ["v", 0],
    ]);
    expect(
      roundPath([
        ["M", 0, 0],
        ["L", 0, 0],
      ]),
    ).to.deep.equal([
      ["M", 0, 0],
      ["L", 0, 0],
    ]);

    expect(
      pathToString(
        parsePathString(
          // 'M10 50q15 -25 30 0Q55 75 70 50Q85 25 100 50T130 50Q145 25 160 50t30 0'
          simpleShapes.normalized[2],
        ),
        -2,
      ),
    ).to.equal(
      "M10 50Q25 25 40 50Q55 75 70 50Q85 25 100 50Q115 75 130 50Q145 25 160 50Q175 75 190 50",
    ); // coverage
    // M10 50q15 -25 30 0t30 0t30 0t30 0t30 0t30 0
    defaultOptions.round = 4;
  });
});

describe("Static method consistency", () => {
  const {
    parsePathString,
    pathToString,
    pathToAbsolute,
    pathToRelative,
    pathToCurve,
    getTotalLength,
    getPointAtLength,
    getPropertiesAtLength,
    getSegmentAtLength,
    getPropertiesAtPoint,
    getSegmentOfPoint,
    getClosestPoint,
    isPointInStroke,
    getPathBBox,
    getPathArea,
    transformPath,
    getSVGMatrix,
    projection2d,
    reversePath,
    optimizePath,
    normalizePath,
    splitPath,
    pathsIntersection,
    boundingBoxIntersect,
    isPointInsideBBox,
    arcTools,
    bezierTools,
    cubicTools,
    quadTools,
    lineTools,
    polygonTools,
  } = SVGPathCommander;

  test("Can do length-based segment lookup consistently", () => {
    const path = simpleShapes.initial[0];
    const total = getTotalLength(path);
    const d = total / 3;
    const point = getPointAtLength(path, d);
    expect(getSegmentOfPoint(path, point)!.index).to.equal(getPropertiesAtLength(path, d).index);
    expect(getSegmentAtLength(path, d)).to.deep.equal(getPropertiesAtLength(path, d).segment);
    const end = getPropertiesAtLength(path, total);
    expect(end.index).to.equal(parsePathString(path).length - 1);
    expect(end.lengthAtSegment + end.length).to.be.closeTo(total, 0.001);
  });

  test("Can measure the length of an empty path", () => {
    expect(getTotalLength("")).to.equal(0);
    expect(getTotalLength([] as unknown as PathArray)).to.equal(0);
  });

  test("Can do point-based lookup consistently", () => {
    const path = simpleShapes.initial[0];
    const props = getPropertiesAtPoint(path, { x: 30, y: 45 });
    expect(getClosestPoint(path, { x: 30, y: 45 })).to.deep.equal(props.closest);
    expect(getSegmentOfPoint(path, { x: 30, y: 45 })).to.deep.equal(props.segment);
    expect(isPointInStroke(path, props.closest)).to.equal(true);
    expect(isPointInStroke(path, { x: -500, y: -500 })).to.equal(false);
  });

  test("Can convert and process consistently", () => {
    const path = simpleShapes.initial[0];
    expect(pathToString(pathToAbsolute(pathToRelative(path)), 4)).to.equal(
      pathToString(pathToAbsolute(path), 4),
    );
    expect(pathToString(normalizePath(path), 4)).to.equal(
      pathToString(normalizePath(normalizePath(path)), 4),
    );
    expect(pathToString(optimizePath(path), 4)).to.equal(
      pathToString(optimizePath(optimizePath(path)), 4),
    );
    expect(pathToString(parsePathString(pathToString(parsePathString(path), 4)), 4)).to.equal(
      pathToString(parsePathString(path), 4),
    );
    expect(pathToString(reversePath(reversePath(normalizePath(path))), 4)).to.equal(
      pathToString(normalizePath(path), 4),
    );
    const subpaths = splitPath(parsePathString(shapes.relative[1]));
    expect(subpaths.reduce((sum, sub) => sum + getTotalLength(sub), 0)).to.be.closeTo(
      getTotalLength(shapes.relative[1]),
      0.001,
    );
    expect(pathToCurve(path)).to.deep.equal(pathToCurve(pathToAbsolute(path)));
  });

  test("Can transform and project consistently", () => {
    const path = simpleShapes.initial[0];
    const bbox = getPathBBox(path);
    const tbbox = getPathBBox(transformPath(path, { translate: [5, 7] }));
    expect(tbbox.x).to.equal(bbox.x + 5);
    expect(tbbox.y).to.equal(bbox.y + 7);
    expect(tbbox.x2).to.equal(bbox.x2 + 5);
    expect(tbbox.y2).to.equal(bbox.y2 + 7);
    expect(tbbox.width).to.equal(bbox.width);
    expect(tbbox.height).to.equal(bbox.height);
    const matrix = getSVGMatrix({ translate: [5, 7], origin: [0, 0, 0] });
    expect(projection2d(matrix, [0, 0], [0, 0, 0])).to.deep.equal([5, 7]);
    expect(getSVGMatrix({ scale: 2, origin: [0, 0, 0] }).m11).to.equal(2);
  });

  test("Can measure geometry consistently", () => {
    const square = "M0 0L10 0L10 10L0 10Z";
    expect(getPathArea(square)).to.equal(100);
    expect(getPathArea(square)).to.equal(
      Math.abs(
        polygonTools.polygonArea([
          [0, 0],
          [10, 0],
          [10, 10],
          [0, 10],
        ]),
      ),
    );
    expect(
      polygonTools.polygonLength([
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
        [0, 0],
      ]),
    ).to.equal(getTotalLength(square));
    expect(lineTools.getLineLength(0, 0, 30, 40)).to.equal(getTotalLength("M0 0L30 40"));
    expect(cubicTools.getCubicLength(0, 0, 10, 20, 30, 5, 40, 0)).to.equal(
      getTotalLength("M0 0C10 20 30 5 40 0"),
    );
    expect(quadTools.getQuadLength(0, 0, 25, 40, 50, 0)).to.equal(
      getTotalLength("M0 0Q25 40 50 0"),
    );
    expect(arcTools.getArcLength(0, 0, 10, 5, 0, 0, 1, 20, 0)).to.equal(
      getTotalLength("M0 0A10 5 0 0 1 20 0"),
    );
    const curve = [0, 0, 10, 20, 30, 5, 40, 0] as never;
    expect(bezierTools.getBezierLength(curve)).to.equal(
      cubicTools.getCubicLength(0, 0, 10, 20, 30, 5, 40, 0),
    );
    expect(bezierTools.getBezierLengthAtT(curve, 1)).to.equal(bezierTools.getBezierLength(curve));
    expect(bezierTools.getBezierLengthAtT(curve, 0)).to.equal(0);
    expect(arcTools.arcLength(10, 10, Math.PI * 2)).to.be.closeTo(2 * Math.PI * 10, 0.001);
  });

  test("Can compute intersections consistently", () => {
    const pts = pathsIntersection("M0 0L100 0", "M50 -10L50 10", false) as IntersectionPoint[];
    expect(pts).to.have.length(1);
    expect(pts[0].x).to.be.closeTo(50, 0.001);
    expect(pts[0].y).to.be.closeTo(0, 0.001);
    expect(pathsIntersection("M0 0L100 0", "M50 -10L50 10", true)).to.equal(1);
    expect(boundingBoxIntersect([0, 0, 10, 10], [100, 100, 110, 110])).to.equal(false);
    expect(pathsIntersection("M0 0L10 10", "M105 105L110 100", true)).to.equal(0);
    expect(isPointInsideBBox([0, 0, 100, 100], [50, 50])).to.equal(true);
    expect(isPointInsideBBox([0, 0, 100, 100], [150, 50])).to.equal(false);
    const path = simpleShapes.initial[3];
    const bbox = getPathBBox(path);
    const mid = getPointAtLength(path, getTotalLength(path) / 2);
    expect(isPointInsideBBox([bbox.x, bbox.y, bbox.x2, bbox.y2], [mid.x, mid.y])).to.equal(true);
  });
});

describe("T/t shorthand with no preceding Q/T uses the current point as control", () => {
  const { getPathBBox, getTotalLength, normalizePath } = SVGPathCommander;

  test("Can compute the bbox of a t following a curve command", () => {
    const bbox = getPathBBox("M486.7 242c0 0 0 0 0 0t0 0l10 10");
    expect(bbox.x).to.be.closeTo(486.7, 0.001);
    expect(bbox.y).to.be.closeTo(242, 0.001);
    expect(bbox.x2).to.be.closeTo(496.7, 0.001);
    expect(bbox.y2).to.be.closeTo(252, 0.001);
  });

  test("Can compute the length of a t following a curve command", () => {
    expect(getTotalLength("M486.7 242c0 0 0 0 0 0t0 0l10 10")).to.be.closeTo(Math.sqrt(200), 0.001);
  });

  test("Can normalize a T to the current point when no Q precedes it", () => {
    expect(normalizePath("M0 0L10 10T20 20")).to.deep.equal([
      ["M", 0, 0],
      ["L", 10, 10],
      ["Q", 10, 10, 20, 20],
    ]);
  });

  test("Can still reflect the control point of a T following a Q", () => {
    const bbox = getPathBBox("M0 0Q10 10 20 0T40 0");
    expect(bbox.x).to.be.closeTo(0, 0.001);
    expect(bbox.y).to.be.closeTo(-5, 0.001);
    expect(bbox.x2).to.be.closeTo(40, 0.001);
    expect(bbox.y2).to.be.closeTo(5, 0.001);
    expect(normalizePath("M0 0Q10 10 20 0T40 0")).to.deep.equal([
      ["M", 0, 0],
      ["Q", 10, 10, 20, 0],
      ["Q", 30, -10, 40, 0],
    ]);
  });
});

describe("S/s shorthand and arc bounds fixes", () => {
  const {
    getPathBBox,
    getTotalLength,
    normalizePath,
    parsePathString,
    pathToCurve,
    pathToString,
    reversePath,
    transformPath,
  } = SVGPathCommander;

  test("Can compute the bbox of a rotated arc with an angle over 90 degrees", () => {
    const arc = "M-4 0A22 5 156 0 0 3 -21";
    const bbox = getPathBBox(arc);
    expect(bbox.x).to.be.closeTo(-4, 0.01);
    expect(bbox.y).to.be.closeTo(-27.264, 0.01);
    expect(bbox.x2).to.be.closeTo(33.207, 0.01);
    expect(bbox.y2).to.be.closeTo(0, 0.01);
  });

  test("Can compute the bbox of a rotated arc the same way as the curve conversion", () => {
    const arc = "M-4 0A22 5 156 0 0 3 -21";
    const curve = pathToString(pathToCurve(arc));
    const arcBox = getPathBBox(arc);
    const curveBox = getPathBBox(curve);
    expect(curveBox.x).to.be.closeTo(arcBox.x, 0.5);
    expect(curveBox.y).to.be.closeTo(arcBox.y, 0.5);
    expect(curveBox.x2).to.be.closeTo(arcBox.x2, 0.5);
    expect(curveBox.y2).to.be.closeTo(arcBox.y2, 0.5);
  });

  test("Can normalize an S following a Q with the current point as control point", () => {
    expect(normalizePath("M10 10Q20 30 30 10S50 30 60 10")).to.deep.equal([
      ["M", 10, 10],
      ["Q", 20, 30, 30, 10],
      ["C", 30, 10, 50, 30, 60, 10],
    ]);
  });

  test("Can normalize an S following an A with the current point as control point", () => {
    expect(normalizePath("M0 0A10 10 0 0 1 20 0S40 30 50 0")).to.deep.equal([
      ["M", 0, 0],
      ["A", 10, 10, 0, 0, 1, 20, 0],
      ["C", 20, 0, 40, 30, 50, 0],
    ]);
  });

  test("Can reflect the control point of an S following a C with a zero coordinate", () => {
    expect(normalizePath("M10 10C10 10 0 20 10 20S20 30 30 20")).to.deep.equal([
      ["M", 10, 10],
      ["C", 10, 10, 0, 20, 10, 20],
      ["C", 20, 20, 20, 30, 30, 20],
    ]);
  });

  test("Can compute the same length for a path and its normalized version", () => {
    const path = "M10 10Q20 30 30 10S50 30 60 10";
    expect(getTotalLength(pathToString(normalizePath(path)))).to.be.closeTo(
      getTotalLength(path),
      0.001,
    );
    expect(getTotalLength(pathToString(pathToCurve(path)))).to.be.closeTo(
      getTotalLength(path),
      0.001,
    );
  });

  test("Can reverse a path with a trailing moveto without NaN values", () => {
    const reversed = pathToString(reversePath("M0 0L10 0L10 10Zm4 4"));
    expect(reversed).to.not.contain("NaN");
    expect(reversed).to.equal("M10 10L10 0L0 0ZM4 4");
  });

  test("Can reverse every sub-path of a path on its own", () => {
    const path = "M0 0L10 0L10 10ZM4 4L8 8Z";
    const reversed = pathToString(reversePath(path));
    expect(reversed).to.equal("M10 10L10 0L0 0ZM8 8L4 4Z");
    expect(reversed).to.equal(new SVGPathCommander(path).reverse().toString());
    expect(getTotalLength(reversed)).to.be.closeTo(getTotalLength(path), 0.001);
  });

  test("Can reverse a path with sub-paths without changing the sub-path order", () => {
    const path = "M0 0L10 0L10 10ZM4 4L8 8ZM20 20L30 20Z";
    const reversed = pathToString(reversePath(path));
    expect(reversed).to.equal("M10 10L10 0L0 0ZM8 8L4 4ZM30 20L20 20Z");
    expect(pathToString(reversePath(reversePath(path)))).to.equal(path);
  });

  test("Can reverse a path with sub-paths and keep the length", () => {
    const path = "M0 0L10 0L10 10Zm4 4";
    const reversed = pathToString(reversePath(path));
    expect(reversed).to.equal("M10 10L10 0L0 0ZM4 4");
    expect(getTotalLength(reversed)).to.be.closeTo(getTotalLength(path), 0.001);
    expect(pathToString(reversePath(reversePath(path)))).to.equal("M0 0L10 0L10 10ZM4 4");
  });

  test("Can reverse an empty path without throwing", () => {
    expect(reversePath("")).to.deep.equal([]);
  });

  test("Can reverse an S segment that is not preceded by a cubic", () => {
    const path = "M0 0L10 0S20 10 30 0";
    const reversed = pathToString(reversePath(path));
    expect(reversed).to.equal("M30 0C20 10 10 0 10 0L0 0");
    expect(getTotalLength(reversed)).to.be.closeTo(getTotalLength(path), 0.001);
  });

  test("Can reverse a T segment that is followed by a Q segment", () => {
    const path = "M0 0L10 0T20 20Q30 30 40 40";
    const reversed = pathToString(reversePath(path));
    expect(reversed).to.equal("M40 40Q30 30 20 20Q10 0 10 0L0 0");
    expect(getTotalLength(reversed)).to.be.closeTo(getTotalLength(path), 0.001);
  });

  test("Can reverse every command sequence without changing the geometry", () => {
    const mismatches: string[] = [];
    let checked = 0;
    for (const length of [3, 4]) {
      for (const sequence of commandSequences(length)) {
        const source = buildReverseCase(sequence);
        const path = parsePathString(source);
        const expected = expectedReverse(normalizePath(path));
        const actual = normalizePath(reversePath(path));
        checked += 1;
        if (!sameGeometry(expected, actual)) mismatches.push(sequence.join(""));
      }
    }
    expect(checked).to.equal(2744);
    expect(mismatches).to.deep.equal([]);
  });

  test("Can optimize a cubic without rewriting it as a smooth cubic", () => {
    const path = "M0 0C5 5 10 10 10 10C40 -50 10 10 30 10";
    const optimized = pathToString(SVGPathCommander.optimizePath(path));
    expect(optimized).to.equal("M0 0c5 5 10 10 10 10c30 -60 0 0 20 0");
    expect(getTotalLength(optimized)).to.be.closeTo(getTotalLength(path), 0.001);
  });

  test("Can still shorten a cubic to a smooth cubic when the control points match", () => {
    const path = "M0 0C10 10 20 20 30 0C40 -20 50 20 60 0";
    expect(pathToString(SVGPathCommander.optimizePath(path))).to.contain("s");
  });

  test("Can transform a path with an S segment without changing the shape", () => {
    const path = "M0 0L10 0S20 10 30 0";
    const transformed = pathToString(transformPath(path, { translate: [5, 5] }));
    expect(getTotalLength(transformed)).to.be.closeTo(getTotalLength(path), 0.001);
  });
});

describe("Arc conversion fixes", () => {
  const { arcToCubic, getTotalLength, pathToCurve, pathToString } = SVGPathCommander;

  test("Can convert a zero radius arc to a straight line", () => {
    const curve = pathToCurve("M0 0A0 0 0 1 1 100 100");
    expect(pathToString(curve)).to.equal("M0 0C33.3333 33.3333 66.6667 66.6667 100 100");
    expect(pathToString(curve)).to.not.contain("NaN");
  });

  test("Can measure a zero radius arc as a straight line", () => {
    expect(getTotalLength("M0 0A0 0 0 1 1 100 100")).to.be.closeTo(Math.sqrt(20000), 0.001);
    expect(getTotalLength("M0 0A25 0 0 1 1 100 0")).to.be.closeTo(100, 0.001);
  });

  test("Can convert a zero radius arc to the same length as the arc", () => {
    const arc = "M0 0A0 0 0 1 1 100 100";
    expect(getTotalLength(pathToCurve(arc))).to.be.closeTo(getTotalLength(arc), 0.001);
  });

  test("Can convert an arc with negative radii using their absolute value", () => {
    expect(arcToCubic(0, 0, -25, 25, 0, 1, 1, 50, 0)).to.deep.equal(
      arcToCubic(0, 0, 25, 25, 0, 1, 1, 50, 0),
    );
    expect(arcToCubic(0, 0, 25, -25, 0, 1, 1, 50, 0)).to.deep.equal(
      arcToCubic(0, 0, 25, 25, 0, 1, 1, 50, 0),
    );
  });

  test("Can convert an arc with negative radii to the same length as the arc", () => {
    const negative = "M0 0A-25 25 0 1 1 50 0";
    const positive = "M0 0A25 25 0 1 1 50 0";
    // a cubic is only an approximation of an elliptical arc, the same small
    // gap exists for positive radii
    expect(getTotalLength(pathToCurve(negative))).to.be.closeTo(
      getTotalLength(pathToCurve(positive)),
      0.001,
    );
    expect(getTotalLength(pathToCurve(negative))).to.be.closeTo(getTotalLength(negative), 0.1);
  });
});

describe("Empty input contract", () => {
  const {
    getClosestPoint,
    getPathBBox,
    getPointAtLength,
    getPropertiesAtLength,
    getPropertiesAtPoint,
    getSegmentAtLength,
    getSegmentOfPoint,
    getSVGMatrix,
    isClosedPath,
    isPointInStroke,
    isValidPath,
    roundPath,
    transformPath,
  } = SVGPathCommander;

  const emptyInputs = ["", [], "   "] as unknown[];

  test("Can get the bounding box of an empty path", () => {
    const expected = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0,
    };
    emptyInputs.forEach((input) => {
      expect(getPathBBox(input as PathArray)).to.deep.equal(expected);
    });
  });

  test("Can reject a malformed path segment with a descriptive error", () => {
    [[[]], [[1, 2, 3]], [[null]]].forEach((input) => {
      try {
        expect(getPathBBox(input as unknown as PathArray));
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property("message", `${error}: invalid path segment at index 0`);
      }
    });
  });

  test("Can reject a malformed path segment after the first one", () => {
    const input = [["M", 0, 0], []] as unknown as PathArray;
    expect(() => getPathBBox(input)).to.throw(
      TypeError,
      `${error}: invalid path segment at index 1`,
    );
  });

  test("Can get a point of an empty path", () => {
    emptyInputs.forEach((input) => {
      expect(getPointAtLength(input as PathArray, 10)).to.deep.equal({ x: 0, y: 0 });
    });
  });

  test("Can tell that an empty path is not closed", () => {
    emptyInputs.forEach((input) => {
      expect(isClosedPath(input as PathArray)).to.be.false;
    });
  });

  test("Can get the properties of a point of an empty path", () => {
    emptyInputs.forEach((input) => {
      expect(getPropertiesAtPoint(input as PathArray, { x: 1, y: 1 })).to.deep.equal({
        closest: { x: 0, y: 0 },
        distance: Infinity,
      });
      expect(getSegmentOfPoint(input as PathArray, { x: 1, y: 1 })).to.be.undefined;
      expect(getClosestPoint(input as PathArray, { x: 1, y: 1 })).to.deep.equal({ x: 0, y: 0 });
      // an empty path has no stroke
      expect(isPointInStroke(input as PathArray, { x: 1, y: 1 })).to.be.false;
    });
  });

  test("Can get the properties of an empty path at a length", () => {
    emptyInputs.forEach((input) => {
      expect(getPropertiesAtLength(input as PathArray)).to.deep.equal({
        segment: ["M", 0, 0],
        index: 0,
        length: 0,
        lengthAtSegment: 0,
        point: { x: 0, y: 0 },
        tangent: { x: 0, y: 0 },
        normal: { x: 0, y: 0 },
        angle: 0,
      });
      expect(getSegmentAtLength(input as PathArray)).to.deep.equal(["M", 0, 0]);
    });
  });

  test("Can get the properties of a path at a negative length", () => {
    [-5, -0.0001].forEach((distance) => {
      expect(getPropertiesAtLength("M0 0L10 10", distance)).to.deep.equal({
        segment: ["M", 0, 0],
        index: 0,
        length: 0,
        lengthAtSegment: 0,
        point: { x: 0, y: 0 },
        tangent: { x: 0, y: 0 },
        normal: { x: 0, y: 0 },
        angle: 0,
      });
      expect(getSegmentAtLength("M0 0L10 10", distance)).to.deep.equal(["M", 0, 0]);
    });
  });

  test("Can round a path without modifying the source array", () => {
    const source: PathArray = [
      ["M", 0, 0],
      ["L", 1.23456, 2.34567],
    ];
    const rounded = roundPath(source, 2);
    expect(rounded).to.deep.equal([
      ["M", 0, 0],
      ["L", 1.23, 2.35],
    ]);
    expect(source).to.deep.equal([
      ["M", 0, 0],
      ["L", 1.23456, 2.34567],
    ]);
    expect(rounded).to.not.equal(source);
  });

  test("Can transform a path without modifying the source transform", () => {
    const transform = { scale: 2 };
    expect(transformPath("M0 0L10 10", transform)).to.deep.equal([
      ["M", 0, 0],
      ["L", 20, 20],
    ]);
    expect(transform).to.deep.equal({ scale: 2 });
    expect("origin" in transform).to.be.false;
  });

  test("Can transform a path without modifying the global default origin", () => {
    const transform = { scale: 2, origin: [1, 2, 3] };
    transformPath("M0 0L10 10", transform);
    transform.origin[0] = 999;
    expect(SVGPathCommander.options.origin).to.deep.equal([0, 0, 0]);
  });

  test("Can get a transformation matrix without an origin", () => {
    const matrix = getSVGMatrix({ scale: 2 });
    expect(matrix.a).to.equal(2);
    expect(matrix.d).to.equal(2);
  });

  test("Can tell that a whitespace only path is invalid", () => {
    expect(isValidPath("   ")).to.be.false;
    expect(isValidPath("")).to.be.false;
    expect(isValidPath(" M0 0 ")).to.be.true;
    expect(isValidPath("L0 0")).to.be.false;
  });
});

describe("Morph and path utility fixes", () => {
  const { getPathBBox, isPathArray, normalizePath, projection2d, splitPath } = SVGPathCommander;

  test("Can split a line into segments of equal length", () => {
    [2, 3, 4, 10].forEach((count) => {
      const pieces = splitLineToCount(0, 0, 90, 0, count);
      expect(pieces).to.have.lengthOf(count);
      pieces.forEach(([x1, y1, x2, y2]) => {
        expect(Math.hypot(x2 - x1, y2 - y1)).to.be.closeTo(90 / count, 1e-9);
      });
      // the pieces must cover the whole line
      expect(pieces[0][0]).to.equal(0);
      expect(pieces[count - 1][2]).to.equal(90);
    });
  });

  test("Can match paths without destroying the source arrays", () => {
    const makeFeature = (path: string): PathFeature => {
      const p = normalizePath(path);
      const bbox = getPathBBox(path);
      return {
        path: p,
        bbox,
        size: bbox.width * bbox.height,
        signedArea: 0,
        area: 0,
        isPoly: false,
      };
    };

    const from = [makeFeature("M0 0L10 0"), makeFeature("M5 5L20 5")];
    const to = [makeFeature("M0 0L12 0"), makeFeature("M7 7L22 7")];
    const fromBefore = JSON.stringify(from);
    const toBefore = JSON.stringify(to);

    expect(matchPaths(from, to)).to.have.lengthOf(3);
    expect(JSON.stringify(from)).to.equal(fromBefore);
    expect(JSON.stringify(to)).to.equal(toBefore);
  });

  test("Can split a path that does not start with a moveto", () => {
    // a path must begin with a moveto command, so the parser rejects it
    expect(() =>
      splitPath([
        ["L", 0, 0],
        ["M", 10, 10],
        ["L", 20, 20],
      ] as unknown as PathArray),
    ).to.throw(TypeError, `${error}: path data must begin with a moveto command`);
  });

  test("Can split a relative path into absolute sub-paths", () => {
    expect(splitPath("M0 0l100 0l0 100z")).to.deep.equal([
      [["M", 0, 0], ["L", 100, 0], ["L", 100, 100], ["Z"]],
    ]);
  });

  test("Can split a path that starts with a relative moveto", () => {
    expect(splitPath("m10 10l20 0")).to.deep.equal([
      [
        ["M", 10, 10],
        ["L", 30, 10],
      ],
    ]);
    expect(splitPath("M0 0m50 50l10 0")).to.deep.equal([
      [["M", 0, 0]],
      [
        ["M", 50, 50],
        ["L", 60, 50],
      ],
    ]);
  });

  test("Can tell that a malformed path array is not a path array", () => {
    [[[]], [[1, 2, 3]], [[null]], [null], ["M0 0"]].forEach((input) => {
      expect(isPathArray(input)).to.be.false;
    });
    expect(
      isPathArray([
        ["M", 0, 0],
        ["L", 10, 10],
      ]),
    ).to.be.true;
  });

  test("Can project a point without producing NaN", () => {
    const matrix = new CSSMatrix();
    matrix.m43 = 500;
    const projected = projection2d(matrix, [10, 20], [0, 0, 500]);
    expect(projected[0]).to.be.a("number").and.not.NaN;
    expect(projected[1]).to.be.a("number").and.not.NaN;
  });

  test("Can classify an outer path and its hole", () => {
    const squareWithHole = "M0 0L100 0L100 100L0 100ZM25 25L75 25L75 75L25 75Z";
    const { outers, inners } = classifyPaths(splitPath(squareWithHole) as never);
    expect(outers).to.have.lengthOf(1);
    expect(inners).to.have.lengthOf(1);
    expect(outers[0].area).to.equal(10000);
    expect(inners[0].area).to.equal(2500);
  });

  test("Can classify two separate paths as two outers", () => {
    const twoSquares = "M0 0L100 0L100 100L0 100ZM500 500L600 500L600 600L500 600Z";
    const { outers, inners } = classifyPaths(splitPath(twoSquares) as never);
    expect(outers).to.have.lengthOf(2);
    expect(inners).to.have.lengthOf(0);
  });
});

describe("Parser and input edge cases", () => {
  const { getPropertiesAtLength, getSegmentAtLength, parsePathString, pathToAbsolute } =
    SVGPathCommander;

  test("Can parse a number with a leading zero", () => {
    // the SVG path grammar allows any digit sequence, "09" is a valid number
    expect(parsePathString("M09 09")).to.deep.equal([["M", 9, 9]]);
    expect(parsePathString("M04 36.9")).to.deep.equal([["M", 4, 36.9]]);
    expect(parsePathString("M00.5 0.5")).to.deep.equal([["M", 0.5, 0.5]]);
  });

  test("Can reject a number that overflows the double range", () => {
    try {
      parsePathString("M1e999 0");
      expect.fail("should have thrown");
    } catch (e) {
      expect(e).to.be.instanceOf(TypeError);
      expect(e).to.have.property(
        "message",
        `${error}: ${invalidPathValue} at index 1, "1e999" is not a finite number`,
      );
    }
  });

  test("Can make a leading relative moveto absolute", () => {
    expect(
      pathToAbsolute([
        ["m", 10, 10],
        ["l", 80, 80],
      ]),
    ).to.deep.equal([
      ["M", 10, 10],
      ["L", 90, 90],
    ]);
  });

  test("Can rewrite a leading relative moveto of a path string", () => {
    // a leading relative moveto is a pair of absolute coordinates
    expect(parsePathString("m10 10")).to.deep.equal([["M", 10, 10]]);
    expect(parsePathString("m10 10l20 20")).to.deep.equal([
      ["M", 10, 10],
      ["l", 20, 20],
    ]);
  });

  test("Can rewrite a leading relative moveto of a path array", () => {
    const input = [
      ["m", 10, 10],
      ["l", 20, 20],
    ] as unknown as PathArray;
    expect(parsePathString(input)).to.deep.equal([
      ["M", 10, 10],
      ["l", 20, 20],
    ]);
    // the caller's array is not modified
    expect(input[0][0]).to.equal("m");
  });

  test("Can reject a path that does not begin with a moveto", () => {
    const invalidPaths = ["L10 10", "h10", "v10", "C1 2 3 4 5 6", "A5 5 0 0 1 10 10", "Z"];
    invalidPaths.forEach((path) => {
      expect(() => parsePathString(path)).to.throw(
        TypeError,
        `${error}: path data must begin with a moveto command`,
      );
    });
  });

  test("Can reject a path array that does not begin with a moveto", () => {
    const invalidPaths = [
      [["L", 10, 10]],
      [["h", 10]],
      [["v", 10]],
      [["C", 1, 2, 3, 4, 5, 6]],
      [["A", 5, 5, 0, 0, 1, 10, 10]],
      [["Z"]],
    ];
    invalidPaths.forEach((path) => {
      expect(() => parsePathString(path as unknown as PathArray)).to.throw(
        TypeError,
        `${error}: path data must begin with a moveto command`,
      );
    });
  });

  test("Can reject a malformed first segment of a path array", () => {
    expect(() => parsePathString([[]] as unknown as PathArray)).to.throw(
      TypeError,
      `${error}: invalid path segment at index 0`,
    );
  });

  test("Can parse an empty path", () => {
    expect(parsePathString("")).to.deep.equal([]);
    expect(parsePathString([] as unknown as PathArray)).to.deep.equal([]);
  });

  test("Can drop an incomplete point of a polyline", () => {
    expect(getPolyPath({ type: "polygon", points: "0,0 100,0 100" })).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
      ["z"],
    ]);
    expect(getPolyPath({ type: "polyline", points: "0,0 100,0" })).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
    ]);
    // an invalid point is dropped too
    expect(getPolyPath({ type: "polyline", points: "0,0 abc,10" })).to.deep.equal([["M", 0, 0]]);
  });

  test("Can clamp an infinite distance to the last segment", () => {
    expect(getSegmentAtLength("M0 0L10 10L20 20", Infinity)).to.deep.equal(["L", 20, 20]);
    expect(getSegmentAtLength("M0 0L10 10L20 20", 1e9)).to.deep.equal(["L", 20, 20]);
  });

  test("Can get the properties of a length inside the first segment", () => {
    // a path must begin with a moveto command, so a path that does not is
    // rejected before any property is read
    expect(() =>
      getPropertiesAtLength(
        [
          ["L", 10, 10],
          ["L", 20, 20],
        ] as unknown as PathArray,
        5,
      ),
    ).to.throw(TypeError, `${error}: path data must begin with a moveto command`);
  });

  test("Can get the properties of a length inside the first segment of a valid path", () => {
    expect(
      getPropertiesAtLength(
        [
          ["M", 0, 0],
          ["L", 10, 10],
          ["L", 20, 20],
        ] as unknown as PathArray,
        5,
      ),
    ).to.deep.equal({
      segment: ["L", 10, 10],
      index: 1,
      length: 14.142135623730951,
      lengthAtSegment: 0,
      point: { x: 3.5355339059327373, y: 3.5355339059327373 },
      tangent: { x: 0.7071067811865475, y: 0.7071067811865475 },
      normal: { x: -0.7071067811865475, y: 0.7071067811865475 },
      angle: 45,
    });
  });
});

describe("Length table edge cases", () => {
  const { getPointAtLength, lineTools, quadTools, arcTools } = SVGPathCommander;

  test("Can get the point of a path that ends with a moveto", () => {
    // the moveto is the last segment of the path, so it holds the point
    expect(getPointAtLength("M0 0L10 10M20 20", 100)).to.deep.equal({ x: 20, y: 20 });
  });

  test("Can get the point of a path that ends with a close segment", () => {
    // the close segment returns to the start of the sub-path
    expect(getPointAtLength("M0 0L10 10Z", 100)).to.deep.equal({ x: 0, y: 0 });
  });

  test("Can clamp a negative distance to the start of a segment", () => {
    expect(lineTools.getPointAtLineLength(0, 0, 10, 10, -1)).to.deep.equal({ x: 0, y: 0 });
    expect(quadTools.getPointAtQuadLength(0, 0, 5, 5, 10, 0, -1)).to.deep.equal({ x: 0, y: 0 });
    expect(arcTools.getPointAtArcLength(0, 0, 10, 10, 0, 0, 1, 10, 0, -1)).to.deep.equal({
      x: 0,
      y: 0,
    });
  });

  test("Can stop the iteration over a path early", () => {
    const path = [
      ["M", 0, 0],
      ["L", 10, 10],
      ["L", 20, 20],
    ] as PathArray;
    const visited: number[] = [];
    iterate(path, (_segment, index) => {
      visited.push(index);
      return index === 0 ? false : undefined;
    });
    expect(visited).to.deep.equal([0]);
  });
});

describe("Tangent, normal and angle at length", () => {
  const { getPropertiesAtLength, getPointAtLength, getTotalLength } = SVGPathCommander;

  test("Can get the frame of a line segment", () => {
    const horizontal = getPropertiesAtLength("M0 0L100 0", 50);
    expect(horizontal.point).to.deep.equal({ x: 50, y: 0 });
    expect(horizontal.tangent).to.deep.equal({ x: 1, y: 0 });
    expect(horizontal.normal).to.deep.equal({ x: 0, y: 1 });
    expect(horizontal.angle).to.equal(0);

    const vertical = getPropertiesAtLength("M0 0L0 100", 50);
    expect(vertical.tangent).to.deep.equal({ x: 0, y: 1 });
    expect(vertical.normal).to.deep.equal({ x: -1, y: 0 });
    expect(vertical.angle).to.equal(90);

    const backwards = getPropertiesAtLength("M0 0L-100 0", 50);
    expect(backwards.tangent).to.deep.equal({ x: -1, y: 0 });
    expect(backwards.normal).to.deep.equal({ x: 0, y: -1 });
    expect(backwards.angle).to.equal(180);

    const diagonal = getPropertiesAtLength("M0 0L100 100", 50);
    expect(diagonal.point).to.deep.equal({ x: 35.35533905932737, y: 35.35533905932737 });
    expect(diagonal.tangent).to.deep.equal({
      x: 0.7071067811865475,
      y: 0.7071067811865475,
    });
    expect(diagonal.normal).to.deep.equal({
      x: -0.7071067811865475,
      y: 0.7071067811865475,
    });
    expect(diagonal.angle).to.equal(45);
  });

  test("Can get the frame of a cubic segment", () => {
    const frame = getPropertiesAtLength("M0 0C0 0 100 0 100 100", 50);
    expectPointClose(frame.point, { x: 48.273201847124525, y: 11.656181543145468 });
    expectPointClose(frame.tangent, { x: 0.9024046988983104, y: 0.4308894979066554 });
    expectPointClose(frame.normal, { x: -0.4308894979066554, y: 0.9024046988983104 });
    expect(frame.angle).to.be.closeTo(25.52402316443056, 1e-9);
  });

  test("Can get the frame of a quadratic segment", () => {
    const frame = getPropertiesAtLength("M0 0Q50 50 100 0", 50);
    expectPointClose(frame.point, { x: 42.636848986148834, y: 24.457840071472226 });
    expectPointClose(frame.tangent, { x: 0.9893300359628503, y: 0.14569172914666542 });
    expectPointClose(frame.normal, { x: -0.14569172914666542, y: 0.9893300359628503 });
    expect(frame.angle).to.be.closeTo(8.377337735860417, 1e-9);
  });

  test("Can get the frame of an arc segment", () => {
    const sweep = getPropertiesAtLength("M0 0A50 50 0 0 1 50 50", 50);
    expectPointClose(sweep.point, { x: 42.07354878288382, y: 22.98488399406185 });
    expectPointClose(sweep.tangent, { x: 0.540302320118763, y: 0.8414709756576764 });
    expectPointClose(sweep.normal, { x: -0.8414709756576764, y: 0.540302320118763 });
    expect(sweep.angle).to.be.closeTo(57.295778542757034, 1e-9);

    // the other sweep draws the arc the other way around
    const counterSweep = getPropertiesAtLength("M0 0A50 50 0 0 0 50 50", 50);
    expectPointClose(counterSweep.point, { x: 22.984883994061846, y: 42.07354878288381 });
    expectPointClose(counterSweep.tangent, { x: 0.8414709756576764, y: 0.5403023201187631 });
    expectPointClose(counterSweep.normal, { x: -0.5403023201187631, y: 0.8414709756576764 });
    expect(counterSweep.angle).to.be.closeTo(32.70422145724297, 1e-9);

    // a rotated ellipse has a rotated tangent
    const rotated = getPropertiesAtLength("M0 0A50 25 45 1 0 50 50", 50);
    expectPointClose(rotated.point, { x: -24.429616776724323, y: 26.619205549064553 });
    expectPointClose(rotated.tangent, { x: 0.34778332760473246, y: 0.9375749340933659 });
    expectPointClose(rotated.normal, { x: -0.9375749340933659, y: 0.34778332760473246 });
    expect(rotated.angle).to.be.closeTo(69.64820667409153, 1e-9);
  });

  test("Can get the frame of a zero radius arc", () => {
    // a zero radius is a straight line to the end point
    const frame = getPropertiesAtLength("M0 0A0 5 0 0 1 10 10", 5);
    expect(frame.point).to.deep.equal({ x: 3.5355339059327373, y: 3.5355339059327373 });
    expect(frame.tangent).to.deep.equal({
      x: 0.7071067811865475,
      y: 0.7071067811865475,
    });
  });

  test("Can get the frame of the start of an arc", () => {
    const frame = getPropertiesAtLength("M0 0L10 0A50 50 0 0 1 60 50", 10);
    expect(frame.segment).to.deep.equal(["A", 50, 50, 0, 0, 1, 60, 50]);
    expect(frame.point).to.deep.equal({ x: 10, y: 0 });
    // the arc leaves the point to the right
    expectPointClose(frame.tangent, { x: 1, y: 0 });
    expect(frame.angle).to.be.closeTo(0, 1e-9);
  });

  test("An arc without a sweep has no direction", () => {
    // an arc from a point to the same point has no length at all
    const frame = getPropertiesAtLength("M0 0L10 0A50 50 0 0 1 10 0", 10);
    expect(frame.segment).to.deep.equal(["A", 50, 50, 0, 0, 1, 10, 0]);
    expect(frame.point).to.deep.equal({ x: 10, y: 0 });
    expect(frame.tangent).to.deep.equal({ x: 0, y: 0 });
    expect(frame.normal).to.deep.equal({ x: 0, y: 0 });
    expect(frame.angle).to.equal(0);
  });

  test("Can get the frame of a close segment", () => {
    const frame = getPropertiesAtLength("M0 0L100 0L50 100Z", 300);
    expect(frame.segment).to.deep.equal(["Z"]);
    expectPointClose(frame.point, { x: 10.557280900008408, y: 21.114561800016816 });
    expectPointClose(frame.tangent, { x: -0.4472135954999579, y: -0.8944271909999159 });
    expect(frame.angle).to.be.closeTo(-116.56505117707799, 1e-9);
  });

  test("Can get the frame of the end of a path", () => {
    const frame = getPropertiesAtLength("M0 0L100 0L50 100Z", 400);
    expect(frame.index).to.equal(3);
    expect(frame.point).to.deep.equal({ x: 0, y: 0 });
    expectPointClose(frame.tangent, { x: -0.4472135954999579, y: -0.8944271909999159 });
  });

  test("Can get the frame of a relative path", () => {
    const relative = getPropertiesAtLength("M10 10l20 0", 10);
    expect(relative.point).to.deep.equal({ x: 20, y: 10 });
    expect(relative.tangent).to.deep.equal({ x: 1, y: 0 });
    expect(relative.angle).to.equal(0);
  });

  test("Can get the frame of a shorthand segment", () => {
    // the reflected control point of the smooth cubic is resolved
    const smooth = getPropertiesAtLength("M0 0C10 10 20 20 30 30S50 50 60 60", 50);
    expectPointClose(smooth.point, { x: 35.35533919930458, y: 35.35533919930458 });
    expectPointClose(smooth.tangent, { x: 0.7071067811865475, y: 0.7071067811865475 });

    // the reflected control point of the smooth quadratic is resolved
    const quad = getPropertiesAtLength("M0 0Q10 10 20 0T40 0", 20);
    expectPointClose(quad.point, { x: 17.79298573732376, y: 1.9634686648934219 });
    expectPointClose(quad.tangent, { x: 0.788770538753208, y: -0.6146877558524929 });
  });

  test("A moveto has no direction", () => {
    const frame = getPropertiesAtLength("M0 0", 0);
    expect(frame.point).to.deep.equal({ x: 0, y: 0 });
    expect(frame.tangent).to.deep.equal({ x: 0, y: 0 });
    expect(frame.normal).to.deep.equal({ x: 0, y: 0 });
    expect(frame.angle).to.equal(0);
  });

  test("A line without a length has no direction", () => {
    const frame = getPropertiesAtLength("M0 0L0 0", 1);
    expect(frame.segment).to.deep.equal(["L", 0, 0]);
    expect(frame.point).to.deep.equal({ x: 0, y: 0 });
    expect(frame.tangent).to.deep.equal({ x: 0, y: 0 });
    expect(frame.normal).to.deep.equal({ x: 0, y: 0 });
    expect(frame.angle).to.equal(0);
  });

  test("The frame of a path is a unit frame", () => {
    const paths = [
      "M0 0L100 0L100 100",
      "M0 0C10 10 20 20 30 30S50 50 60 60",
      "M0 0Q50 50 100 0T200 0",
      "M0 0A50 50 0 0 1 50 50",
      "M0 0A50 25 45 1 0 50 50",
      "M0 0h100v100h-100z",
    ];
    paths.forEach((path) => {
      const total = getTotalLength(path);
      for (let i = 0; i <= 20; i += 1) {
        const distance = (total * i) / 20;
        const { point, tangent, normal, angle } = getPropertiesAtLength(path, distance);
        // the point is the point of the lookup
        const lookup = getPointAtLength(path, distance);
        expect(point.x).to.be.closeTo(lookup.x, 1e-9);
        expect(point.y).to.be.closeTo(lookup.y, 1e-9);
        // the tangent is a unit vector, a moveto has no direction at all
        const tangentLength = Math.sqrt(tangent.x ** 2 + tangent.y ** 2);
        expect(tangentLength === 0 || Math.abs(tangentLength - 1) < 1e-9).to.be.true;
        // the normal is perpendicular to the tangent
        expect(tangent.x * normal.x + tangent.y * normal.y).to.be.closeTo(0, 1e-9);
        // the angle is the angle of the tangent, in degrees
        expect(angle).to.be.closeTo((Math.atan2(tangent.y, tangent.x) * 180) / Math.PI, 1e-9);
      }
    });
  });

  test("The tangent agrees with the derivative of the path", () => {
    const paths = [
      "M0 0C10 10 20 20 30 30S50 50 60 60",
      "M0 0Q50 50 100 0T200 0",
      "M0 0A50 50 0 0 1 50 50",
      "M0 0A50 25 45 1 0 50 50",
    ];
    paths.forEach((path) => {
      const total = getTotalLength(path);
      const step = 0.001;
      for (let i = 1; i < 20; i += 1) {
        const distance = (total * i) / 20;
        const { tangent } = getPropertiesAtLength(path, distance);
        const before = getPointAtLength(path, distance - step);
        const after = getPointAtLength(path, distance + step);
        const dx = after.x - before.x;
        const dy = after.y - before.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        // the derivative of the path and the tangent point the same way
        expect((dx / length) * tangent.x + (dy / length) * tangent.y).to.be.closeTo(1, 1e-6);
      }
    });
  });
});

describe("Path simplification", () => {
  const { simplifyPath, getTotalLength, getPointAtLength } = SVGPathCommander;

  /**
   * Returns the maximum distance between the points of a path and a polyline.
   *
   * @param path - the path to sample
   * @param polyline - the polyline to measure against
   * @returns the maximum distance
   */
  const maxDeviation = (path: string, polyline: PathArray): number => {
    const points: { x: number; y: number }[] = [];
    const length = getTotalLength(path);
    const samples = 500;
    for (let i = 0; i <= samples; i += 1) {
      points.push(getPointAtLength(path, (length * i) / samples));
    }

    const segments: [{ x: number; y: number }, { x: number; y: number }][] = [];
    let current = { x: 0, y: 0 };
    let start = { x: 0, y: 0 };
    for (const segment of polyline) {
      const command = segment[0];
      if (command === "M" || command === "m") {
        current = { x: segment[1] as number, y: segment[2] as number };
        start = current;
      } else if (command === "L" || command === "l") {
        const end = { x: segment[1] as number, y: segment[2] as number };
        segments.push([current, end]);
        current = end;
      } else if (command === "Z" || command === "z") {
        // the close segment returns to the start of the sub-path
        segments.push([current, start]);
        current = start;
      }
    }

    let max = 0;
    for (const point of points) {
      // the distance to the polyline is the closest of its segments
      let closest = Infinity;
      for (const [from, to] of segments) {
        closest = Math.min(closest, distanceToSegment(point, from, to));
      }
      max = Math.max(max, closest);
    }
    return max;
  };

  test("Can simplify a straight line", () => {
    expect(simplifyPath("M0 0L10 0L20 0L30 0", 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 30, 0],
    ]);
  });

  test("Can simplify a path that does not start with a moveto", () => {
    // a path must begin with a moveto command, so the parser rejects it
    expect(() =>
      simplifyPath(
        [
          ["L", 10, 10],
          ["L", 20, 20],
        ] as unknown as PathArray,
        1,
      ),
    ).to.throw(TypeError, `${error}: path data must begin with a moveto command`);
  });

  test("Can simplify a closed path", () => {
    expect(simplifyPath("M0 0L100 0L100 100L0 100Z", 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
      ["L", 100, 100],
      ["L", 0, 100],
      ["Z"],
    ]);
  });

  test("Can simplify a path with multiple sub-paths", () => {
    expect(simplifyPath("M0 0L10 0L20 0ZM100 100L110 100L120 100Z", 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 20, 0],
      ["Z"],
      ["M", 100, 100],
      ["L", 120, 100],
      ["Z"],
    ]);
  });

  test("Can keep the shape of a path within the tolerance", () => {
    const paths = [
      "M0 0C50 100 100 100 150 0",
      "M0 0Q50 100 100 0",
      "M0 0A50 50 0 0 1 100 0",
      "M0 0C10 0 20 100 30 100C40 100 50 0 60 0",
      "M0 0L100 0L100 100L0 100Z",
    ];
    paths.forEach((path) => {
      [0.1, 1, 5, 20].forEach((tolerance) => {
        const simplified = simplifyPath(path, tolerance);
        expect(maxDeviation(path, simplified)).to.be.at.most(tolerance);
      });
    });
  });

  test("Can remove the points of a curve that overshoots its chord", () => {
    // the curve goes beyond the end of the chord and before its start
    const path = "M0 0C300 100 300 100 200 0";
    const simplified = simplifyPath(path, 1);
    expect(simplified.length).to.be.above(2);
    expect(maxDeviation(path, simplified)).to.be.at.most(1);

    const back = "M100 0C300 100 300 100 -100 0";
    const simplifiedBack = simplifyPath(back, 1);
    expect(simplifiedBack.length).to.be.above(2);
    expect(maxDeviation(back, simplifiedBack)).to.be.at.most(1);
  });

  test("A tiny tolerance keeps the corners of a path", () => {
    expect(simplifyPath("M0 0L10 0L10 10", 0.001)).to.deep.equal([
      ["M", 0, 0],
      ["L", 10, 0],
      ["L", 10, 10],
    ]);
  });

  test("Can simplify a path with the options object", () => {
    expect(simplifyPath("M0 0L10 0L20 0L30 0", { tolerance: 1 })).to.deep.equal([
      ["M", 0, 0],
      ["L", 30, 0],
    ]);
  });

  test("Can simplify a path with the default tolerance", () => {
    expect(simplifyPath("M0 0L10 0L20 0L30 0")).to.deep.equal([
      ["M", 0, 0],
      ["L", 30, 0],
    ]);
  });

  test("Can simplify an empty path", () => {
    expect(simplifyPath("", 1)).to.deep.equal([]);
  });

  test("Can simplify a path with a sharp corner at the edge of a range", () => {
    // the worst point of the range is at its edge, so the range is split
    // in the middle as well
    const spike = `M0 0L0 100${"L10 100L20 100L30 100L40 100L50 100L60 100L70 100L80 100L90 100L100 100L110 100L120 100L130 100L140 100L150 100L160 100L170 100L180 100L190 100L200 100"}`;
    expect(simplifyPath(spike, 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 0, 100],
      ["L", 90, 100],
      ["L", 200, 100],
    ]);

    // the same, with the worst point at the other edge of the range
    const tail = `${"L10 10L20 20L30 30L40 40L50 50L60 60L70 70L80 80L90 90L100 100L110 110L120 120L130 130L140 140L150 150L160 160L170 170L180 180L190 190L0 100"}`;
    expect(simplifyPath(`M0 0${tail}`, 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 100],
      ["L", 190, 190],
      ["L", 0, 100],
    ]);
  });

  test("Can simplify a path with a single moveto", () => {
    expect(simplifyPath("M10 10", 1)).to.deep.equal([["M", 10, 10]]);
  });

  test("Can simplify a path with a zero radius arc", () => {
    // a zero radius is a straight line to the end point
    expect(simplifyPath("M0 0A0 5 0 0 1 10 10", 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 10, 10],
    ]);
  });

  test("Can reject a tolerance that is not a positive number", () => {
    [0, -1, Number.NaN, Number.POSITIVE_INFINITY].forEach((tolerance) => {
      try {
        simplifyPath("M0 0L10 10", tolerance);
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property("message", `${error}: tolerance must be a positive number`);
      }
    });
  });
});

describe("Multi-subpath ergonomics", () => {
  const { joinPath, reverseSubPath, splitPath, reversePath } = SVGPathCommander;

  test("Can join two paths", () => {
    expect(joinPath("M0 0L100 0", "M0 100L100 100")).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
      ["M", 0, 100],
      ["L", 100, 100],
    ]);
  });

  test("Can join two paths with relative values", () => {
    expect(joinPath("M0 0l100 0", "m0 100l100 0")).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
      ["M", 0, 100],
      ["L", 100, 100],
    ]);
  });

  test("Can join a path with an empty path", () => {
    expect(joinPath("M0 0L100 0", "")).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
    ]);
  });

  test("Can join a path with a path of multiple sub-paths", () => {
    expect(joinPath("M0 0L100 0", "M0 100L100 100ZM200 200L300 200")).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
      ["M", 0, 100],
      ["L", 100, 100],
      ["Z"],
      ["M", 200, 200],
      ["L", 300, 200],
    ]);
  });

  test("Can reject a path that does not begin with a moveto", () => {
    try {
      joinPath("M0 0L100 0", "L100 100");
      expect.fail("should have thrown");
    } catch (e) {
      expect(e).to.be.instanceOf(TypeError);
      expect(e).to.have.property("message", `${error}: path data must begin with a moveto command`);
    }
  });

  test("Can reverse one sub-path of a path", () => {
    expect(reverseSubPath("M0 0L100 0ZM0 100L100 100", 1)).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
      ["Z"],
      ["M", 100, 100],
      ["L", 0, 100],
    ]);
  });

  test("Can reverse the first sub-path of a path", () => {
    expect(reverseSubPath("M0 0L100 0L100 100ZM0 100L100 100", 0)).to.deep.equal([
      ["M", 100, 100],
      ["L", 100, 0],
      ["L", 0, 0],
      ["Z"],
      ["M", 0, 100],
      ["L", 100, 100],
    ]);
  });

  test("Can reverse a closed sub-path of a path", () => {
    expect(reverseSubPath("M0 0L100 0L100 100Z", 0)).to.deep.equal([
      ["M", 100, 100],
      ["L", 100, 0],
      ["L", 0, 0],
      ["Z"],
    ]);
  });

  test("Can reject an index that is out of range", () => {
    [-1, 1, 1.5, Number.NaN].forEach((index) => {
      try {
        reverseSubPath("M0 0L100 0", index);
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
        expect(e).to.have.property(
          "message",
          `${error}: index must be a number within the range of the sub-paths`,
        );
      }
    });
  });

  test("Can split a path into its sub-paths", () => {
    expect(splitPath("M0 0L100 0ZM0 100L100 100")).to.deep.equal([
      [["M", 0, 0], ["L", 100, 0], ["Z"]],
      [
        ["M", 0, 100],
        ["L", 100, 100],
      ],
    ]);
  });

  test("Can reverse every sub-path of a path", () => {
    expect(reversePath("M0 0L100 0ZM0 100L100 100")).to.deep.equal([
      ["M", 100, 0],
      ["L", 0, 0],
      ["Z"],
      ["M", 100, 100],
      ["L", 0, 100],
    ]);
  });
});

describe("Path offsetting", () => {
  const { offsetPath, getPointAtLength, getTotalLength } = SVGPathCommander;

  /**
   * Returns the distance between a point and a polyline.
   *
   * @param point - the point to measure
   * @param polyline - the polyline to measure against
   * @returns the distance to the closest segment of the polyline
   */
  const distanceToPolyline = (point: { x: number; y: number }, polyline: PathArray): number => {
    const segments: [{ x: number; y: number }, { x: number; y: number }][] = [];
    let current = { x: 0, y: 0 };
    let start = { x: 0, y: 0 };
    for (const segment of polyline) {
      const command = segment[0];
      if (command === "M") {
        current = { x: segment[1] as number, y: segment[2] as number };
        start = current;
      } else if (command === "L") {
        const end = { x: segment[1] as number, y: segment[2] as number };
        segments.push([current, end]);
        current = end;
      } else if (command === "Z") {
        segments.push([current, start]);
        current = start;
      }
    }

    let closest = Infinity;
    for (const [from, to] of segments) {
      closest = Math.min(closest, distanceToSegment(point, from, to));
    }
    return closest;
  };

  test("Can offset a straight line to the left", () => {
    expect(offsetPath("M0 0L100 0", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
    ]);
  });

  test("Can offset a straight line to the right", () => {
    expect(offsetPath("M0 0L100 0", 10, { side: "right" })).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
    ]);
  });

  test("Can offset a closed path to the left", () => {
    expect(offsetPath("M0 0L100 0L100 100L0 100Z", 10)).to.deep.equal([
      ["M", 10, 10],
      ["L", 90, 10],
      ["L", 90, 90],
      ["L", 10, 90],
      ["Z"],
    ]);
  });

  test("Can offset a closed path to the right", () => {
    expect(offsetPath("M0 0L100 0L100 100L0 100Z", 10, { side: "right" })).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
      ["L", 110, -10],
      ["L", 110, 0],
      ["L", 110, 100],
      ["L", 110, 110],
      ["L", 100, 110],
      ["L", 0, 110],
      ["L", -10, 110],
      ["L", -10, 100],
      ["L", -10, 0],
      ["L", -10, -10],
      ["Z"],
    ]);
  });

  test("Can offset a path with a round join", () => {
    expect(
      offsetPath("M0 0L100 0L100 100L0 100Z", 10, { side: "right", join: "round" }),
    ).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
      ["L", 103.8268, -9.2388],
      ["L", 107.0711, -7.0711],
      ["L", 109.2388, -3.8268],
      ["L", 110, 0],
      ["L", 110, 100],
      ["L", 109.2388, 103.8268],
      ["L", 107.0711, 107.0711],
      ["L", 103.8268, 109.2388],
      ["L", 100, 110],
      ["L", 0, 110],
      ["L", -3.8268, 109.2388],
      ["L", -7.0711, 107.0711],
      ["L", -9.2388, 103.8268],
      ["L", -10, 100],
      ["L", -10, 0],
      ["L", -9.2388, -3.8268],
      ["L", -7.0711, -7.0711],
      ["L", -3.8268, -9.2388],
      ["Z"],
    ]);
  });

  test("Can offset a path with a bevel join", () => {
    expect(
      offsetPath("M0 0L100 0L100 100L0 100Z", 10, { side: "right", join: "bevel" }),
    ).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
      ["L", 110, 0],
      ["L", 110, 100],
      ["L", 100, 110],
      ["L", 0, 110],
      ["L", -10, 100],
      ["L", -10, 0],
      ["Z"],
    ]);
  });

  test("Can fall back to a bevel when the miter is too long", () => {
    expect(
      offsetPath("M0 0L100 0L100 100L0 100Z", 10, { side: "right", miterLimit: 1 }),
    ).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
      ["L", 110, 0],
      ["L", 110, 100],
      ["L", 100, 110],
      ["L", 0, 110],
      ["L", -10, 100],
      ["L", -10, 0],
      ["Z"],
    ]);
  });

  test("Can create the outline of an open path", () => {
    expect(offsetPath("M0 0L100 0", 10, { side: "both" })).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
      ["L", 100, -10],
      ["L", 0, -10],
      ["Z"],
    ]);
  });

  test("Can create the outline of an open path with a square cap", () => {
    expect(offsetPath("M0 0L100 0", 10, { side: "both", cap: "square" })).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
      ["L", 110, 10],
      ["L", 110, -10],
      ["L", 100, -10],
      ["L", 0, -10],
      ["L", -10, -10],
      ["L", -10, 10],
      ["Z"],
    ]);
  });

  test("Can create the outline of an open path with a round cap", () => {
    const outline = offsetPath("M0 0L100 0", 10, { side: "both", cap: "round" });
    expect(outline[0]).to.deep.equal(["M", 0, 10]);
    expect(outline[1]).to.deep.equal(["L", 100, 10]);
    // the cap is a half circle around the end of the path
    expect(outline[2]).to.deep.equal(["L", 103.8268, 9.2388]);
    expect(outline[5]).to.deep.equal(["L", 110, 0]);
    expect(outline[8]).to.deep.equal(["L", 103.8268, -9.2388]);
    expect(outline[9]).to.deep.equal(["L", 100, -10]);
    expect(outline[10]).to.deep.equal(["L", 0, -10]);
    // the cap at the start of the path bulges backwards
    expect(outline[11]).to.deep.equal(["L", -3.8268, -9.2388]);
    expect(outline[14]).to.deep.equal(["L", -10, 0]);
    expect(outline[17]).to.deep.equal(["L", -3.8268, 9.2388]);
    expect(outline[18]).to.deep.equal(["Z"]);
  });

  test("Can create the outline of a closed path", () => {
    expect(offsetPath("M0 0L100 0L100 100L0 100Z", 10, { side: "both" })).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
      ["L", 110, -10],
      ["L", 110, 0],
      ["L", 110, 100],
      ["L", 110, 110],
      ["L", 100, 110],
      ["L", 0, 110],
      ["L", -10, 110],
      ["L", -10, 100],
      ["L", -10, 0],
      ["L", -10, -10],
      ["Z"],
      ["M", 10, 10],
      ["L", 10, 90],
      ["L", 90, 90],
      ["L", 90, 10],
      ["Z"],
    ]);
  });

  test("Can offset a curve", () => {
    const path = "M0 0C50 100 100 100 150 0";
    const offset = offsetPath(path, 10, { steps: 64 });
    // the offset of a curve is a polyline
    expect(offset.length).to.be.above(10);
    // every point of the curve is at the offset distance from the offset path
    const length = getTotalLength(path);
    for (let i = 0; i <= 100; i += 1) {
      const point = getPointAtLength(path, (length * i) / 100);
      expect(distanceToPolyline(point, offset)).to.be.closeTo(10, 0.1);
    }
  });

  test("Can offset an arc", () => {
    const path = "M0 0A50 50 0 0 1 100 0";
    const offset = offsetPath(path, 10);
    expect(offset.length).to.be.above(10);
    const length = getTotalLength(path);
    for (let i = 0; i <= 100; i += 1) {
      const point = getPointAtLength(path, (length * i) / 100);
      expect(distanceToPolyline(point, offset)).to.be.closeTo(10, 0.2);
    }
  });

  test("Can offset a path with multiple sub-paths", () => {
    expect(offsetPath("M0 0L100 0M0 100L100 100", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
      ["M", 0, 110],
      ["L", 100, 110],
    ]);
  });

  test("Can offset a path with a closed sub-path", () => {
    expect(offsetPath("M0 0L100 0ZM0 100L100 100", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
      ["L", 100, -10],
      ["L", 0, -10],
      ["Z"],
      ["M", 0, 110],
      ["L", 100, 110],
    ]);
  });

  test("Can offset a path with a spike", () => {
    // the two offset lines of a spike are parallel, the corner is beveled
    expect(offsetPath("M0 0L100 0L0 0", 10, { side: "right" })).to.deep.equal([
      ["M", 0, -10],
      ["L", 100, -10],
      ["L", 100, 10],
      ["L", 0, 10],
    ]);
    // the inner side of the spike has no intersection to trim at
    expect(offsetPath("M0 0L100 0L0 0", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
      ["L", 100, -10],
      ["L", 0, -10],
    ]);
  });

  test("Can offset a path with a straight corner", () => {
    // a corner without a turn does not move the path
    expect(offsetPath("M0 0L50 0L100 0", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 50, 10],
      ["L", 100, 10],
    ]);
  });

  test("Can offset a path with a zero length segment", () => {
    expect(offsetPath("M0 0L0 0L100 0", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
    ]);
  });

  test("Can offset a path with two curves", () => {
    const path = "M0 0C50 100 100 100 150 0C200 -100 250 -100 300 0";
    const offset = offsetPath(path, 10);
    expect(offset.length).to.be.above(20);
  });

  test("Can trim the inner side of a corner of an open path", () => {
    expect(offsetPath("M0 0L100 0L100 100", 10)).to.deep.equal([
      ["M", 0, 10],
      ["L", 90, 10],
      ["L", 90, 100],
    ]);
  });

  test("Can offset a path that is drawn counter clockwise", () => {
    // the left side of the path is the outside of the shape, so the outline
    // is the left ring and the right ring
    expect(offsetPath("M0 0L0 100L100 100L100 0Z", 10, { side: "both" })).to.deep.equal([
      ["M", -10, 0],
      ["L", -10, 100],
      ["L", -10, 110],
      ["L", 0, 110],
      ["L", 100, 110],
      ["L", 110, 110],
      ["L", 110, 100],
      ["L", 110, 0],
      ["L", 110, -10],
      ["L", 100, -10],
      ["L", 0, -10],
      ["L", -10, -10],
      ["Z"],
      ["M", 10, 10],
      ["L", 90, 10],
      ["L", 90, 90],
      ["L", 10, 90],
      ["Z"],
    ]);
  });

  test("Can offset a path array", () => {
    expect(
      offsetPath(
        [
          ["M", 0, 0],
          ["L", 100, 0],
        ],
        10,
      ),
    ).to.deep.equal([
      ["M", 0, 10],
      ["L", 100, 10],
    ]);
  });

  test("Can offset an empty path", () => {
    expect(offsetPath("", 10)).to.deep.equal([]);
  });

  test("Can offset a path without a distance", () => {
    expect(offsetPath("M0 0L100 0", 0)).to.deep.equal([
      ["M", 0, 0],
      ["L", 100, 0],
    ]);
  });

  test("Can offset a path with a single moveto", () => {
    expect(offsetPath("M10 10", 10)).to.deep.equal([["M", 10, 10]]);
  });

  test("Can reject a distance that is not a positive number", () => {
    [-1, Number.NaN, Number.POSITIVE_INFINITY, "10"].forEach((distance) => {
      try {
        offsetPath("M0 0L10 10", distance as never);
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
      }
    });
  });

  test("Can reject an invalid option", () => {
    const invalid = [
      { side: "up" },
      { join: "sharp" },
      { cap: "point" },
      { miterLimit: 0 },
      { steps: 0 },
      { precision: -1 },
    ];
    invalid.forEach((options) => {
      try {
        offsetPath("M0 0L10 10", 10, options as never);
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);
      }
    });
  });
});
