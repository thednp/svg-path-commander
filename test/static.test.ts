import { expect, test, describe, beforeEach, vi } from 'vitest';
import SVGPathCommander, { type PathArray, type CurveArray, type ShapeTypes } from '~/index';
import invalidPathValue from '../src/parser/invalidPathValue';
import error from '../src/parser/error';

import getMarkup from './fixtures/getMarkup';
import simpleShapes from './fixtures/simpleShapes';
import shapes from './fixtures/shapes';
import shapeObjects from './fixtures/shapeObjects';

import "../docs/assets/style.css";

describe('SVGPathCommander Static Methods', () => {
  const wrapper = document.createElement('div');
  document.body.append(wrapper);

  beforeEach(async () => {
    wrapper.innerHTML = '';
  });

  test('Convert shape to path with incomplete values should return false', () => {
    ['line', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'glyph'].forEach((SHAPE) => {
      // @ts-expect-error
      expect(SVGPathCommander.shapeToPath({ type: SHAPE, fill: 'red' }), `${SHAPE} with no specific attributes`).to.be.false;
    })
  });

  test('Convert shape to pathArray with incomplete values should return false', () => {
    ['line', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'glyph'].forEach((SHAPE) => {
      // @ts-expect-error
      expect(SVGPathCommander.shapeToPathArray({ type: SHAPE, fill: 'red' }), `${SHAPE} with no specific attributes`).to.be.false;
    })
  });

  test(`Throws error when invalid path value`, () => {
    const { parsePathString } = SVGPathCommander;
    try {
      const path = parsePathString('10 50q15 -25');
      console.log(path);
    } catch (e) {
      console.log(e)
      expect(e).to.be.instanceOf(TypeError);
      expect(e).to.have.property('message', `${error}: Invalid path value "1" is not a path command at index 0`);
    }
  });

  ['wombat', 'line', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'glyph', 'path'].forEach((SHAPE) => {
    test(`Convert <${SHAPE}> to path`, async () => {
      wrapper.append(getMarkup());
      await vi.waitFor(() => wrapper.querySelector('svg') as SVGElement, { timeout: 200 });
      const svg = await vi.waitFor(() => wrapper.querySelector('svg') as SVGElement, { timeout: 200 });
      svg.setAttribute('viewBox', '0 0 182 72');
      svg.innerHTML = `<line id="line" x1="0" y1="0" x2="182" y2="72" stroke="turquoise" stroke-width="2" />
          <circle id="circle" cx="27.5" cy="36.9" r="23.5" fill="orangered"/>
          <ellipse id="ellipse" cx="68.3" cy="37" rx="15.1" fill="darkorange"/>
          <wombat id="wombat" fill="black"/>
          <polygon id="polygon" points="107.4,13 113.7,28.8 127.9,31.3 117.6,43.5 120.1,60.8 107.4,52.6 94.6,60.8 97.1,43.5 86.8,31.3 101,28.8" fill="yellow"/>
          <polyline id="polyline" points="107.39,17.78 112.43,30.42 123.79,32.42 115.55,42.18 117.55,56.02 107.39,49.46 97.15,56.02 99.15,42.18 90.91,32.42 102.27,30.42" fill="none" stroke="black" stroke-width="2"/>
          <rect id="rect" x="131" y="13.2" width="47.5" height="47.6" rx="25" fill="yellowgreen"/>
          <path id="path" d="M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3" fill="rgba(255,255,255,0.3)"/>
          <glyph id="glyph" d="M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3" fill="rgba(255,255,255,0.3)"/>`;

      const shape = await vi.waitFor(() => wrapper.querySelector(SHAPE) as SVGElement, { timeout: 200 });
      if (SHAPE === 'wombat') {
        try {
          SVGPathCommander.shapeToPathArray(shape as unknown as SVGCircleElement);
        } catch (er) {
          expect(er).to.be.instanceOf(TypeError);
          expect(er).to.have.property('message', `${error}: "${SHAPE}" is not SVGElement`);
        }
        try {
          SVGPathCommander.shapeToPath(shape as unknown as SVGCircleElement, true, shape.ownerDocument);
        } catch (er) {
          expect(er).to.be.instanceOf(TypeError);
          expect(er).to.have.property('message', `${error}: "${SHAPE}" is not SVGElement`);
        }
      } else if (SHAPE === 'path') {
        try {
          SVGPathCommander.shapeToPath(shape as unknown as SVGCircleElement, true, shape.ownerDocument);
        } catch (er) {
          expect(er).to.be.instanceOf(TypeError);
          expect(er).to.have.property('message', `${error}: "${SHAPE}" is already SVGPathElement`);
        }
      } else {
        SVGPathCommander.shapeToPath(shape as unknown as ShapeTypes, true, shape.ownerDocument);
        expect(svg.querySelector(SHAPE)).to.not.exist;
        expect(svg.querySelector(`#${SHAPE}`)).to.exist;
        expect(svg.querySelector(`#${SHAPE}`)?.getAttribute('d')).to.have.length.greaterThan(0);
      }
    });
  });

  shapeObjects.forEach((SHAPE) => {
    test(`Convert "${SHAPE.type}" Object to pathArray`, () => {
      expect(SVGPathCommander.shapeToPathArray(SHAPE as unknown as ShapeTypes)).to.have.length.greaterThan(0);
    });
  });

  test(`Convert <wombat> Object to pathArray should throw error`, () => {
    try {
      SVGPathCommander.shapeToPathArray({ type: 'wombat', fill: 'red' } as unknown as ShapeTypes)
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: "wombat" is not SVGElement`);
    }
  });

  shapeObjects.forEach((SHAPE) => {
    test(`Convert "${SHAPE.type}" Object to path`, async () => {
      wrapper.append(getMarkup());
      await vi.waitFor(() => wrapper.querySelector('svg') as SVGElement, { timeout: 200 });
      const svg = await vi.waitFor(() => wrapper.querySelector('svg') as SVGElement, { timeout: 200 });
      svg.setAttribute('viewBox', '0 0 182 72');

      svg.append(SVGPathCommander.shapeToPath(SHAPE as unknown as ShapeTypes) as SVGPathElement);
      const shape = svg.querySelector(`#${SHAPE.type}`);
      expect(shape).to.exist;
      expect(shape?.getAttribute('d')).to.have.length.greaterThan(0);
    });
  });

  simpleShapes.normalized.forEach((SHAPE, i) => {
    test(`Can do optimizePath #${i}`, () => {
      const path = new SVGPathCommander(SHAPE);

      expect(path.optimize().toString()).to.equal(simpleShapes.initial[i]);
    });
  });

  test(`Can disable round, use a given decimal amount or revert back to default round option`, () => {
    const sample = [["M", 0, 0], ["L", 181.99955, 0], ["L", 91, 72], ["L", 0, 0], ["Z"]] as PathArray;
    const rounded = [["M", 0, 0], ["L", 181.9996, 0], ["L", 91, 72], ["L", 0, 0], ["Z"]] as PathArray;

    expect(SVGPathCommander.roundPath(sample, 4), `can use number setting`).to.deep.equal(rounded);
    expect(SVGPathCommander.roundPath(sample, 'off'), `can use "off" setting`).to.deep.equal(sample);
    expect(SVGPathCommander.roundPath(sample, -1), `use 4 decimals when negative number is provided`).to.deep.equal(rounded);
    // @ts-expect-error
    expect(SVGPathCommander.roundPath(sample, 'wombat'), `use 4 decimals when string is provided`).to.deep.equal(rounded);
  });

  test(`Can do reverseCurve`, () => {
    const path = new SVGPathCommander(simpleShapes.normalized[1]);
    const pathReversed = new SVGPathCommander(simpleShapes.normalized[1]).reverse();
    const reversed = [["M", 170, 90], ["C", 150, 90, 155, 10, 130, 10], ["C", 105, 10, 110, 90, 90, 90], ["C", 70, 90, 75, 10, 50, 10], ["C", 25, 10, 30, 90, 10, 90]];

    expect(pathReversed.segments).to.deep.equal(reversed);
    expect(SVGPathCommander.reverseCurve(pathReversed.segments as CurveArray)).to.deep.equal(path.segments);
  });

  test(`Can do reversePath`, () => {
    const path = new SVGPathCommander(simpleShapes.normalized[2]);
    const pathReversed = new SVGPathCommander(simpleShapes.normalized[2]).reverse();
    const reversed = [["M", 190, 50], ["Q", 175, 75, 160, 50], ["Q", 145, 25, 130, 50], ["Q", 115, 75, 100, 50], ["Q", 85, 25, 70, 50], ["Q", 55, 75, 40, 50], ["Q", 25, 25, 10, 50]];

    expect(pathReversed.segments).to.deep.equal(reversed);
    expect(SVGPathCommander.reversePath(pathReversed.segments)).to.deep.equal(path.segments);
  });

  test(`Can transformPath with arc segments`, () => {
    const { transformPath, pathToString, reversePath } = SVGPathCommander;

    // This test assumes **SVGPathCommander** static method can work with default
    // transform origin *{0,0,0}* when no origin is provided in the **transformObject**.
    // The test also shows how Arc segments are converted to CubicBezier for transformation.
    const path = pathToString(transformPath(simpleShapes.initial[3], { rotate: 45 }));
    expect(path).to.equal('M-2.8284 11.3137C-6.3778 10.7769 -7.6385 14.9238 -5.0977 18.7783C-2.5569 22.6327 1.8798 23.3038 2.8884 19.9862C3.153 19.1158 3.1321 18.0645 2.8284 16.9706M-2.8284 11.3137C-3.9859 7.1438 -0.9528 4.7691 2.631 7.0393C6.2148 9.3095 7.6616 14.5219 5.2352 16.4216C4.5986 16.92 3.7596 17.1114 2.8284 16.9706M-2.8284 11.3137C-0.4208 11.6779 2.0433 14.1419 2.8284 16.9706M-2.8284 11.3137C-2.0433 14.1423 0.4208 16.6064 2.8284 16.9706');

    const path1 = pathToString(transformPath(simpleShapes.initial[3], { rotate: -45 }));
    expect(path1).to.equal('M11.3137 2.8284C10.7769 6.3778 14.9238 7.6385 18.7783 5.0977C22.6327 2.5569 23.3038 -1.8798 19.9862 -2.8884C19.1158 -3.153 18.0645 -3.1321 16.9706 -2.8284M11.3137 2.8284C7.1438 3.9859 4.7691 0.9528 7.0393 -2.631C9.3095 -6.2148 14.5219 -7.6616 16.4216 -5.2352C16.92 -4.5986 17.1114 -3.7596 16.9706 -2.8284M11.3137 2.8284C11.6779 0.4208 14.1419 -2.0433 16.9706 -2.8284M11.3137 2.8284C14.1423 2.0433 16.6064 -0.4208 16.9706 -2.8284');

    // @ts-expect-error
    const path2 = pathToString(transformPath(reversePath(simpleShapes.initial[3]), { rotate: 45 }));
    expect(path2).to.equal('M2.8284 16.9706C0.4208 16.6064 -2.0433 14.1423 -2.8284 11.3137M2.8284 16.9706C2.0433 14.1419 -0.4208 11.6779 -2.8284 11.3137M2.8284 16.9706C6.3778 17.5074 7.6385 13.3604 5.0977 9.506C2.5569 5.6516 -1.8798 4.9805 -2.8884 8.2981C-3.153 9.1684 -3.1321 10.2198 -2.8284 11.3137M2.8284 16.9706C3.9859 21.1405 0.9528 23.5152 -2.631 21.245C-6.2148 18.9748 -7.6616 13.7624 -5.2352 11.8626C-4.5986 11.3642 -3.7596 11.1729 -2.8284 11.3137');

    // @ts-expect-error
    const path3 = pathToString(transformPath(reversePath(simpleShapes.initial[3]), { rotate: -45 }));
    expect(path3).to.equal('M16.9706 -2.8284C16.6064 -0.4208 14.1423 2.0433 11.3137 2.8284M16.9706 -2.8284C14.1419 -2.0433 11.6779 0.4208 11.3137 2.8284M16.9706 -2.8284C17.5074 -6.3778 13.3604 -7.6385 9.506 -5.0977C5.6516 -2.5569 4.9805 1.8798 8.2981 2.8884C9.1684 3.153 10.2198 3.1321 11.3137 2.8284M16.9706 -2.8284C21.1405 -3.9859 23.5152 -0.9528 21.245 2.631C18.9748 6.2148 13.7624 7.6616 11.8626 5.2352C11.3642 4.5986 11.1729 3.7596 11.3137 2.8284');
  });

  test(`Can do getPropertiesAtLength`, () => {
    try {
      SVGPathCommander.getPropertiesAtLength('M16.9706 -2.8284A4 6 89.5025 0 1 11.3137 2.8284M', 50);
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 48, "pathValue" is missing param`);
    }

    const props0 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 0);
    // cy.log(props50)
    expect(props0.index).to.equal(0)
    expect(props0.lengthAtSegment).to.equal(0)
    expect(props0.segment).to.deep.equal(["M", 10, 10])

    const props50 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 50);
    // cy.log(props50)
    expect(props50.index).to.equal(1)
    expect(props50.lengthAtSegment).to.equal(0)
    expect(props50.segment).to.deep.equal(['l', 80, 80])

    const props400 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 400);
    // cy.log(props50)
    expect(props400.index).to.equal(3)
    expect(props400.lengthAtSegment).to.equal(193.1370849898476)
    expect(props400.segment).to.deep.equal(['H', 50])
  });

  test(`Can do getPropertiesAtPoint`, () => {
    const { getPropertiesAtPoint } = SVGPathCommander;

    // getPropertiesAtPoint first point
    const propsPoint0 = getPropertiesAtPoint(simpleShapes.initial[1], { "x": 10, "y": 90 });
    expect(propsPoint0.closest).to.deep.equal({ x: 10, y: 90 });
    expect(propsPoint0.distance).to.equal(0);
    expect(propsPoint0.segment).to.deep.equal({ segment: ["M", 10, 90], index: 0, length: 0, lengthAtSegment: 0 })

    // getPropertiesAtPoint mid point
    const propsPoint50 = getPropertiesAtPoint(simpleShapes.initial[1], { x: 30.072453006153214, y: 41.42818552481854 });
    expect(propsPoint50.closest).to.deep.equal({ x: 30.072383912322863, y: 41.42816186159437 })
    expect(propsPoint50.distance).to.equal(0.00007303359207048124)
    expect(propsPoint50.segment).to.deep.equal({ segment: ['C', 30, 90, 25, 10, 50, 10], index: 1, length: 94.75724347727943, lengthAtSegment: 0 })

    // getPropertiesAtPoint last point
    const propsPoint400 = getPropertiesAtPoint(simpleShapes.initial[1], { "x": 50, "y": 10 });
    expect(propsPoint400.closest).to.deep.equal({ x: 50.000003520199236, y: 10.000000000000531 })
    expect(propsPoint400.distance).to.equal(0.0000035201992361067316)
    expect(propsPoint400.segment).to.deep.equal({ segment: ['s', 20, 80, 40, 80], index: 2, length: 94.75724347727943, lengthAtSegment: 94.75724347727943 })
  });

  test(`Can do getSegmentAtLength`, () => {
    const { getSegmentAtLength } = SVGPathCommander;
    expect(getSegmentAtLength(simpleShapes.initial[1])).to.deep.equal(['M', 10, 90]);
    expect(getSegmentAtLength(simpleShapes.initial[1], 0)).to.deep.equal(['M', 10, 90]);
    expect(getSegmentAtLength(simpleShapes.initial[3], 15)).to.deep.equal(['a', 6, 4, 10, 1, 0, 8, 0]);
    expect(getSegmentAtLength(simpleShapes.initial[3], 400)).to.deep.equal(['a', 6, 4, 10, 0, 0, 8, 0]);
  });

  test(`Can do getSegmentOfPoint`, () => {
    const { getSegmentOfPoint } = SVGPathCommander;
    // first point
    expect(getSegmentOfPoint(simpleShapes.initial[1], { x: 10, y: 90 })).to.deep.equal({ segment: ["M", 10, 90], index: 0, length: 0, lengthAtSegment: 0 });
    // mid point
    expect(getSegmentOfPoint(simpleShapes.initial[3], { x: 9, y: 9 })).to.deep.equal({ segment: ["a", 6, 4, 10, 0, 1, 8, 0], index: 5, length: 7.498916687913066,/* point: { x: 6, y: 10 },*/ lengthAtSegment: 48.11479095890485 });
  });

  test(`Can do getClosestPoint`, () => {
    const { getClosestPoint } = SVGPathCommander;
    // first point
    expect(getClosestPoint(simpleShapes.initial[1], { x: 10, y: 90 })).to.deep.equal({ x: 10, y: 90 });
    // mid point
    expect(getClosestPoint(simpleShapes.initial[3], { x: 9, y: 9 })).to.deep.equal({ x: 8.995511191469355, y: 8.952970323068374 });
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

  test(`Can do getDrawDirection`, () => {
    const { getDrawDirection } = SVGPathCommander;
    expect(getDrawDirection(simpleShapes.reversed[1])).to.be.true;
    expect(getDrawDirection(simpleShapes.initial[1])).to.be.false;
  });

  test(`Can do splitCubic`, () => {
    const { splitCubic } = SVGPathCommander;
    expect(splitCubic([70, 60, 70, 80, 110, 80, 110, 60])).to.deep.equal([
      ['C', 70, 70, 80, 75, 90, 75],
      ['C', 100, 75, 110, 70, 110, 60],
    ]);
  });

  test(`Can do polygonLength`, () => {
    const { polygonTools } = SVGPathCommander;
    expect(polygonTools.polygonLength([[100, 100], [150, 25], [150, 75], [200, 0]])).to.equal(230.27756377319946);
  });

  test(`Can do polygonArea`, () => {
    const { polygonTools } = SVGPathCommander;
    expect(polygonTools.polygonArea([[107.4, 13], [113.7, 28.8], [127.9, 31.3], [117.6, 43.5], [120.1, 60.8], [107.4, 52.6], [94.6, 60.8], [97.1, 43.5], [86.8, 31.3], [101, 28.8]])).to.equal(-836.69);
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
    const { parsePathString, isPathArray, isCurveArray, isAbsoluteArray, isRelativeArray, isNormalizedArray } = SVGPathCommander;
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

  test(`Can cover all remaining branches`, () => {
    const { splitPath, pathToString, optimizePath, parsePathString, getPathBBox, getPointAtLength, getTotalLength } = SVGPathCommander;
    expect(getPointAtLength(simpleShapes.normalized[3], 24.057395479452424)).to.deep.equal({ x: 14, y: 10 });
    expect(getPointAtLength(simpleShapes.normalized[0], 0)).to.deep.equal({ x: 10, y: 10 });
    expect(getPointAtLength(simpleShapes.normalized[3], undefined)).to.deep.equal({ x: 6, y: 10 });
    expect(getTotalLength(simpleShapes.normalized[0])).to.be.above(233);
    expect(getPathBBox(simpleShapes.normalized[2])).to.deep.equal({
      "cx": 100, "cy": 50, "cz": 192.5,
      "height": 25, "width": 180,
      "x": 10, "y": 37.5, "x2": 190, "y2": 62.5,
    });
    expect(getPathBBox(simpleShapes.normalized[1])).to.deep.equal({
      "cx": 90, "cy": 50, "cz": 200,
      "height": 80, "width": 160,
      "x": 10, "y": 10, "x2": 170,"y2": 90,
    });
    expect(splitPath(parsePathString(shapes.relative[1])).length).to.equal(7);
    expect(pathToString(optimizePath(parsePathString(
      // 'M10 50q15 -25 30 0Q55 75 70 50Q85 25 100 50T130 50Q145 25 160 50t30 0'
      simpleShapes.normalized[2]
    ), 2))).to.equal(simpleShapes.initial[2]);
    // M10 50q15 -25 30 0t30 0t30 0t30 0t30 0t30 0
  });
});
