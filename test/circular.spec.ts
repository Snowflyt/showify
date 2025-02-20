import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect, trimIndent } from "./test-utils";

const circular: any = {};
circular.a = [circular, { foo: 42n, [Symbol("foo")]: true }];
circular.b = {};
circular.b.inner = circular.b;
circular.b.obj = circular;
circular.c = new Map([
  [{ bar: 43 }, "baz"],
  [circular, circular.b],
]);

describe("Circular reference", () => {
  it("should show circular reference with a pointer", () => {
    expect(show(circular, { indent: 2 })).toEqual(
      trimIndent(`
        <ref *1> {
          a: [[Circular *1], { foo: 42n, [Symbol(foo)]: true }],
          b: <ref *2> { inner: [Circular *2], obj: [Circular *1] },
          c: Map(2) {
            { bar: 43 } => "baz",
            [Circular *1] => <ref *2> { inner: [Circular *2], obj: [Circular *1] }
          }
        }
      `),
    );
    expect(show(circular, { indent: 2, trailingComma: "auto" })).toEqual(
      trimIndent(`
        <ref *1> {
          a: [[Circular *1], { foo: 42n, [Symbol(foo)]: true }],
          b: <ref *2> { inner: [Circular *2], obj: [Circular *1] },
          c: Map(2) {
            { bar: 43 } => "baz",
            [Circular *1] => <ref *2> { inner: [Circular *2], obj: [Circular *1] },
          },
        }
      `),
    );
    expect(inspect(circular, { colors: true })).toEqual(util.inspect(circular, { colors: true }));
  });

  it("should not show reference pointer if `reference` is `false`", () => {
    expect(show(circular, { indent: 2, referencePointer: false, trailingComma: "always" })).toEqual(
      trimIndent(`
        {
          a: [[Circular], { foo: 42n, [Symbol(foo)]: true, },],
          b: { inner: [Circular], obj: [Circular], },
          c: Map(2) {
            { bar: 43, } => "baz",
            [Circular] => { inner: [Circular], obj: [Circular], },
          },
        }
      `),
    );
  });
});
