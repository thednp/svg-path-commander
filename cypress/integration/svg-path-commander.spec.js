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

  it('Test rounding `auto`, `off`, and [0-5]', () => {
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

    const rect2 = new SVGPathCommander('M895.02 5.12C963.38 5.12 1018.88 60.62 1018.88 128.98V895.03C1018.88 963.39 963.38 1018.89 895.02 1018.89H128.98C60.62 1018.88 5.12 963.38 5.12 895.02V128.98C5.12 60.62 60.62 5.12 128.98 5.12H895.03Z', {round: 'auto'});
    cy.wrap(rect2).as('path2')
      .get('@path2').its('round').should('equal', 0)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect2.toString());
        expect(svg[0].getAttribute('d')).to.equal('M895 5C963 5 1019 61 1019 129V895C1019 963 963 1019 895 1019H129C61 1019 5 963 5 895V129C5 61 61 5 129 5H895Z')
      })

    cy.log('-- round: off');
    const roundSample = 'M2 0C0.8954304997175604 -8.780183295920349e-10 -1.3527075029566811e-16 0.8954304997175604 0 2C0 2 0 9.875 0 14C1.3527075029566811e-16 15.10456950028244 0.8954304997175604 16.000000000878018 2 16C8 16 10.25 16 14 16C15.104569499040734 15.999999999121982 16 15.104569499040734 16 14C16 8 16 5.75 16 2C16 0.8954305009592662 15.104569499040734 8.780185991465076e-10 14 0C8 0 5.75 0 2 0';
    const rect3 = new SVGPathCommander(roundSample, {round: 'off'});
    cy.wrap(rect3).as('path3')
      .get('@path3').its('round').should('equal', 'off')
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect3.toString());
        expect(svg[0].getAttribute('d')).to.equal(roundSample)
      });

    cy.log('-- round: 0');
    const rect4 = new SVGPathCommander(roundSample, {round: 0});
    cy.wrap(rect4).as('path4')
      .get('@path4').its('round').should('equal', 0)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect4.toString());
        expect(svg[0].getAttribute('d')).to.equal('M2 0C1 0 0 1 0 2C0 2 0 10 0 14C0 15 1 16 2 16C8 16 10 16 14 16C15 16 16 15 16 14C16 8 16 6 16 2C16 1 15 0 14 0C8 0 6 0 2 0')
      });

    cy.log('-- round: 5');
    const rect5 = new SVGPathCommander(roundSample, {round: 5});
    cy.wrap(rect5).as('path5')
      .get('@path5').its('round').should('equal', 5)
      .get('@svgpath').should((svg) => {
        svg[0].setAttribute('d', rect5.toString());
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
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { round: 'off' }).toCurve();
    cy.get('@svgpath').then((svg) => {
        svg[0].setAttribute('d', rect.toString());
        expect(rect.round).to.equal('off')
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
      .get('@svgpath').then(($svg) => {
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
      .get('@svgpath').then(($svg) => {
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
    const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { origin: ['a','f','-8f'] }).transform(transform);
    cy.wrap(rect).as('path')
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('@svgpath').then(($svg) => {
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
    const rect1 = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').transform(transform1);
    cy.wrap(rect).as('path')
      .get('@path').its('origin').should('deep.equal', [8,8,24])
      .get('@svgpath').then(($svg) => {
        const [svg] = $svg.get();
        svg.setAttribute('d', rect1.toString());
        
        expect(svg.getAttribute('d')).to.equal('M3.5911 -2.3521C2.4146 -2.7667 1.158 -2.2665 0.7928 -1.1956L-4.1699 13.354C-4.7437 15.0361 -3.8887 16.7162 -2.2722 17.0327L13.1318 20.0493C14.3773 20.2932 15.4739 19.2147 15.5997 17.6963L16.7208 4.1634C16.8057 3.1381 16.1043 2.0583 15.1425 1.7193L3.5911 -2.3521Z')
      });
  });

});
