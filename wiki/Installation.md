**SVGPathCommander** can be installed via NPM, from [JSR](https://jsr.io/@thednp/svg-path-commander), or from the CDN.

## NPM

```sh
npm install svg-path-commander
# or pnpm add svg-path-commander
# or bun add svg-path-commander
```

The package ships an ESM bundle (`svg-path-commander`), a UMD bundle for the browser (`dist/index.min.js`, global `SVGPathCommander`) and a tree-shakeable static-methods entry (`svg-path-commander/util`).

## JSR

```sh
deno add jsr:@thednp/svg-path-commander
```

or

```sh
npx jsr add @thednp/svg-path-commander
```

or import the raw TypeScript source directly:

```ts
import SVGPathCommander from "jsr:@thednp/svg-path-commander";
```

The static-methods entry is available as `jsr:@thednp/svg-path-commander/util`.

## CDN

**SVGPathCommander** can be used directly from a CDN, find it on [jsDelivr](https://www.jsdelivr.com/package/npm/svg-path-commander).

Version 2.2.0+:

```html
<script src="https://cdn.jsdelivr.net/npm/svg-path-commander/dist/index.min.js"></script>
```

Versions before 2.2.0:

```html
<script src="https://cdn.jsdelivr.net/npm/svg-path-commander/dist/svg-path-commander.js"></script>
```

The UMD bundle exposes the library as the global `SVGPathCommander`.
