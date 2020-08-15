'use strict';
import buble from '@rollup/plugin-buble';
import {terser} from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import json from '@rollup/plugin-json';
import * as pkg from "./package.json";

const MIN = process.env.MIN === 'true' || false; // true/false|unset
const FORMAT = process.env.FORMAT; // JS umd|iife|esm

const year = (new Date).getFullYear();

const banner =
`/*!
* SVGPathCommander v${pkg.version} (${pkg.homepage})
* Copyright ${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/`;

const miniBannerJS = `// SVGPathCommander v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License`;

const INPUTFILE = 'src/index.js';
const OUTPUTFILE = 'dist/svg-path-commander'+(FORMAT!=='umd'?'.'+FORMAT:'')+(MIN?'.min':'')+'.js';

const OUTPUT = {
  file: OUTPUTFILE,
  format: FORMAT // or iife
};

const PLUGINS = [ 
  json(), 
  buble(),
  // node({mainFields: ['jsnext', 'module']}) 
];

if (MIN){
  PLUGINS.push(terser({output: {preamble: miniBannerJS}}));
} else {
  OUTPUT.banner = banner;
  PLUGINS.push(cleanup());
}

if (FORMAT!=='esm') {
  OUTPUT.name = 'SVGPathCommander';
}

export default [
  {
    input: INPUTFILE,
    output: OUTPUT,
    plugins: PLUGINS
  }
]