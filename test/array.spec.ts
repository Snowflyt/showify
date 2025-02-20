/* eslint-disable no-sparse-arrays */

import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect, trimIndent } from "./test-utils";

describe("Array", () => {
  it("should show simple arrays", () => {
    expect(show([])).toEqual("[]");
    expect(inspect([])).toEqual(util.inspect([]));
    expect(show([1, 2, 3])).toEqual("[1, 2, 3]");
    expect(inspect([1, 2, 3])).toEqual(util.inspect([1, 2, 3]));
    expect(show([1, 2, { foo: 42n }, "bar"])).toEqual('[1, 2, { foo: 42n }, "bar"]');
    expect(inspect([1, 2, { foo: 42n }, "bar"])).toEqual(util.inspect([1, 2, { foo: 42n }, "bar"]));
    expect(show([1, [true, 3, ["foo", 5]]])).toEqual('[1, [true, 3, ["foo", 5]]]');
    expect(inspect([1, [true, 3, ["foo", 5]]])).toEqual(util.inspect([1, [true, 3, ["foo", 5]]]));
  });

  it("should show arrays with empty slots", () => {
    expect(show([1, , 3])).toEqual("[1, <1 empty item>, 3]");
    expect(inspect([1, , 3])).toEqual(util.inspect([1, , 3]));
    expect(inspect([1, , 3], { colors: true })).toEqual(util.inspect([1, , 3], { colors: true }));
    expect(show([1, , 3, , , 6])).toEqual("[1, <1 empty item>, 3, <2 empty items>, 6]");
    expect(inspect([1, , 3, , , 6])).toEqual(util.inspect([1, , 3, , , 6]));
    expect(inspect([1, , 3, , , 6], { colors: true })).toEqual(
      util.inspect([1, , 3, , , 6], { colors: true }),
    );
  });

  it("should show arrays with brackets spacing if `arrayBracketSpacing` is `true`", () => {
    expect(show([1, 2, 3], { arrayBracketSpacing: true })).toEqual("[ 1, 2, 3 ]");
    expect(show([1, 2, { foo: 42n }, "bar"], { arrayBracketSpacing: true })).toEqual(
      '[ 1, 2, { foo: 42n }, "bar" ]',
    );
    expect(show([1, [true, 3, ["foo", 5]]], { arrayBracketSpacing: true })).toEqual(
      '[ 1, [ true, 3, [ "foo", 5 ] ] ]',
    );
  });

  it("should show arrays with breaks if needed", () => {
    expect(show([], { indent: 2, breakLength: 1 })).toEqual("[]");
    expect(inspect([], { breakLength: 1 })).toEqual(util.inspect([], { breakLength: 1 }));
    expect(show([1, 2, 3], { indent: 2, breakLength: 16 })).toEqual("[1, 2, 3]");
    expect(show([1, 2, { foo: 42n }, "bar"], { indent: 2, breakLength: 16 })).toEqual(
      trimIndent(`
        [
          1,
          2,
          { foo: 42n },
          "bar"
        ]
      `),
    );
    expect(show([1, 2, { foo: 1919n }, "bar"], { indent: 2, breakLength: 16 })).toEqual(
      trimIndent(`
        [
          1,
          2,
          {
            foo: 1919n
          },
          "bar"
        ]
      `),
    );
    expect(inspect([1, 2, { foo: 1919n }, "bar"], { breakLength: 16 })).toEqual(
      util.inspect([1, 2, { foo: 1919n }, "bar"], { breakLength: 16 }),
    );
    expect(show([1, [true, 3, ["foo", 5]]], { indent: 2, breakLength: 16 })).toEqual(
      trimIndent(`
        [
          1,
          [
            true,
            3,
            ["foo", 5]
          ]
        ]
      `),
    );
    expect(
      show([1, [true, 3, ["foo", 5]]], { indent: 2, breakLength: 16, arrayBracketSpacing: true }),
    ).toEqual(
      trimIndent(`
        [
          1,
          [
            true,
            3,
            [ "foo", 5 ]
          ]
        ]
      `),
    );
  });

  it("should truncate long arrays if `maxArrayLength` is set", () => {
    expect(show([1, 2, 3, 4], { maxArrayLength: 4 })).toEqual("[1, 2, 3, 4]");
    expect(inspect([1, 2, 3, 4], { maxArrayLength: 4 })).toEqual(
      util.inspect([1, 2, 3, 4], { maxArrayLength: 4 }),
    );
    expect(show([1, 2, 3, 4, 5], { maxArrayLength: 4 })).toEqual("[1, 2, 3, 4, ... 1 more item]");
    expect(
      show([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], { maxArrayLength: 10, indent: 2, breakLength: 16 }),
    ).toEqual(
      trimIndent(`
        [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          ... 1 more item
        ]
      `),
    );
    expect(
      show([1, 2, 3, 4, 5, 6, [7, "foo"], 8, 9, 10, 11, 12], {
        maxArrayLength: 10,
        indent: 2,
        breakLength: 16,
      }),
    ).toEqual(
      trimIndent(`
        [
          1,
          2,
          3,
          4,
          5,
          6,
          [7, "foo"],
          8,
          9,
          10,
          ... 2 more items
        ]
      `),
    );
    expect(
      show([1, 2, [3, "foo", "bar", "baz"], 4, 5, 6], {
        maxArrayLength: 3,
        arrayBracketSpacing: true,
        indent: 2,
        breakLength: 40,
      }),
    ).toEqual(
      trimIndent(`
        [
          1,
          2,
          [ 3, "foo", "bar", ... 1 more item ],
          ... 3 more items
        ]
      `),
    );
  });

  it("should show subclass of `Array` with a `ClassName(size)` prefix", () => {
    class MyArray extends Array {
      constructor(...args: any[]) {
        super(...args);
      }
    }

    expect(show(new MyArray())).toEqual("MyArray(0) []");
    expect(inspect(new MyArray())).toEqual(util.inspect(new MyArray()));

    const arr = new MyArray(1, 2, { foo: "bar" });
    expect(show(arr)).toEqual('MyArray(3) [1, 2, { foo: "bar" }]');
    expect(show(arr, { arrayBracketSpacing: true })).toEqual('MyArray(3) [ 1, 2, { foo: "bar" } ]');
    expect(inspect(arr)).toEqual(util.inspect(arr));
    expect(show(arr, { maxArrayLength: 1 })).toEqual("MyArray(3) [1, ... 2 more items]");
    expect(inspect(arr, { maxArrayLength: 1 })).toEqual(util.inspect(arr, { maxArrayLength: 1 }));
    expect(show(arr, { indent: 2, breakLength: 16 })).toEqual(
      trimIndent(`
        MyArray(3) [
          1,
          2,
          { foo: "bar" }
        ]
      `),
    );
  });

  it("should show typed arrays with a `ClassName(size)` prefix", () => {
    expect(show(new Uint8Array())).toEqual("Uint8Array(0) []");
    expect(inspect(new Uint8Array())).toEqual(util.inspect(new Uint8Array()));

    const arr = new Uint8Array([1, 2, 3, 4, 5]);
    expect(show(arr)).toEqual("Uint8Array(5) [1, 2, 3, 4, 5]");
    expect(show(arr, { arrayBracketSpacing: true })).toEqual("Uint8Array(5) [ 1, 2, 3, 4, 5 ]");
    expect(inspect(arr)).toEqual(util.inspect(arr));
    expect(show(arr, { maxArrayLength: 4 })).toEqual("Uint8Array(5) [1, 2, 3, 4, ... 1 more item]");
    expect(inspect(arr, { maxArrayLength: 4 })).toEqual(util.inspect(arr, { maxArrayLength: 4 }));
    expect(show(arr, { indent: 2, breakLength: 16 })).toEqual(
      trimIndent(`
        Uint8Array(5) [
          1,
          2,
          3,
          4,
          5
        ]
      `),
    );
    expect(inspect(arr, { indent: 2, breakLength: 16 })).toEqual(
      util.inspect(arr, { breakLength: 16 }),
    );
  });

  it('should hide meta properties when `showHidden` is `"exclude-meta"`', () => {
    expect(show([1, 2, 3], { showHidden: "exclude-meta" })).toEqual("[1, 2, 3]");

    expect(show([1, 2, 3], { showHidden: "always" })).toEqual("[1, 2, 3, [length]: 3]");
    expect(inspect([1, 2, 3], { showHidden: "always" })).toEqual(
      util.inspect([1, 2, 3], { showHidden: true }),
    );
    expect(inspect([1, 2, 3], { showHidden: "always", colors: true })).toEqual(
      util.inspect([1, 2, 3], { showHidden: true, colors: true }),
    );
  });
});
