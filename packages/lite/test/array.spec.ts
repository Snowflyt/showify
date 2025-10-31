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
    expect(show([1, , 3, , , 6])).toEqual("[1, <1 empty item>, 3, <2 empty items>, 6]");
    expect(inspect([1, , 3, , , 6])).toEqual(util.inspect([1, , 3, , , 6]));
    // Prefix empty slots
    expect(show([, 2, 3])).toEqual("[<1 empty item>, 2, 3]");
    expect(inspect([, 2, 3])).toEqual(util.inspect([, 2, 3]));
    expect(show([, , , 4, 5])).toEqual("[<3 empty items>, 4, 5]");
    expect(inspect([, , , 4, 5])).toEqual(util.inspect([, , , 4, 5]));
    // Trailing empty slots
    expect(show([1, 2, 3, ,])).toEqual("[1, 2, 3, <1 empty item>]");
    expect(inspect([1, 2, 3, ,])).toEqual(util.inspect([1, 2, 3, ,]));
    expect(show([1, 2, 3, , ,])).toEqual("[1, 2, 3, <2 empty items>]");
    expect(inspect([1, 2, 3, , ,])).toEqual(util.inspect([1, 2, 3, , ,]));
    expect(show([1, , ,])).toEqual("[1, <2 empty items>]");
    expect(inspect([1, , ,])).toEqual(util.inspect([1, , ,]));
    // Only empty slots
    expect(show([, , ,])).toEqual("[<3 empty items>]");
    expect(inspect([, , ,])).toEqual(util.inspect([, , ,]));
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
    expect(inspect([1, 2, 3, 4, 5], { maxArrayLength: 4 })).toEqual(
      util.inspect([1, 2, 3, 4, 5], { maxArrayLength: 4 }),
    );
    expect(
      show([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], { maxArrayLength: 10, indent: 2, breakLength: 18 }),
    ).toEqual(
      trimIndent(`
          [
            1,  2, 3, 4,
            5,  6, 7, 8,
            9, 10,
            ... 1 more item
          ]
        `),
    );
    expect(
      inspect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], {
        maxArrayLength: 10,
        breakLength: 18,
      }),
    ).toEqual(
      util.inspect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], {
        maxArrayLength: 10,
        breakLength: 18,
      }),
    );
    expect(
      show([1, 2, 3, 4, 5, 6, [7, "foo"], 8, 9, 10, 11, 12], {
        maxArrayLength: 10,
        indent: 2,
        breakLength: 18,
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
      inspect([1, 2, 3, 4, 5, 6, [7, "foo"], 8, 9, 10, 11, 12], {
        maxArrayLength: 10,
        breakLength: 40,
      }),
    ).toEqual(
      util.inspect([1, 2, 3, 4, 5, 6, [7, "foo"], 8, 9, 10, 11, 12], {
        maxArrayLength: 10,
        breakLength: 40,
      }),
    );
    expect(
      show([1, 2, [3, "foo", "bar", "baz"], 4, 5, 6], {
        maxArrayLength: 3,
        arrayBracketSpacing: true,
        indent: 2,
        breakLength: 50,
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
    expect(
      inspect([1, 2, [3, "foo", "bar", "baz"], 4, 5, 6], {
        maxArrayLength: 3,
        breakLength: 50,
      }),
    ).toEqual(
      util.inspect([1, 2, [3, "foo", "bar", "baz"], 4, 5, 6], {
        maxArrayLength: 3,
        breakLength: 50,
      }),
    );
  });

  it("should show subclass of `Array` with a `ClassName(size)` prefix", () => {
    class MyArray extends Array {
      // eslint-disable-next-line @typescript-eslint/no-useless-constructor
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

  it("should not group elements for short arrays", () => {
    const arr = Array.from({ length: 6 }, (_, i) => i + 1);

    expect(show(arr, { indent: 2 })).toEqual("[1, 2, 3, 4, 5, 6]");
    expect(inspect(arr)).toEqual(util.inspect(arr));

    expect(show(arr, { indent: 2, maxArrayLength: 4 })).toEqual("[1, 2, 3, 4, ... 2 more items]");
    expect(inspect(arr, { maxArrayLength: 4 })).toEqual(util.inspect(arr, { maxArrayLength: 4 }));

    expect(show(arr, { indent: 2, maxArrayLength: 5 })).toEqual("[1, 2, 3, 4, 5, ... 1 more item]");
    expect(inspect(arr, { maxArrayLength: 5 })).toEqual(util.inspect(arr, { maxArrayLength: 5 }));
  });

  it("should not group elements if huge gaps may occur", () => {
    const arr = [1, 2, 3, 4, "long string", 5, 6, 7, 8, 9, 10];

    expect(show(arr, { indent: 2, breakLength: 30 })).toEqual(
      trimIndent(`
          [
            1,
            2,
            3,
            4,
            "long string",
            5,
            6,
            7,
            8,
            9,
            10
          ]
        `),
    );
    expect(inspect(arr, { breakLength: 30 })).toEqual(util.inspect(arr, { breakLength: 30 }));

    expect(show(arr, { indent: 2, breakLength: 30, maxArrayLength: 8 })).toEqual(
      trimIndent(`
          [
            1,
            2,
            3,
            4,
            "long string",
            5,
            6,
            7,
            ... 3 more items
          ]
        `),
    );
    expect(inspect(arr, { breakLength: 30, maxArrayLength: 8 })).toEqual(
      util.inspect(arr, { breakLength: 30, maxArrayLength: 8 }),
    );
  });

  it("should group elements for arrays with many short elements", () => {
    let arr: unknown[] = Array.from({ length: 100 }, (_, i) => i + 1);

    expect(show(arr, { indent: 2 })).toEqual(
      trimIndent(`
          [
             1,  2,  3,   4,  5,  6,  7,  8,  9, 10, 11, 12,
            13, 14, 15,  16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27,  28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39,  40, 41, 42, 43, 44, 45, 46, 47, 48,
            49, 50, 51,  52, 53, 54, 55, 56, 57, 58, 59, 60,
            61, 62, 63,  64, 65, 66, 67, 68, 69, 70, 71, 72,
            73, 74, 75,  76, 77, 78, 79, 80, 81, 82, 83, 84,
            85, 86, 87,  88, 89, 90, 91, 92, 93, 94, 95, 96,
            97, 98, 99, 100
          ]
        `),
    );
    expect(inspect(arr)).toEqual(util.inspect(arr));

    expect(show(arr, { indent: 2, maxArrayLength: 60 })).toEqual(
      trimIndent(`
          [
             1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
            13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
            49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
            ... 40 more items
          ]
        `),
    );
    expect(inspect(arr, { maxArrayLength: 60 })).toEqual(util.inspect(arr, { maxArrayLength: 60 }));

    arr = Array.from({ length: 100 }, (_, i) => "s" + (i + 1));

    expect(show(arr, { indent: 2 })).toEqual(
      trimIndent(`
          [
            "s1",  "s2",  "s3",  "s4",   "s5",  "s6",  "s7",  "s8",
            "s9",  "s10", "s11", "s12",  "s13", "s14", "s15", "s16",
            "s17", "s18", "s19", "s20",  "s21", "s22", "s23", "s24",
            "s25", "s26", "s27", "s28",  "s29", "s30", "s31", "s32",
            "s33", "s34", "s35", "s36",  "s37", "s38", "s39", "s40",
            "s41", "s42", "s43", "s44",  "s45", "s46", "s47", "s48",
            "s49", "s50", "s51", "s52",  "s53", "s54", "s55", "s56",
            "s57", "s58", "s59", "s60",  "s61", "s62", "s63", "s64",
            "s65", "s66", "s67", "s68",  "s69", "s70", "s71", "s72",
            "s73", "s74", "s75", "s76",  "s77", "s78", "s79", "s80",
            "s81", "s82", "s83", "s84",  "s85", "s86", "s87", "s88",
            "s89", "s90", "s91", "s92",  "s93", "s94", "s95", "s96",
            "s97", "s98", "s99", "s100"
          ]
        `),
    );
    expect(inspect(arr)).toEqual(util.inspect(arr));

    expect(show(arr, { indent: 2, maxArrayLength: 90 })).toEqual(
      trimIndent(`
          [
            "s1",  "s2",  "s3",  "s4",  "s5",  "s6",  "s7",  "s8",
            "s9",  "s10", "s11", "s12", "s13", "s14", "s15", "s16",
            "s17", "s18", "s19", "s20", "s21", "s22", "s23", "s24",
            "s25", "s26", "s27", "s28", "s29", "s30", "s31", "s32",
            "s33", "s34", "s35", "s36", "s37", "s38", "s39", "s40",
            "s41", "s42", "s43", "s44", "s45", "s46", "s47", "s48",
            "s49", "s50", "s51", "s52", "s53", "s54", "s55", "s56",
            "s57", "s58", "s59", "s60", "s61", "s62", "s63", "s64",
            "s65", "s66", "s67", "s68", "s69", "s70", "s71", "s72",
            "s73", "s74", "s75", "s76", "s77", "s78", "s79", "s80",
            "s81", "s82", "s83", "s84", "s85", "s86", "s87", "s88",
            "s89", "s90",
            ... 10 more items
          ]
        `),
    );
    expect(inspect(arr, { maxArrayLength: 90 })).toEqual(util.inspect(arr, { maxArrayLength: 90 }));
  });
});
