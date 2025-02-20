# @showify/lite

<p align="left">
  <a href="https://www.npmjs.com/package/@showify/lite">
    <img src="https://img.shields.io/npm/dm/@showify/lite.svg" alt="downloads" height="18">
  </a>
  <a href="https://www.npmjs.com/package/@showify/lite">
    <img src="https://img.shields.io/npm/v/@showify/lite.svg" alt="npm version" height="18">
  </a>
  <a href="https://bundlephobia.com/package/@showify/lite">
    <img src="https://img.shields.io/bundlephobia/minzip/@showify/lite.svg" alt="minzipped size" height="18">
  </a>
  <a href="https://github.com/Snowflyt/@showify/lite">
    <img src="https://img.shields.io/npm/l/@showify/lite.svg" alt="MPL 2.0 license" height="18">
  </a>
</p>

A lightweight (and faster) implementation of the [showify](https://github.com/Snowflyt/showify) package under 3kB of minified+gzipped code.

The following features are removed from the original package:

- ANSI color support.
- `quoteStyle` is limited to `"single"` or `"double"`.
- The `showHidden: "exclude-meta"` option for `show()`.
- Special support for `ArrayBuffer` and `DataView`.
