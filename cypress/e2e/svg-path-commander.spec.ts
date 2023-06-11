/// <reference types="cypress" />

import SVGPathCommander from '../../src/index';
import invalidPathValue from '../../src/parser/invalidPathValue';
import error from '../../src/parser/error';

import shapes from '../fixtures/shapes';
import simpleShapes from '../fixtures/simpleShapes';
import shapeObjects from '../fixtures/shapeObjects';
import { CurveArray, NormalArray, PathArray, ShapeTypes, ShapeOps } from '../../src/types';

describe('SVGPathCommander Class Test', () => {

  beforeEach(() => {
    cy.visit('cypress/test.html')
  });

  it('Test init with no parameter / empty throws error', () => {
    try {
      // @ts-ignore
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
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} "2" is not a path command`);
    }
  });

  it('Test init with valid path value works', () => {
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
       z`
    );
    cy.log(`We also test all kinds of value separation: comma, line-break and spaces.`)
      .wrap(rect).as('path')
      .get('@path').its('segments').should('have.length', 10)
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('@path').its('round').should('equal', 4)
      .get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal(rect.toString())
      })
  });

  it('Test overloaded moveTo', () => {
    const star = new SVGPathCommander(
      `M12.774 14.5111 8.0167 12.292 3.4918 14.9529 4.1321 9.7428 0.2031 6.2615 5.3562 5.2604 7.4528 0.4479 9.9972 5.0393 15.222 5.5463 11.6414 9.3851Z`,
      {round: 2}
    );
    const star1 = new SVGPathCommander(
      `m12.774 14.5111 -4.7573 -2.2191 -4.5249 2.6609 0.6403 -5.2101 -3.929 -3.4813 5.1531 -1.0011 2.0966 -4.8125 2.5444 4.5914 5.2248 0.507 -3.5806 3.8388z`,
      {round: 2}
    );

    cy.wrap(star).as('path')
      .wrap(star1).as('path1')
      .get('@path').its('segments').should('have.length', 11)
      .get('@path1').its('segments').should('have.length', 11)
      .get('path').then((svg) => {
        svg[0].setAttribute('d', star.toString());
        expect(svg[0].getAttribute('d')).to.equal(star.toString())
      })
      .wait(100)
      .get('path').then((svg) => {
        svg[0].setAttribute('d', star1.toString());
        expect(svg[0].getAttribute('d')).to.equal(star1.toString())
      })
  });

  it('Test rounding `auto`, `off`, and [0-5]', () => {
    cy.log('**round**: auto').then(() => {
      const rect = new SVGPathCommander('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0', {round: 'auto'});
      cy.wrap(rect).as('path')
        .get('@path').its('round').should('equal', 2)
        .get('path').should((svg) => {
          svg[0].setAttribute('d', rect.toString());
          expect(svg[0].getAttribute('d')).to.equal('M2 0C0.9 0 0 0.9 0 2C0 2 0 9.88 0 14C0 15.1 0.9 16 2 16C8 16 10.25 16 14 16C15.1 16 16 15.1 16 14C16 8 16 5.75 16 2C16 0.9 15.1 0 14 0C8 0 5.75 0 2 0')
        });
    });

    cy.log('**round**: auto').then(() => {
      const rect1 = new SVGPathCommander('M7.94 7.92C7.928954 7.92 7.92 7.928954 7.92 7.94C7.92 7.94 7.92 8.01875 7.92 8.06C7.92 8.071046 7.928954 8.08 7.94 8.08C8 8.08 8.0225 8.08 8.06 8.08C8.071046 8.08 8.08 8.071046 8.08 8.06C8.08 8 8.08 7.9775 8.08 7.94C8.08 7.928954 8.071046 7.92 8.06 7.92C8 7.92 7.9775 7.92 7.94 7.92', {round: 'auto'});
      cy.wrap(rect1).as('path1')
        .get('@path1').its('round').should('equal', 3)
        .get('path').should((svg) => {
          svg[0].setAttribute('d', rect1.toString());
          expect(svg[0].getAttribute('d')).to.equal('M7.94 7.92C7.929 7.92 7.92 7.929 7.92 7.94C7.92 7.94 7.92 8.019 7.92 8.06C7.92 8.071 7.929 8.08 7.94 8.08C8 8.08 8.023 8.08 8.06 8.08C8.071 8.08 8.08 8.071 8.08 8.06C8.08 8 8.08 7.978 8.08 7.94C8.08 7.929 8.071 7.92 8.06 7.92C8 7.92 7.978 7.92 7.94 7.92')
        })
    });

    cy.log('**round**: auto').then(() => {
      const rect2 = new SVGPathCommander('M895.02 5.12C963.38 5.12 1018.88 60.62 1018.88 128.98V895.03C1018.88 963.39 963.38 1018.89 895.02 1018.89H128.98C60.62 1018.88 5.12 963.38 5.12 895.02V128.98C5.12 60.62 60.62 5.12 128.98 5.12H895.03Z', {round: 'auto'});
      cy.wrap(rect2).as('path2')
        .get('@path2').its('round').should('equal', 0)
        .get('path').should((svg) => {
          svg[0].setAttribute('d', rect2.toString());
          expect(svg[0].getAttribute('d')).to.equal('M895 5C963 5 1019 61 1019 129V895C1019 963 963 1019 895 1019H129C61 1019 5 963 5 895V129C5 61 61 5 129 5H895Z')
        })
    });

    const roundSample = 'M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0';
    cy.log('**round**: off').then(() => {
      const rect3 = new SVGPathCommander(roundSample, {round: 'off'});
      cy.wrap(rect3).as('path3')
        .get('@path3').its('round').should('equal', 'off')
        .get('path').should((svg) => {
          svg[0].setAttribute('d', rect3.toString());
          expect(svg[0].getAttribute('d')).to.equal(roundSample)
        });
    });

    cy.log('**round**: 0').then(() => {
      const rect4 = new SVGPathCommander(roundSample, {round: 0});
      cy.wrap(rect4).as('path4')
        .get('@path4').its('round').should('equal', 0)
        .get('path').should((svg) => {
          svg[0].setAttribute('d', rect4.toString());
          expect(svg[0].getAttribute('d')).to.equal('M2 0C1 0 0 1 0 2C0 2 0 10 0 14C0 15 1 16 2 16C8 16 10 16 14 16C15 16 16 15 16 14C16 8 16 6 16 2C16 1 15 0 14 0C8 0 6 0 2 0')
        });
    });

    cy.log('**round**: 5').then(() => {
      const rect5 = new SVGPathCommander(roundSample, {round: 5});
      cy.wrap(rect5).as('path5')
        .get('@path5').its('round').should('equal', 5)
        .get('path').should((svg) => {
          svg[0].setAttribute('d', rect5.toString());
          expect(svg[0].getAttribute('d')).to.equal('M2 0C0.89543 0 0 0.89543 0 2C0 2 0 9.875 0 14C0 15.10457 0.89543 16 2 16C8 16 10.25 16 14 16C15.10457 16 16 15.10457 16 14C16 8 16 5.75 16 2C16 0.89543 15.10457 0 14 0C8 0 5.75 0 2 0')
        });
    });
  });

  it('Test getBBox', () => {
    cy.log('Using the SVGPathCommander').then(() => {
      const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getBBox();
      expect(rect).to.deep.equal({cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16});
    })
    cy.log('Using the static method').then(() => {
      expect(SVGPathCommander.getPathBBox('')).to.deep.equal({cx: 0, cy: 0, cz: 0, height: 0, width: 0, x: 0, x2: 0, y: 0, y2: 0});
    })
  });

  it('Test getTotalLength', () => {
    const len = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getTotalLength();
    expect(Math.round(len)).to.equal(61);
  });

  it('Test getPointAtLength', () => {
    const pt = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getPointAtLength(25);
    expect(pt).to.deep.equal({ x: 8.716821870196814, y: 16 });

    const pt1 = new SVGPathCommander('M2 0A2 2 0 00 2 0').getPointAtLength(0);
    expect(pt1).to.deep.equal({ x: 2, y: 0 });

    const pt2 = new SVGPathCommander('M2 0A0 2 0 00 0 2').getPointAtLength(0.5);
    expect(pt2).to.deep.equal({x: 1.6464466094067265, y: 0.35355339059327356});

    const pt3 = new SVGPathCommander('M2 0A3 2 0 00 0 2').getPointAtLength(5);
    expect(pt3).to.deep.equal({x: 0, y: 2});
  });

  it('Test toAbsolute', () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').toAbsolute();
    cy.get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z')
      })
  });

  it('Test toRelative', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z').toRelative();
    cy.get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-12z')
      })
  });

  it('Test toCurve', () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { round: 'off' }).toCurve();
    cy.get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(rect.round).to.equal('off')
        expect(svg[0].getAttribute('d')).to.equal('M2 0C0.8954305003384135 2.0290612532945332e-16 -1.3527075021963556e-16 0.8954305003384133 0 2C0 6 0 10 0 14C1.3527075021963556e-16 15.104569499661586 0.8954305003384133 16 2 16C6 16 10 16 14 16C15.104569499661586 16 16 15.104569499661586 16 14C16 10 16 6 16 2C16 0.8954305003384135 15.104569499661586 6.763537510981778e-17 14 0C10 0 6 0 2 0C2 0 2 0 2 0')
      })
  });

  it('Test normalize', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').normalize();
    cy.get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z')
      })
  });

  it('Test optimize', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z').optimize();
    cy.wrap(rect).as('path')
      .get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z')
      })
  });

  it('Test reverse single path', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse();
    cy.get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0Z')
      });

    const rect1 = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse(true);
    cy.get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect1.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z')
      });
  });

  it('Test reverse composite', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').reverse();
    cy.wrap(rect).as('path')
      .get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0ZM8 12L12 4H4Z')
      })
  });

  it('Test reverse composite path with `onlySubpath`', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').reverse(true);
    cy.wrap(rect).as('path')
      .get('#test-svg path').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2ZM8 12L12 4H4Z')
      })
  });

  it('Test flipX', () => {
    const triangle = new SVGPathCommander('M0 0L16 0 L8 16');
    cy.wrap(triangle).as('path')
      .get('@path').invoke('flipX').invoke('toString').should('equal', 'M16 0H0L8 16')
  });

  it('Test flipY', () => {
    const triangle = new SVGPathCommander('M0 0L16 0 L8 16');
    cy.wrap(triangle).as('path')
      .get('@path').invoke('flipY').invoke('toString').should('equal', 'M0 16H16L8 0')
  });
  
  it('Test empty transform', () => {
    const transform = {}
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
    const transformed = rect.transform(transform);
    const transformed1 = rect.transform();
    // @ts-ignore
    const transformed2 = rect.transform('');

    expect(rect.segments).to.deep.equal(transformed.segments);
    expect(rect.segments).to.deep.equal(transformed1.segments);
    expect(rect.segments).to.deep.equal(transformed2.segments);
  });
  
  it('Test transform', () => {
    const transform = {
      rotate: [15,15],
      skew: [-15,15],
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform);
    cy.wrap(rect).as('path')
      .get('#test-svg path').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        expect(svg.getAttribute('d')).to.equal('M4.2822 -0.7292C3.2968 -1.0661 2.2579 -0.6161 1.968 0.3039L-1.818 12.3193C-2.2382 13.6528 -1.5362 14.9914 -0.2586 15.2621L12.2189 17.9057C13.2524 18.1247 14.1807 17.2742 14.3045 16.0438L15.4431 4.7255C15.5321 3.8414 14.9376 2.9137 14.1072 2.6298L4.2822 -0.7292Z')
      })
  });

  it('Test transform with custom [x,y] origin', () => {
    const transform = {
      rotate: [15,15],
      skew: [-15,15],
      origin: [0,0]
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform);
    cy.wrap(rect).as('path')
      .get('#test-svg path').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        expect(svg.getAttribute('d')).to.equal('M1.803 0.5103C0.8136 0.2303 -0.1738 0.8753 -0.3942 1.9847L-3.3005 16.6188C-3.6264 18.2599 -2.8358 19.7672 -1.5474 19.9273L10.9598 21.4806C11.9895 21.6085 12.8318 20.4819 12.8569 19.0097L13.0856 5.5772C13.1033 4.5361 12.4554 3.525 11.6282 3.2909L1.803 0.5103Z')
      })
  });

  it('Test transform with custom [x,y,z] origin option', () => {
    const transform = {
      rotate: [15,15],
      skew: [-15,15]
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', {origin: [8,0,24]}).transform(transform);
    cy.wrap(rect).as('path')
      .get('#test-svg path').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        expect(svg.getAttribute('d')).to.equal('M2.2644 -1.6232C1.1515 -1.9382 -0.0487 -1.2959 -0.4093 -0.1515L-5.2306 15.1494C-5.7788 16.8892 -5.0014 18.5047 -3.5039 18.6907L10.9116 20.4811C12.0888 20.6273 13.1574 19.4458 13.3135 17.8935L14.7232 3.8815C14.8313 2.8068 14.1803 1.7491 13.2594 1.4884L2.2644 -1.6232Z')
      })
  });

  it('Test transform with invalid origin value/option, should use [50%,50%,50%] shape', () => {
    cy.log('origin option');
    const transform = {
      rotate: [15,15],
      skew: [-15,15],
      scale: 1.2,
    }
    // @ts-ignore
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { origin: ['a','f','-8f'] }).transform(transform);
    cy.wrap(rect).as('path')
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('#test-svg path').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        
        expect(svg.getAttribute('d')).to.equal('M3.5911 -2.3521C2.4146 -2.7667 1.158 -2.2665 0.7928 -1.1956L-4.1699 13.354C-4.7437 15.0361 -3.8887 16.7162 -2.2722 17.0327L13.1318 20.0493C14.3773 20.2932 15.4739 19.2147 15.5997 17.6963L16.7208 4.1634C16.8057 3.1381 16.1043 2.0583 15.1425 1.7193L3.5911 -2.3521Z')
      });

    cy.log('origin transform value');
    const transform1 = {
      rotate: [15,15],
      skew: [-15,15],
      scale: 1.2,
      origin: ['aa5','3f','-8f']
    }
    // @ts-ignore
    const rect1 = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform1);
    cy.wrap(rect1).as('path1')
      .get('@path1').its('origin').should('deep.equal', [8,8,24])
      .get('#test-svg path').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect1.toString());
        
        expect(svg.getAttribute('d')).to.equal('M3.5911 -2.3521C2.4146 -2.7667 1.158 -2.2665 0.7928 -1.1956L-4.1699 13.354C-4.7437 15.0361 -3.8887 16.7162 -2.2722 17.0327L13.1318 20.0493C14.3773 20.2932 15.4739 19.2147 15.5997 17.6963L16.7208 4.1634C16.8057 3.1381 16.1043 2.0583 15.1425 1.7193L3.5911 -2.3521Z')
      });
  });
  
  simpleShapes.initial.forEach((shape, i) => {
    it(`Test simple shapes #${i}`, () => {

      cy.log('Shape samples from [MDN docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands)')
        .get('#test-svg path').then(($svg) => {
          const svg = $svg[0] as unknown as SVGPathElement;
          svg.ownerSVGElement?.setAttribute('viewBox', '0 0 200 100');

          cy.log('**normalize**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).normalize().toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.normalized[i]);
          });

          cy.log('**transform2d**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({translate: 15, rotate: 15, scale: 0.5}).toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.transformed[i]);
          });

          cy.log('**scale3d**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({scale: [0.55,0.6,0.65]}).toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.scaled3d[i]);
          });

          cy.log('**skew**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({skew: 45}).toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.skewedX[i]);
          });

          cy.log('**skewX**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({skew: [45,0]}).toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.skewedX[i]);
          });

          cy.log('**skewY**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({skew: [0,45]}).toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.skewedY[i]);
          });

          cy.log('**reverse**').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).reverse().toString());
            expect(svg.getAttribute('d')).to.equal(simpleShapes.reversed[i]);
          });

          
          cy.log('**getTotalLength**').then(() => {
            expect(new SVGPathCommander(shape).getTotalLength()).to.equal(simpleShapes.length[i]);
          });

          cy.log('**getPointAtLength** 0').then(() => {
            expect(new SVGPathCommander(shape).getPointAtLength(0)).to.deep.equal(simpleShapes.pointAt0[i]);
          });
          cy.log('**getPointAtLength** 50').then(() => {
            expect(new SVGPathCommander(shape).getPointAtLength(50)).to.deep.equal(simpleShapes.pointAt50[i]);
          });
          cy.log('**getPointAtLength** 400').then(() => {
            expect(new SVGPathCommander(shape).getPointAtLength(400)).to.deep.equal(simpleShapes.pointAt400[i]);
          });
      });
    });
  });

  shapes.initial.forEach((shape, i) => {
    it(`Test composite shapes #${i}`, () => {
      cy.get('#test-svg path').then(($svg) => {
          const svg = $svg[0];

          cy.log('**normalize**').then(() => {
            const normalized = new SVGPathCommander(shape, { round: 2 }).normalize().toString();
            svg.setAttribute('d', normalized);
            expect(svg.getAttribute('d')).to.equal(shapes.normalized[i]);
            expect(new SVGPathCommander(normalized, { round: 2}).normalize().toString()).to.equal(shapes.normalized[i]); // test path already normalized
          });

          cy.log('**optimize**').then(() => {
            const optimized = new SVGPathCommander(shape, { round: 2 }).optimize().toString();
            svg.setAttribute('d', optimized);
            expect(svg.getAttribute('d')).to.equal(shapes.optimized[i]);
            // skip checking for already optimized
          });

          cy.log('**toRelative**').then(() => {
            const relative = new SVGPathCommander(shape, { round: 2 }).toRelative().toString();
            svg.setAttribute('d', relative);
            expect(svg.getAttribute('d')).to.equal(shapes.relative[i]);
            expect(new SVGPathCommander(relative, { round: 2}).toRelative().toString()).to.equal(shapes.relative[i]);
          });

          cy.log('**toAbsolute**').then(() => {
            const absolute = new SVGPathCommander(shape, { round: 2 }).toAbsolute().toString();
            svg.setAttribute('d', absolute);
            expect(svg.getAttribute('d')).to.equal(shapes.absolute[i]);
            expect(new SVGPathCommander(absolute, { round: 2}).toAbsolute().toString()).to.equal(shapes.absolute[i]);
          });
          
          cy.log('**toCurve**').then(() => {
            const curve = new SVGPathCommander(shape, { round: 2 }).toCurve().toString();
            svg.setAttribute('d', curve);
            expect(svg.getAttribute('d')).to.equal(shapes.curve[i]);
            expect(new SVGPathCommander(curve, { round: 2}).toCurve().toString()).to.equal(shapes.curve[i]);
          });

          cy.log('**transform** scale').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({scale: 0.9}).toString());
            expect(svg.getAttribute('d')).to.equal(shapes.scaled[i]);
          });

          cy.log('**transform** translate').then(() => {
            svg.setAttribute('d', new SVGPathCommander(shape, { round: 2 }).transform({translate: [1,1,0]}).toString());
            expect(svg.getAttribute('d')).to.equal(shapes.translated[i]);
          });

          cy.log('**getTotalLength**').then(() => {
            expect(new SVGPathCommander(shape).getTotalLength()).to.equal(shapes.length[i]);
          });

          cy.log('**getPointAtLength**').then(() => {
            expect(new SVGPathCommander(shape).getPointAtLength(50)).to.deep.equal(shapes.pointAt50[i]);
          });
        });
    });
  })
});

describe('SVGPathCommander Static Methods', () => {
  before(() => {
    cy.log('Testing other static methods not covered by the **SVGPathCommander** constructor');
  })

  beforeEach(() => {
    cy.visit('cypress/test.html')
      .get('#test-svg').then((svg) => {
        svg[0].setAttribute('viewBox', '0 0 182 72');
        cy.wrap(svg[0]).as('svg');
      })
      .wait(200);
  });

  it('Convert shape to path with incomplete values should return false', () => {
    ['line', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'glyph'].forEach((SHAPE) => {
      cy.log(`**${SHAPE}** with no specific attributes`).then(() => {
        // @ts-ignore
        expect(SVGPathCommander.shapeToPath({ type: SHAPE, fill: 'red' })).to.be.false;
      })
    })
  });

  it('Convert shape to pathArray with incomplete values should return false', () => {
    ['line', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'glyph'].forEach((SHAPE) => {
      cy.log(`**${SHAPE}** with no specific attributes`).then(() => {
        // @ts-ignore
        expect(SVGPathCommander.shapeToPathArray({ type: SHAPE, fill: 'red' })).to.be.false;
      })
    })
  });

  ['wombat', 'line', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'glyph', 'path'].forEach((SHAPE) => {
    it(`Convert <${SHAPE}> to path`, () => {
      cy.get('@svg').invoke('prop', 'innerHTML', `<line id="line" x1="0" y1="0" x2="182" y2="72" stroke="turquoise" stroke-width="2" />
          <circle id="circle" cx="27.5" cy="36.9" r="23.5" fill="orangered"/>
          <ellipse id="ellipse" cx="68.3" cy="37" rx="15.1" fill="darkorange"/>
          <wombat id="wombat" fill="black"/>
          <polygon id="polygon" points="107.4,13 113.7,28.8 127.9,31.3 117.6,43.5 120.1,60.8 107.4,52.6 94.6,60.8 97.1,43.5 86.8,31.3 101,28.8" fill="yellow"/>
          <polyline id="polyline" points="107.39,17.78 112.43,30.42 123.79,32.42 115.55,42.18 117.55,56.02 107.39,49.46 97.15,56.02 99.15,42.18 90.91,32.42 102.27,30.42" fill="none" stroke="black" stroke-width="2"/>
          <rect id="rect" x="131" y="13.2" width="47.5" height="47.6" rx="25" fill="yellowgreen"/>
          <path id="path" d="M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3" fill="rgba(255,255,255,0.3)"/>
          <glyph id="glyph" d="M143.5 22.72H166s3 0 3 3v22.56s0 3 -3 3h-22.5s-3 0 -3 -3V25.72s0 -3 3 -3" fill="rgba(255,255,255,0.3)"/>`)
      if (SHAPE === 'wombat') {
        cy.get('@svg').find(SHAPE).then((shape) => {
          try {
            SVGPathCommander.shapeToPathArray(shape[0] as unknown as SVGCircleElement, shape[0].ownerDocument)
          } catch (er) {
            expect(er).to.be.instanceOf(TypeError);
            expect(er).to.have.property('message', `${error}: "${SHAPE}" is not SVGElement`);
          }
          try {
            SVGPathCommander.shapeToPath(shape[0] as unknown as SVGCircleElement, true, shape[0].ownerDocument)
          } catch (er) {
            expect(er).to.be.instanceOf(TypeError);
            expect(er).to.have.property('message', `${error}: "${SHAPE}" is not SVGElement`);
          }
        })
      } else if (SHAPE === 'path') {
        cy.get('@svg').find(SHAPE).then((shape) => {
          try {
            SVGPathCommander.shapeToPath(shape[0] as unknown as SVGCircleElement, true, shape[0].ownerDocument)
          } catch (er) {
            expect(er).to.be.instanceOf(TypeError);
            expect(er).to.have.property('message', `${error}: "${SHAPE}" is already SVGPathElement`);
          }
        })
      } else {
        cy.get('@svg').find(SHAPE).should('exist').then((shape) => {
          SVGPathCommander.shapeToPath(shape[0] as unknown as ShapeTypes, true, shape[0].ownerDocument)
        })
        .get('@svg').find(SHAPE).should('not.exist')
        .get('@svg').find(`#${SHAPE}`).should('exist')
        .and('have.attr', 'd').and('have.length.greaterThan', 0)
      }
    });
  });

  shapeObjects.forEach((SHAPE) => {
    it(`Convert "${SHAPE.type}" Object to pathArray`, () => {
      cy.wrap(SVGPathCommander.shapeToPathArray(SHAPE as unknown as ShapeTypes))
      .should('have.length.greaterThan', 0)
    });
  });

  it(`Convert wombat Object to pathArray should throw error`, () => {
    try {
      SVGPathCommander.shapeToPathArray({ type: 'wombat', fill: 'red' } as unknown as ShapeTypes)
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: "wombat" is not SVGElement`);
    }
  });

  shapeObjects.forEach((SHAPE) => {
    it(`Convert "${SHAPE.type}" Object to path`, () => {
      // cy.document().then(doc => {
        cy.get('@svg').should('exist').invoke('append', SVGPathCommander.shapeToPath(SHAPE as unknown as ShapeTypes))
          .get(`#${SHAPE.type}`).should('exist')
          .and('have.attr', 'd')
          .and('have.length.greaterThan', 0)
      // })
    });
  });

  simpleShapes.normalized.forEach((SHAPE, i) => {
    it(`Can do optimizePath #${i}`, () => {
      const path = new SVGPathCommander(SHAPE);
  
      expect(path.optimize().toString()).to.equal(simpleShapes.initial[i]);
    });
  });

  it(`Can revert back to default round option`, () => {
    const sample = [["M",0,0],["L",181.99955,0],["L",91,72],["L",0,0],["Z"]];
    const rounded = [["M",0,0],["L",181.9996,0],["L",91,72],["L",0,0],["Z"]];

    cy.log(`-- use 4 decimals when negative number is provided`).then(() => {
      expect(SVGPathCommander.roundPath(sample, -1)).to.deep.equal(rounded);
    });
    cy.log(`-- use 4 decimals when string is provided`).then(() => {
      // @ts-ignore
      expect(SVGPathCommander.roundPath(sample, 'wombat')).to.deep.equal(rounded);
    });
  });

  it(`Can do reverseCurve`, () => {
    const path = new SVGPathCommander(simpleShapes.normalized[1]);
    const pathReversed = new SVGPathCommander(simpleShapes.normalized[1]).reverse();
    const reversed = [["M",170,90],["C",150,90,155,10,130,10],["C",105,10,110,90,90,90],["C",70,90,75,10,50,10],["C",25,10,30,90,10,90]];

    expect(pathReversed.segments).to.deep.equal(reversed);
    expect(SVGPathCommander.reverseCurve(pathReversed.segments as CurveArray)).to.deep.equal(path.segments);
  });

  it(`Can do reversePath`, () => {
    const path = new SVGPathCommander(simpleShapes.normalized[2]);
    const pathReversed = new SVGPathCommander(simpleShapes.normalized[2]).reverse();
    const reversed = [["M",190,50],["Q",175,75,160,50],["Q",145,25,130,50],["Q",115,75,100,50],["Q",85,25,70,50],["Q",55,75,40,50],["Q",25,25,10,50]];

    expect(pathReversed.segments).to.deep.equal(reversed);
    expect(SVGPathCommander.reversePath(pathReversed.segments)).to.deep.equal(path.segments);
  });

  it(`Can transformPath with arc segments`, () => {
    const { transformPath, pathToString, reversePath } = SVGPathCommander;

    cy.log(`This test assumes **SVGPathCommander** static method can work with default
      transform origin *{0,0,0}* when no origin is provided in the **transformObject**.
      The test also shows how Arc segments are converted to CubicBezier for transformation.`)
      .then(() => {
        const path = pathToString(transformPath(simpleShapes.initial[3], { rotate: 45 }));
        expect(path).to.equal('M-2.8284 11.3137C-6.3778 10.7769 -7.6385 14.9238 -5.0977 18.7783C-2.5569 22.6327 1.8798 23.3038 2.8884 19.9862C3.153 19.1158 3.1321 18.0645 2.8284 16.9706M-2.8284 11.3137C-3.9859 7.1438 -0.9528 4.7691 2.631 7.0393C6.2148 9.3095 7.6616 14.5219 5.2352 16.4216C4.5986 16.92 3.7596 17.1114 2.8284 16.9706M-2.8284 11.3137C-0.4208 11.6779 2.0433 14.1419 2.8284 16.9706M-2.8284 11.3137C-2.0433 14.1423 0.4208 16.6064 2.8284 16.9706');
    
        const path1 = pathToString(transformPath(simpleShapes.initial[3], { rotate: -45 }));
        expect(path1).to.equal('M11.3137 2.8284C10.7769 6.3778 14.9238 7.6385 18.7783 5.0977C22.6327 2.5569 23.3038 -1.8798 19.9862 -2.8884C19.1158 -3.153 18.0645 -3.1321 16.9706 -2.8284M11.3137 2.8284C7.1438 3.9859 4.7691 0.9528 7.0393 -2.631C9.3095 -6.2148 14.5219 -7.6616 16.4216 -5.2352C16.92 -4.5986 17.1114 -3.7596 16.9706 -2.8284M11.3137 2.8284C11.6779 0.4208 14.1419 -2.0433 16.9706 -2.8284M11.3137 2.8284C14.1423 2.0433 16.6064 -0.4208 16.9706 -2.8284');
    
        const path2 = pathToString(transformPath(reversePath(simpleShapes.initial[3]), { rotate: 45 }));
        expect(path2).to.equal('M2.8284 16.9706C0.4208 16.6064 -2.0433 14.1423 -2.8284 11.3137M2.8284 16.9706C2.0433 14.1419 -0.4208 11.6779 -2.8284 11.3137M2.8284 16.9706C6.3778 17.5074 7.6385 13.3604 5.0977 9.506C2.5569 5.6516 -1.8798 4.9805 -2.8884 8.2981C-3.153 9.1684 -3.1321 10.2198 -2.8284 11.3137M2.8284 16.9706C3.9859 21.1405 0.9528 23.5152 -2.631 21.245C-6.2148 18.9748 -7.6616 13.7624 -5.2352 11.8626C-4.5986 11.3642 -3.7596 11.1729 -2.8284 11.3137');
    
        const path3 = pathToString(transformPath(reversePath(simpleShapes.initial[3]), { rotate: -45 }));
        expect(path3).to.equal('M16.9706 -2.8284C16.6064 -0.4208 14.1423 2.0433 11.3137 2.8284M16.9706 -2.8284C14.1419 -2.0433 11.6779 0.4208 11.3137 2.8284M16.9706 -2.8284C17.5074 -6.3778 13.3604 -7.6385 9.506 -5.0977C5.6516 -2.5569 4.9805 1.8798 8.2981 2.8884C9.1684 3.153 10.2198 3.1321 11.3137 2.8284M16.9706 -2.8284C21.1405 -3.9859 23.5152 -0.9528 21.245 2.631C18.9748 6.2148 13.7624 7.6616 11.8626 5.2352C11.3642 4.5986 11.1729 3.7596 11.3137 2.8284');
      })
  });

  it(`Can do getPropertiesAtLength`, () => {
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
    expect(props0.segment).to.deep.equal([ "M", 10, 10 ])

    const props50 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 50);
    // cy.log(props50)
    expect(props50.index).to.equal(1)
    expect(props50.lengthAtSegment).to.equal(0)
    expect(props50.segment).to.deep.equal(['l', 80, 80])

    const props400 = SVGPathCommander.getPropertiesAtLength(simpleShapes.initial[0], 400);
    // cy.log(props50)
    expect(props400.index).to.equal(3)
    expect(props400.lengthAtSegment).to.equal(193.1370849898476)
    expect(props400.segment).to.deep.equal([ 'H', 50 ])
  });

  it(`Can do getPropertiesAtPoint`, () => {
    const { getPropertiesAtPoint } = SVGPathCommander;

    cy.log('-- **getPropertiesAtPoint** first point').then(() => {
      const propsPoint0 = getPropertiesAtPoint(simpleShapes.initial[1], { "x": 10, "y": 90 });
      expect(propsPoint0.closest).to.deep.equal({x: 10, y: 90})
      expect(propsPoint0.distance).to.equal(0)
      expect(propsPoint0.segment).to.deep.equal({ segment: ["M", 10, 90], index: 0, length: 0, point: {x:10, y: 90}, lengthAtSegment: 0 })
    });

    cy.log('-- **getPropertiesAtPoint** mid point').then(() => {
      const propsPoint50 = getPropertiesAtPoint(simpleShapes.initial[1], {x: 30.072453006153214, y: 41.42818552481854});
      expect(propsPoint50.closest).to.deep.equal({x: 30.072453006153214, y: 41.42818552481854})
      expect(propsPoint50.distance).to.equal(0)
      expect(propsPoint50.segment).to.deep.equal({ segment: ['C', 30, 90, 25, 10, 50, 10], index: 1, length: 94.75680906732815, lengthAtSegment: 0 })
    });

    cy.log('-- **getPropertiesAtPoint** last point').then(() => {
      const propsPoint400 = getPropertiesAtPoint(simpleShapes.initial[1], { "x": 50, "y": 10 });
      expect(propsPoint400.closest).to.deep.equal({x: 50.243177049793694, y: 10.00259849715006})
      expect(propsPoint400.distance).to.equal(0.24319093267184844)
      expect(propsPoint400.segment).to.deep.equal({ segment: ['s', 20, 80, 40, 80], index: 2, length: 94.75680906732818, lengthAtSegment: 94.75680906732815 })
    })
  });

  it(`Can do getSegmentAtLength`, () => {
    const { getSegmentAtLength } = SVGPathCommander;
    cy.log('-- **getSegmentAtLength** undefined').then(() => {
      expect(getSegmentAtLength(simpleShapes.initial[1])).to.deep.equal(['M', 10, 90]); 
    });
    cy.log('-- **getSegmentAtLength** 0').then(() => {
      expect(getSegmentAtLength(simpleShapes.initial[1], 0)).to.deep.equal(['M', 10, 90]); 
    });
    cy.log('-- **getSegmentAtLength** 15').then(() => {
      expect(getSegmentAtLength(simpleShapes.initial[3], 15)).to.deep.equal(['a', 6, 4, 10, 1, 0, 8, 0]);
    });
    cy.log('-- **getSegmentAtLength** 400').then(() => {
      expect(getSegmentAtLength(simpleShapes.initial[3], 400)).to.deep.equal(['a', 6, 4, 10, 0, 0, 8, 0]);
    });
  });

  it(`Can do getSegmentOfPoint`, () => {
    const { getSegmentOfPoint } = SVGPathCommander;
    cy.log('-- **getSegmentOfPoint** first point').then(() => {
      expect(getSegmentOfPoint(simpleShapes.initial[1], { x: 10, y: 90 })).to.deep.equal({segment: ["M",10,90], index:0, length:0, point: {x:10,y:90}, lengthAtSegment: 0}); 
    });
    cy.log('-- **getSegmentOfPoint** mid point').then(() => {
      expect(getSegmentOfPoint(simpleShapes.initial[3], { x: 9, y: 9})).to.deep.equal({segment: ["a",6,4,10,0,1,8,0], index: 5, length: 8.400632026154419, lengthAtSegment: 46.6599158251274});
    });
  });

  it(`Can do getClosestPoint`, () => {
    const { getClosestPoint } = SVGPathCommander;
    cy.log('-- **getClosestPoint** first point').then(() => {
      expect(getClosestPoint(simpleShapes.initial[1], { x: 10, y: 90 })).to.deep.equal({x: 10, y: 90}); 
    });
    cy.log('-- **getClosestPoint** mid point').then(() => {
      expect(getClosestPoint(simpleShapes.initial[3], { x: 9, y: 9})).to.deep.equal({ x: 9.123926246784901, y: 8.941790467688946});
    });
  });

  it(`Can do isPointInStroke`, () => {
    const { isPointInStroke } = SVGPathCommander;
    cy.log('-- **isPointInStroke** first point').then(() => {
      expect(isPointInStroke(simpleShapes.initial[1], { x: 10, y: 90 })).to.be.true;
    });

    cy.log('-- **isPointInStroke** mid point').then(() => {
      expect(isPointInStroke(simpleShapes.initial[1], { x: 28.94438057441916, y: 46.29922469345143})).to.be.true;
    });

    cy.log('-- **isPointInStroke**({ x: 10, y: 10 })').then(() => {
      expect(isPointInStroke(simpleShapes.initial[1], { x: 10, y: 10 })).to.be.false;
    });

    cy.log('-- **isPointInStroke**({ x: 45.355339, y: 45.355339 })').then(() => {
      expect(isPointInStroke(simpleShapes.initial[1], { x: 45.355339, y: 45.355339 })).to.be.false;
    });

    cy.log('-- **isPointInStroke**({ x: 50, y: 10 })').then(() => {
      expect(isPointInStroke(simpleShapes.initial[1], { x: 50, y: 10 })).to.be.false;
    });
  });

  it(`Can do getDrawDirection`, () => {
    const { getDrawDirection } = SVGPathCommander;

    cy.log('-- **getDrawDirection** should be true').then(() => {
      expect(getDrawDirection(simpleShapes.reversed[1])).to.be.true;
    });
    cy.log('-- **getDrawDirection** should be false').then(() => {
      expect(getDrawDirection(simpleShapes.initial[1])).to.be.false;
    });

  });

  it(`Can do splitCubic`, () => {
    const { splitCubic } = SVGPathCommander;
    expect(splitCubic([70, 60, 70, 80, 110, 80, 110, 60])).to.deep.equal([
      ['C', 70, 70, 80, 75, 90, 75],
      ['C', 100, 75, 110, 70, 110, 60],
    ]);
  });

  it(`Can do polygonLength`, () => {
    const { polygonLength } = SVGPathCommander;
    expect(polygonLength([[100,100], [150,25], [150,75], [200,0]])).to.equal(230.27756377319946);
  });

  it(`Can do polygonArea`, () => {
    const { polygonArea } = SVGPathCommander;
    expect(polygonArea([[107.4,13], [113.7,28.8], [127.9,31.3], [117.6,43.5], [120.1,60.8], [107.4,52.6], [94.6,60.8], [97.1,43.5], [86.8,31.3], [101,28.8]])).to.equal(-836.69);
  });

  it(`Can do transformPath with empty object`, () => {
    const { transformPath, pathToString } = SVGPathCommander;

    cy.log('-- **transformObject** is *undefined*').then(() => {
      const path = pathToString(transformPath(simpleShapes.normalized[0] as string));
      expect(path).to.equal(simpleShapes.normalized[0]);
    });

    cy.log('-- **transformObject** is *empty*').then(() => {
      // @ts-ignore
      const path = pathToString(transformPath(simpleShapes.normalized[0], {}));
      expect(path).to.equal(simpleShapes.normalized[0]);
    });

    cy.log('-- **transformObject** has only *origin*').then(() => {
      const path = pathToString(transformPath(simpleShapes.normalized[0], { origin: [0,0,0]}));
      expect(path).to.equal(simpleShapes.normalized[0]);
    })
  });

});
