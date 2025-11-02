import util from "node:util";

import { type } from "arktype";
import _objectInspect from "object-inspect";
import { format } from "pretty-format";
import _stringifyObject from "stringify-object";
import { bench, describe } from "vitest";

import { inspect } from "../test/test-utils";

// pretty-format is almost as fast as util.inspect,
// but it handles very limited scenarios compared to showify / util.inspect
// e.g., it omits properties in functions, does not care array empty slots,
// does not distinguish between functions and classes, does not support auto wrapping, etc.,
// making it only suitable for snapshot testing like in Jest
function prettyFormat(value: unknown) {
  return format(value, {
    maxDepth: 3, // Equals to 2 in our inspect / util.inspect
    indent: 2,
    printBasicPrototype: false,
  });
}

// object-inspect is significantly slower than util.inspect and showify,
// and does not support many features and edge cases they do
function objectInspect(value: unknown) {
  return _objectInspect(value, {
    depth: 3, // Equals to 2 in our inspect / util.inspect
    indent: 2,
    quoteStyle: "single",
    maxStringLength: 10000,
  });
}

// stringify-object supports very limited scenarios similar to pretty-format,
// with surprisingly worse performance than object-inspect
// I'm not sure why it is so slow given its simple implementation
function stringifyObject(value: unknown) {
  return _stringifyObject(value, {
    indent: "  ",
    singleQuotes: true,
  });
}

// showify is around 15x slower than util.inspect for small objects,
// 10x slower for large objects, and 3-5x slower for huge objects

describe("inspect small objects", () => {
  const obj = { foo: { bar: { baz: { qux: 42 } } } };

  bench("util.inspect", () => void util.inspect(obj));
  bench("showify", () => void inspect(obj));
  bench("pretty-format", () => void prettyFormat(obj));
  bench("object-inspect", () => void objectInspect(obj));
  bench("stringify-object", () => void stringifyObject(obj));
});

describe("inspect large objects", () => {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < 1000; i++)
    obj[`key${i}`] = {
      nested: {
        value: i,
        array: Array.from({ length: 10 }, (_, j) => j + i),
      },
    };

  bench("util.inspect", () => void util.inspect(obj));
  bench("showify", () => void inspect(obj));
  bench("pretty-format", () => void prettyFormat(obj));
  bench("object-inspect", () => void objectInspect(obj));
  bench("stringify-object", () => void stringifyObject(obj));
});

describe("inspect huge objects", () => {
  bench("util.inspect", () => void util.inspect(type));
  bench("showify", () => void inspect(type));
  // pretty-format omit properties in functions, so we copy the object to a plain object
  bench("pretty-format", () => void prettyFormat({ ...type }));
  bench("object-inspect", () => void objectInspect(type));
  // stringify-object omit properties in functions, so we copy the object to a plain object
  bench("stringify-object", () => void stringifyObject({ ...type }));
});

describe("inspect huge² objects", () => {
  const scope = type("string").$;

  bench("util.inspect", () => void util.inspect(scope));
  bench("showify", () => void inspect(scope));
  bench("pretty-format", () => void prettyFormat(scope));
  bench("object-inspect", () => void objectInspect(scope));
  bench("stringify-object", () => void stringifyObject(scope));
});
