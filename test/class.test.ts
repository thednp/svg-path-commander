import { expect, it, describe, beforeEach, vi } from 'vitest';
import SVGPathCommander from '~/index';
import invalidPathValue from '../src/parser/invalidPathValue';
import error from '../src/parser/error';

import getMarkup from './fixtures/getMarkup';
import shapes from './fixtures/shapes';
import simpleShapes from './fixtures/simpleShapes';

import "../docs/assets/style.css";

describe('SVGPathCommander Class Test', () => {
  const wrapper = document.createElement('div');
  document.body.append(wrapper);

  beforeEach(async () => {
    wrapper.innerHTML = '';
  });

  it('Test init with no parameter / empty throws error', () => {
    try {
      // @ts-expect-error
      new SVGPathCommander();
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: "pathValue" is undefined`);
    }
    try {
      new SVGPathCommander('');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: "pathValue" is empty`);
    }
  });

  it('Test init with invalid path value throws error', () => {
    try {
      new SVGPathCommander('M04 36.9a23.5 23');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 1, "0" illegal number`);
    }

    try {
      new SVGPathCommander('M4 36.9efa23.5 23');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 8, "f" invalid integer exponent`);
    }

    try {
      new SVGPathCommander('M4 .ea23.5 23');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 4, "e" invalid float exponent`);
    }

    try {
      new SVGPathCommander('M4 36.9a23.5 23');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 15, "pathValue" is missing param`);
    }

    try {
      new SVGPathCommander('M2 0a2 2 0 00-2 2 12');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 20, "pathValue" is missing param`);
    }

    try {
      new SVGPathCommander('M2 0aa 2 0 00-2 2 12');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} at index 5, "a" is not a number`);
    }

    try {
      new SVGPathCommander('M2 0a2 2 0 21-2 2 12');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: invalid Arc flag "2", expecting 0 or 1 at index 11`);
    }

    try {
      new SVGPathCommander('M2 0a2 2 0 03-2 2 12');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: invalid Arc flag "3", expecting 0 or 1 at index 12`);
    }
  
    try {
      new SVGPathCommander('2 0a2 2 0 00-2 2');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} "2" is not a path command at index 0`);
    }
  
    try {
      new SVGPathCommander(`M13.158 9.208a1.63 1.63 0 0 0 -0.906 0.274a1.63 1.63 0 0 0 -0.601 0.73a1.63 1.63 0 0 0 -0.094 0.942a1.63 1.63 0 0 0 3.229 -0.314a1.6 1.6 0 0 0 -0.12 -0.627a1.6 1.6 0 0 0 -0.353 -0.533a1.6 1.6 0 0 0 -0.53 -0.356a1.6 1.6 0 0 0 -0.625 -0.125z
a1.63 1.63 0 0 0 -0.906 0.274a1.63 1.63 0 0 0 -0.601 0.73a1.63 1.63 0 0 0 -0.094 0.942a1.63 1.63 0 0 0 3.229 -0.314a1.6 1.6 0 0 0 -0.12 -0.627a1.6 1.6 0 0 0 -0.353 -0.533a1.6 1.6 0 0 0 -0.53 -0.356a1.6 1.6 0 0 0 -0.625 -0.125za1.63 1.63 0 0 0 -0.906 0.274a1.63 1.63 0 0 0 -0.601 0.73a1.63 1.63 0 0 0 -0.094 0.942a1.63 1.63 0 0 0 3.229 -0.314a1.6 1.6 0 0 0 -0.12 -0.627a1.6 1.6 0 0 0 -0.353 -0.533a1.6 1.6 0 0 0 -0.53 -0.356a1.6 1.6 0 0 0 -0.625 -0.125z`);
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} "a" is not a MoveTo path command at index 240`);
    }
  });

  it('Test init with valid path value works', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });
    const rect = new SVGPathCommander(
      `M 2 0,
       a2,2 0 00-2 2
       v12
       a2 2 0 002 2
       h12
       a2 2 0 0 0  2-2
       V2
       a2 2 0 0  0-2-2
       H2
       z`,
       { origin: [8,8,24] }
    );
    expect(rect.segments).to.have.length(10);
    expect(rect.origin).to.deep.equal([8,8,24]);
    expect(rect.round).to.equal(4);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal(rect.toString())
  });

  it('Test dispose', async () => {
    const path = new SVGPathCommander(`M 2 0 a2 2 0 00-2 2`);
    expect(path.segments.length).to.equal(2);
    expect(path.origin).to.deep.equal([0, 0, 0]);
    expect(path.round).to.equal(4);
    
    path.dispose();
    expect(path.segments).to.be.undefined;
    expect(path.origin).to.be.undefined;
    expect(path.round).to.be.undefined;
  });

  it('Test overloaded moveTo', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const star = new SVGPathCommander(
      `M12.774 14.5111 8.0167 12.292 3.4918 14.9529 4.1321 9.7428 0.2031 6.2615 5.3562 5.2604 7.4528 0.4479 9.9972 5.0393 15.222 5.5463 11.6414 9.3851Z`,
      {round: 2}
    );
    const star1 = new SVGPathCommander(
      `m12.774 14.5111 -4.7573 -2.2191 -4.5249 2.6609 0.6403 -5.2101 -3.929 -3.4813 5.1531 -1.0011 2.0966 -4.8125 2.5444 4.5914 5.2248 0.507 -3.5806 3.8388z`,
      {round: 2}
    );

    expect(star.segments).to.have.length(11);
    expect(star1.segments).to.have.length(11);

    path.setAttribute('d', star.toString());
    expect(path.getAttribute('d')).to.equal(star.toString());

    path.setAttribute('d', star1.toString());
    expect(path.getAttribute('d')).to.equal(star1.toString());
  });

  it('Test rounding `off`, and [0-5]', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander(
      'M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0',
      { round: 2 }
    );
    expect(rect.round).to.equal(2);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0C0.9 0 0 0.9 0 2C0 2 0 9.88 0 14C0 15.1 0.9 16 2 16C8 16 10.25 16 14 16C15.1 16 16 15.1 16 14C16 8 16 5.75 16 2C16 0.9 15.1 0 14 0C8 0 5.75 0 2 0')

    const rect1 = new SVGPathCommander(
      'M7.94 7.92C7.928954 7.92 7.92 7.928954 7.92 7.94C7.92 7.94 7.92 8.01875 7.92 8.06C7.92 8.071046 7.928954 8.08 7.94 8.08C8 8.08 8.0225 8.08 8.06 8.08C8.071046 8.08 8.08 8.071046 8.08 8.06C8.08 8 8.08 7.9775 8.08 7.94C8.08 7.928954 8.071046 7.92 8.06 7.92C8 7.92 7.9775 7.92 7.94 7.92',
      { round: 'off' }
    );
    expect(rect1.round).to.equal('off');
    path.setAttribute('d', rect1.toString());
    expect(path.getAttribute('d')).to.equal('M7.94 7.92C7.928954 7.92 7.92 7.928954 7.92 7.94C7.92 7.94 7.92 8.01875 7.92 8.06C7.92 8.071046 7.928954 8.08 7.94 8.08C8 8.08 8.0225 8.08 8.06 8.08C8.071046 8.08 8.08 8.071046 8.08 8.06C8.08 8 8.08 7.9775 8.08 7.94C8.08 7.928954 8.071046 7.92 8.06 7.92C8 7.92 7.9775 7.92 7.94 7.92')

    const rect2 = new SVGPathCommander(
      'M895.02 5.12C963.38 5.12 1018.88 60.62 1018.88 128.98V895.03C1018.88 963.39 963.38 1018.89 895.02 1018.89H128.98C60.62 1018.88 5.12 963.38 5.12 895.02V128.98C5.12 60.62 60.62 5.12 128.98 5.12H895.03Z',
      { round: 0 }
    );
    expect(rect2.round).to.equal(0);
    path.setAttribute('d', rect2.toString());
    expect(path.getAttribute('d')).to.equal('M895 5C963 5 1019 61 1019 129V895C1019 963 963 1019 895 1019H129C61 1019 5 963 5 895V129C5 61 61 5 129 5H895Z')

    const roundSample = 'M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0';
    const rect3 = new SVGPathCommander(roundSample, {round: 'off'});
    expect(rect3.round).to.equal('off');
    path.setAttribute('d', rect3.toString());
    expect(path.getAttribute('d')).to.equal(roundSample);

    const rect4 = new SVGPathCommander(roundSample, {round: 0});
    expect(rect4.round).to.equal(0);
    path.setAttribute('d', rect4.toString());
    expect(path.getAttribute('d')).to.equal('M2 0C1 0 0 1 0 2C0 2 0 10 0 14C0 15 1 16 2 16C8 16 10 16 14 16C15 16 16 15 16 14C16 8 16 6 16 2C16 1 15 0 14 0C8 0 6 0 2 0');

    const rect5 = new SVGPathCommander(roundSample, {round: 5});
    expect(rect5.round).to.equal(5);
    path.setAttribute('d', rect5.toString());
    expect(path.getAttribute('d')).to.equal('M2 0C0.89543 0 0 0.89543 0 2C0 2 0 9.875 0 14C0 15.10457 0.89543 16 2 16C8 16 10.25 16 14 16C15.10457 16 16 15.10457 16 14C16 8 16 5.75 16 2C16 0.89543 15.10457 0 14 0C8 0 5.75 0 2 0')
  });

  it('Test getBBox', async () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getBBox();
    expect(rect, 'Using the SVGPathCommander').to.deep.equal({cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16});
    expect(SVGPathCommander.getPathBBox(''), 'Using the static method').to.deep.equal({cx: 0, cy: 0, cz: 0, height: 0, width: 0, x: 0, x2: 0, y: 0, y2: 0});
  });

  it('Test getBBox arcs', async () => {
    const path = new SVGPathCommander('M77.7553 122.1843A15.6631 5.5 45 0 1 92.7199 129.3707L100.7729 137.4237A15.6631 5.5 45 0 1 92.9947 145.2019L84.9417 137.1489A15.6631 5.5 45 0 1 77.7553 122.1843').getBBox();
    expect(path, 'Using the SVGPathCommander').to.deep.equal({cx: 92.85730493191977, cy: 137.28630493191974, cz: 47.294968430086385, height: 31.529978953390895, width: 31.529978953390938, x: 77.09231545522431, x2: 108.62229440861525, y: 121.52131545522431, y2: 153.0512944086152});
  });

  it('Test getTotalLength', () => {
    const len = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getTotalLength();
    expect(Math.round(len)).to.equal(61);
  });

  it('Test getPointAtLength', () => {
    const pt = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getPointAtLength(25);
    expect(pt).to.deep.equal({ x: 8.716814692820414, y: 16 });

    const pt1 = new SVGPathCommander('M2 0A2 2 0 00 2 0').getPointAtLength(0);
    expect(pt1).to.deep.equal({ x: 2, y: 0 });

    const pt2 = new SVGPathCommander('M2 0A0 2 0 00 0 2').getPointAtLength(0.5);
    expect(pt2).to.deep.equal({x: 0, y: 2 });

    const pt3 = new SVGPathCommander('M2 0A3 2 0 00 0 2').getPointAtLength(5);
    expect(pt3).to.deep.equal({x: 0, y: 2});
  });

  it('Test toAbsolute', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').toAbsolute();
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z')
  });

  it('Test toRelative', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z').toRelative();
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-12z')
  });

  it('Test toCurve', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { round: 'off' }).toCurve();
    path.setAttribute('d', rect.toString());
    expect(rect.round).to.equal('off')
    expect(path.getAttribute('d')).to.equal('M2 0C0.8954305003384135 2.0290612532945332e-16 -1.3527075021963556e-16 0.8954305003384133 0 2C0 6 0 10 0 14C1.3527075021963556e-16 15.104569499661586 0.8954305003384133 16 2 16C6 16 10 16 14 16C15.104569499661586 16 16 15.104569499661586 16 14C16 10 16 6 16 2C16 0.8954305003384135 15.104569499661586 6.763537510981778e-17 14 0C10 0 6 0 2 0C2 0 2 0 2 0')
  });

  it('Test normalize', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').normalize();
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z')
  });

  it('Test optimize', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z').optimize();

    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z');
    // add at least one round: 'off' test
    expect(new SVGPathCommander(simpleShapes.normalized[2], { round: 'off' }).optimize().toString()).to.equal(simpleShapes.initial[2]);
  });

  it('Test reverse single path', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse();
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0Z')

    const rect1 = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse(true);
    
    path.setAttribute('d', rect1.toString());
    expect(path.getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z')
  });

  it('Test reverse composite', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').reverse();
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0ZM8 12L12 4H4Z')
  });

  it('Test reverse composite path with `onlySubpath`', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').reverse(true);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM8 12L12 4H4Z')
  });

  it('Test flipX', () => {
    const triangle = new SVGPathCommander('M0 0L16 0 L8 16');
    expect(triangle.flipX().toString()).to.equal('M16 0H0L8 16');
  });

  it('Test flipY', () => {
    const triangle = new SVGPathCommander('M0 0L16 0 L8 16');
    expect(triangle.flipY().toString()).to.equal('M0 16H16L8 0');
  });
  
  it('Test empty transform', () => {
    const transform = {}
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
    const transformed = rect.transform(transform);
    const transformed1 = rect.transform();
    // @ts-expect-error
    const transformed2 = rect.transform('');

    expect(rect.segments).to.deep.equal(transformed.segments);
    expect(rect.segments).to.deep.equal(transformed1.segments);
    expect(rect.segments).to.deep.equal(transformed2.segments);
  });
  
  it('Test transform', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const transform = {
      rotate: [15,15],
      skew: [-15,15],
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M1.829 0.5176C0.8189 0.2318 -0.1718 0.8649 -0.3837 1.9319L-2.6856 13.523C-2.8975 14.5899 -2.2504 15.6866 -1.2403 15.9725L9.734 19.0783C10.7442 19.3642 11.7349 18.731 11.9468 17.6641L14.2487 6.073C14.4606 5.006 13.8135 3.9094 12.8033 3.6235L1.829 0.5176Z')
  });

  it('Test transform with custom [x,y] origin', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const transform = {
      rotate: [15,15],
      skew: [-15,15],
      origin: [0,0]
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M1.829 0.5176C0.8189 0.2318 -0.1718 0.8649 -0.3837 1.9319L-2.6856 13.523C-2.8975 14.5899 -2.2504 15.6866 -1.2403 15.9725L9.734 19.0783C10.7442 19.3642 11.7349 18.731 11.9468 17.6641L14.2487 6.073C14.4606 5.006 13.8135 3.9094 12.8033 3.6235L1.829 0.5176Z')
  });

  it('Test transform with custom [x,y,z] origin option', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const transform = {
      rotate: [15,15],
      skew: [-15,15]
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', {origin: [8,0,24]}).transform(transform);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2.2644 -1.6232C1.1515 -1.9382 -0.0487 -1.2959 -0.4093 -0.1515L-5.2306 15.1494C-5.7788 16.8892 -5.0014 18.5047 -3.5039 18.6907L10.9116 20.4811C12.0888 20.6273 13.1574 19.4458 13.3135 17.8935L14.7232 3.8815C14.8313 2.8068 14.1803 1.7491 13.2594 1.4884L2.2644 -1.6232Z');
  });

  it('Test transform with invalid origin value/option, should use [0,0,0]', async () => {
    const container = getMarkup();
    wrapper.append(container);
    await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
    const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

    const transform = {
      rotate: [15,15],
      skew: [-15,15],
      scale: 1.2,
    }
    // @ts-expect-error
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { origin: ['a','f','-8f'] }).transform(transform);
    path.setAttribute('d', rect.toString());
    expect(path.getAttribute('d')).to.equal('M2.1949 0.6212C0.9827 0.2781 -0.2061 1.0379 -0.4604 2.3182L-3.2228 16.2276C-3.477 17.5079 -2.7005 18.8239 -1.4883 19.1669L11.6808 22.8939C12.893 23.237 14.0818 22.4772 14.3361 21.1969L17.0985 7.2875C17.3527 6.0072 16.5762 4.6912 15.364 4.3482L2.1949 0.6212Z');

    const transform1 = {
      rotate: [15,15],
      skew: [-15,15],
      scale: 1.2,
      origin: ['aa5','3f','-8f']
    }
    // @ts-expect-error
    const rect1 = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform1);
    path.setAttribute('d', rect1.toString());
    expect(path.getAttribute('d')).to.equal('M2.1949 0.6212C0.9827 0.2781 -0.2061 1.0379 -0.4604 2.3182L-3.2228 16.2276C-3.477 17.5079 -2.7005 18.8239 -1.4883 19.1669L11.6808 22.8939C12.893 23.237 14.0818 22.4772 14.3361 21.1969L17.0985 7.2875C17.3527 6.0072 16.5762 4.6912 15.364 4.3482L2.1949 0.6212Z');
  });
  
  simpleShapes.initial.forEach((shape, i) => {
    it(`Test simple shapes #${i}`, async () => {
      const container = getMarkup();
      wrapper.append(container);
      await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
      const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });
  
      // 'Shape samples from [MDN docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands)'
      path.ownerSVGElement?.setAttribute('viewBox', '0 0 200 100');

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).normalize().toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.normalized[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({translate: 15, rotate: 15, scale: 0.5}).toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.transformed[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({scale: [0.55,0.6,0.65]}).toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.scaled3d[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({skew: 45}).toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.skewedX[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({skew: [45,0]}).toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.skewedX[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({skew: [0,45]}).toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.skewedY[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).reverse().toString());
      expect(path.getAttribute('d')).to.equal(simpleShapes.reversed[i]);

      expect(new SVGPathCommander(shape).getTotalLength()).to.equal(simpleShapes.length[i]);
      expect(new SVGPathCommander(shape).getBBox().width).to.equal(simpleShapes.width[i]);
      expect(new SVGPathCommander(shape).getBBox().height).to.equal(simpleShapes.height[i]);
      expect(new SVGPathCommander(shape).getPointAtLength(0)).to.deep.equal(simpleShapes.pointAt0[i]);
      expect(new SVGPathCommander(shape).getPointAtLength(50)).to.deep.equal(simpleShapes.pointAt50[i]);
      expect(new SVGPathCommander(shape).getPointAtLength(400)).to.deep.equal(simpleShapes.pointAt400[i]);
    });
  });

  shapes.initial.forEach((shape, i) => {
    it(`Test composite shapes #${i}`, async () => {
      const container = getMarkup();
      wrapper.append(container);
      await vi.waitFor(() => container.querySelector('svg'), { timeout: 200 });
      const path = await vi.waitFor(() => container.querySelector('path') as SVGPathElement, { timeout: 200 });

      const normalized = new SVGPathCommander(shape, { round: 2 }).normalize().toString();
      path.setAttribute('d', normalized);
      expect(path.getAttribute('d')).to.equal(shapes.normalized[i]);
      expect(new SVGPathCommander(normalized, { round: 2}).normalize().toString()).to.equal(shapes.normalized[i]); // test path already normalized

      const optimized = new SVGPathCommander(shape, { round: 2 }).optimize().toString();
      path.setAttribute('d', optimized);
      expect(path.getAttribute('d')).to.equal(shapes.optimized[i]);
      // skip checking for already optimized

      const relative = new SVGPathCommander(shape, { round: 2 }).toRelative().toString();
      path.setAttribute('d', relative);
      expect(path.getAttribute('d')).to.equal(shapes.relative[i]);
      expect(new SVGPathCommander(relative, { round: 2}).toRelative().toString()).to.equal(shapes.relative[i]);

      const absolute = new SVGPathCommander(shape, { round: 2 }).toAbsolute().toString();
      path.setAttribute('d', absolute);
      expect(path.getAttribute('d')).to.equal(shapes.absolute[i]);
      expect(new SVGPathCommander(absolute, { round: 2}).toAbsolute().toString()).to.equal(shapes.absolute[i]);

      const curve = new SVGPathCommander(shape, { round: 2 }).toCurve().toString();
      path.setAttribute('d', curve);
      expect(path.getAttribute('d')).to.equal(shapes.curve[i]);
      expect(new SVGPathCommander(curve, { round: 2}).toCurve().toString()).to.equal(shapes.curve[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({scale: 0.9}).toString());
      expect(path.getAttribute('d')).to.equal(shapes.scaled[i]);

      path.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({translate: [1,1,0]}).toString());
      expect(path.getAttribute('d')).to.equal(shapes.translated[i]);
      expect(new SVGPathCommander(shape).getTotalLength()).to.equal(shapes.length[i]);
      expect(new SVGPathCommander(shape).getPointAtLength(50)).to.deep.equal(shapes.pointAt50[i]);
    });
  })
});
