/// <reference types="cypress" />

import SVGPathCommander from '../../src/svg-path-commander';

import invalidPathValue from '../../src/parser/invalidPathValue';
import error from '../../src/parser/error';

describe('SVGPathCommander Class Test', () => {

  beforeEach(() => {
    cy.visit('cypress/test.html')
      .get('body').then((body) => {
        cy.wrap(body[0]).as('body');
      })
      .get('#test-svg path').then((svg) => {
        cy.wrap(svg[0]).as('svgpath');
      })
      .wait(200);
  });

  it('Test init with no parameter / empty throws error', () => {
    try {
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
      new SVGPathCommander('2 0a2 2 0 00-2 2');
    } catch (er) {
      expect(er).to.be.instanceOf(TypeError);
      expect(er).to.have.property('message', `${error}: ${invalidPathValue} "2" is not a path command`);
    }
  });

  it('Test init with valid path value works', () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
    cy.wrap(rect).as('path')
      .get('@path').its('segments').should('have.length', 10)
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('@path').its('round').should('equal', 4)
      .get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal(rect.toString())
      })
  });

  it('Test rounding `auto`', () => {
    cy.log('-- round: auto');
    const rect = new SVGPathCommander('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0', {round: 'auto'});
    cy.wrap(rect).as('path')
      .get('@path').its('round').should('equal', 2)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0C0.9 0 0 0.9 0 2C0 2 0 9.88 0 14C0 15.1 0.9 16 2 16C8 16 10.25 16 14 16C15.1 16 16 15.1 16 14C16 8 16 5.75 16 2C16 0.9 15.1 0 14 0C8 0 5.75 0 2 0')
      });

    const rect1 = new SVGPathCommander('M7.94 7.92C7.928954 7.92 7.92 7.928954 7.92 7.94C7.92 7.94 7.92 8.01875 7.92 8.06C7.92 8.071046 7.928954 8.08 7.94 8.08C8 8.08 8.0225 8.08 8.06 8.08C8.071046 8.08 8.08 8.071046 8.08 8.06C8.08 8 8.08 7.9775 8.08 7.94C8.08 7.928954 8.071046 7.92 8.06 7.92C8 7.92 7.9775 7.92 7.94 7.92', {round: 'auto'});
    cy.wrap(rect1).as('path1')
      .get('@path1').its('round').should('equal', 3)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect1.toString());
        expect(svg[0].getAttribute('d')).to.equal('M7.94 7.92C7.929 7.92 7.92 7.929 7.92 7.94C7.92 7.94 7.92 8.019 7.92 8.06C7.92 8.071 7.929 8.08 7.94 8.08C8 8.08 8.023 8.08 8.06 8.08C8.071 8.08 8.08 8.071 8.08 8.06C8.08 8 8.08 7.978 8.08 7.94C8.08 7.929 8.071 7.92 8.06 7.92C8 7.92 7.978 7.92 7.94 7.92')
      })

    const rect5 = new SVGPathCommander('M895.02 5.12C963.38 5.12 1018.88 60.62 1018.88 128.98V895.03C1018.88 963.39 963.38 1018.89 895.02 1018.89H128.98C60.62 1018.88 5.12 963.38 5.12 895.02V128.98C5.12 60.62 60.62 5.12 128.98 5.12H895.03Z', {round: 'auto'});
    cy.wrap(rect5).as('path1')
      .get('@path1').its('round').should('equal', 0)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect5.toString());
        expect(svg[0].getAttribute('d')).to.equal('M895 5C963 5 1019 61 1019 129V895C1019 963 963 1019 895 1019H129C61 1019 5 963 5 895V129C5 61 61 5 129 5H895Z')
      })

    cy.log('-- round: false');
    const rect4 = new SVGPathCommander('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0', {round: false});
    cy.wrap(rect4).as('path5')
      .get('@path5').its('round').should('be.false')
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect4.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0')
      });

    cy.log('-- round: 0');
    const rect2 = new SVGPathCommander('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0', {round: 0});
    cy.wrap(rect2).as('path2')
      .get('@path2').its('round').should('equal', 0)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect2.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0C1 0 0 1 0 2C0 2 0 10 0 14C0 15 1 16 2 16C8 16 10 16 14 16C15 16 16 15 16 14C16 8 16 6 16 2C16 1 15 0 14 0C8 0 6 0 2 0')
      });

    cy.log('-- round: 5');
    const rect3 = new SVGPathCommander('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0', {round: 5});
    cy.wrap(rect3).as('path3')
      .get('@path3').its('round').should('equal', 5)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect3.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0C0.89543 0 0 0.89543 0 2C0 2 0 9.875 0 14C0 15.10457 0.89543 16 2 16C8 16 10.25 16 14 16C15.10457 16 16 15.10457 16 14C16 8 16 5.75 16 2C16 0.89543 15.10457 0 14 0C8 0 5.75 0 2 0')
      });

  });

  it('Test getBBox', () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getBBox();
    expect(rect).to.deep.equal({cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16});
  });

  it('Test getTotalLength', () => {
    const len = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getTotalLength();
    expect(Math.round(len)).to.equal(61);
  });

  it('Test getPointAtLength', () => {
    const pt = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getPointAtLength(25);
    expect(pt).to.deep.equal({x: 8.715997898790722, y: 16});
  });

  it('Test toAbsolute', () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').toAbsolute();
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z')
      })
  });

  it('Test toRelative', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z').toRelative();
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-12z')
      })
  });

  it('Test toCurve', () => {
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { round:false }).toCurve();
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0')
      })
  });

  it('Test normalize', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').normalize();
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z')
      })
  });

  it('Test optimize', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z').optimize();
    cy.wrap(rect).as('path')
      .get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z')
      })
  });

  it('Test reverse single path', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse();
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0Z')
      });

    const rect1 = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse(true);
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect1.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z')
      });
  });

  it('Test reverse composite', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').reverse();
    cy.wrap(rect).as('path')
      .get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0ZM8 12L12 4H4Z')
      })
  });

  it('Test reverse composite path with `onlySubpath`', () => {
    const rect = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').reverse(true);
    cy.wrap(rect).as('path')
      .get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2ZM8 12L12 4H4Z')
      })
  });

  it('Test flipX', () => {
    const triangle = new SVGPathCommander('M0 0L16 0 L8 16');
    cy.wrap(triangle).as('path')
      .get('@path').invoke('flipX').invoke('toString').should('equal', 'M0 16H16L8 0')
  });

  it('Test flipY', () => {
    const triangle = new SVGPathCommander('M0 0L16 0 L8 16');
    cy.wrap(triangle).as('path')
      .get('@path').invoke('flipY').invoke('toString').should('equal', 'M16 0H0L8 16')
  });
  
  it('Test empty transform', () => {
    const transform = {}
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
    const transformed = rect.transform(transform);
    const transformed1 = rect.transform();
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
      .get('@svgpath').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        expect(svg.getAttribute('d')).to.equal('M7.2633 -2.5256C6.3304 -3.2173 5.0669 -2.9666 4.4572 -1.9445L-2.4437 9.625C-3.1057 10.7348 -2.7429 12.0894 -1.6535 12.6315L8.6842 17.7756C9.5167 18.1898 10.6034 17.7339 11.1245 16.7703L16.5896 6.6635C17.0753 5.7652 16.8926 4.6149 16.171 4.0798L7.2633 -2.5256Z')
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
      .get('@svgpath').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        expect(svg.getAttribute('d')).to.equal('M1.5621 0.9625C0.707 0.4356 -0.4568 0.807 -1.0236 1.8083L-7.4238 13.1157C-8.0362 14.1978 -7.7153 15.3964 -6.724 15.7784L2.7538 19.4306C3.5226 19.7268 4.5331 19.1955 5.0222 18.254L10.1606 8.361C10.6181 7.4802 10.453 6.4406 9.7825 6.0275L1.5621 0.9625Z')
      })
  });

  it('Test transform with custom [x,y,z] origin option', () => {
    const transform = {
      rotate: [15,15],
      skew: [-15,15]
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', {origin: [8,0,24]}).transform(transform);
    cy.wrap(rect).as('path')
      .get('@svgpath').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        expect(svg.getAttribute('d')).to.equal('M2.9145 -3.1334C1.9066 -3.7544 0.5556 -3.4034 -0.0852 -2.329L-7.3466 9.8448C-8.0439 11.0138 -7.636 12.3442 -6.4579 12.7981L4.6848 17.0919C5.5792 17.4366 6.734 16.8897 7.2785 15.8828L12.9854 5.3289C13.4922 4.3916 13.2842 3.2559 12.5092 2.7784L2.9145 -3.1334Z')
      })
  });

  it('Test transform with invalid origin value/option, should use [50%,50%,50%] shape', () => {
    cy.log('origin option');
    const transform = {
      rotate: [15,15],
      skew: [-15,15],
      scale: 1.2,
    }
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { origin: ['a','f','-8f'] }).transform(transform);
    cy.wrap(rect).as('path')
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('@svgpath').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect.toString());
        
        expect(svg.getAttribute('d')).to.equal('M7.1091 -4.7283C5.976 -5.5979 4.4351 -5.3287 3.691 -4.0954L-4.8089 9.993C-5.6318 11.3568 -5.1654 13.0116 -3.7983 13.6605L8.8153 19.6477C9.8035 20.1168 11.0894 19.5508 11.7056 18.4016L18.1277 6.4242C18.6948 5.3664 18.4905 4.0067 17.6569 3.3669L7.1091 -4.7283Z')
      });

    cy.log('origin transform value');
    const transform1 = {
      rotate: [15,15],
      skew: [-15,15],
      scale: 1.2,
      origin: ['aa5','3f','-8f']
    }
    const rect1 = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform1);
    cy.wrap(rect).as('path')
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('@svgpath').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect1.toString());
        
        expect(svg.getAttribute('d')).to.equal('M7.1091 -4.7283C5.976 -5.5979 4.4351 -5.3287 3.691 -4.0954L-4.8089 9.993C-5.6318 11.3568 -5.1654 13.0116 -3.7983 13.6605L8.8153 19.6477C9.8035 20.1168 11.0894 19.5508 11.7056 18.4016L18.1277 6.4242C18.6948 5.3664 18.4905 4.0067 17.6569 3.3669L7.1091 -4.7283Z')
      });
  });

});
