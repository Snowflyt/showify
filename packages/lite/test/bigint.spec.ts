import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("BigInt primitive", () => {
  it("should show bigints", () => {
    expect(show(123n)).toEqual("123n");
    expect(inspect(123n)).toEqual(util.inspect(123n));
    expect(show(-123n)).toEqual("-123n");
    expect(inspect(-123n)).toEqual(util.inspect(-123n));
    expect(show(0n)).toEqual("0n");
    expect(inspect(0n)).toEqual(util.inspect(0n));
    expect(show(-0n)).toEqual("0n");
    expect(inspect(-0n)).toEqual(util.inspect(-0n));
  });

  it('should add numeric separators if `numericSeparator` is not `"none"`', () => {
    expect(show(1000n, { numericSeparator: "none" })).toEqual("1000n");
    expect(inspect(1000n, { numericSeparator: "none" })).toEqual(util.inspect(1000n));
    expect(show(0n, { numericSeparator: "," })).toEqual("0n");
    expect(show(123n, { numericSeparator: "," })).toEqual("123n");
    expect(show(-123n, { numericSeparator: "," })).toEqual("-123n");
    expect(show(1000n, { numericSeparator: "," })).toEqual("1,000n");
    expect(show(12345n, { numericSeparator: "_" })).toEqual("12_345n");
    expect(show(-12_345_678_910n, { numericSeparator: "_" })).toEqual("-12_345_678_910n");
  });
});

describe("Wrapper object for bigints", () => {
  it("should show bigints", () => {
    expect(show(Object(123n))).toEqual("[BigInt: 123n]");
    expect(inspect(Object(123n))).toEqual(util.inspect(Object(123n)));
    expect(show(Object(-123n))).toEqual("[BigInt: -123n]");
    expect(inspect(Object(-123n))).toEqual(util.inspect(Object(-123n)));
    expect(show(Object(0n))).toEqual("[BigInt: 0n]");
    expect(inspect(Object(0n))).toEqual(util.inspect(Object(0n)));
    expect(show(Object(-0n))).toEqual("[BigInt: 0n]");
    expect(inspect(Object(-0n))).toEqual(util.inspect(Object(-0n)));
  });

  it('should add numeric separators if `numericSeparator` is not `"none"`', () => {
    expect(show(Object(1000n), { numericSeparator: "none" })).toEqual("[BigInt: 1000n]");
    expect(inspect(Object(1000n), { numericSeparator: "none" })).toEqual(
      util.inspect(Object(1000n)),
    );
    expect(show(Object(0n), { numericSeparator: "," })).toEqual("[BigInt: 0n]");
    expect(show(Object(-0n), { numericSeparator: "," })).toEqual("[BigInt: 0n]");
    expect(show(Object(123n), { numericSeparator: "," })).toEqual("[BigInt: 123n]");
    expect(show(Object(-123n), { numericSeparator: "," })).toEqual("[BigInt: -123n]");
    expect(show(Object(1000n), { numericSeparator: "," })).toEqual("[BigInt: 1,000n]");
    expect(show(Object(12345n), { numericSeparator: "_" })).toEqual("[BigInt: 12_345n]");
    expect(show(Object(-12_345_678_910n), { numericSeparator: "_" })).toEqual(
      "[BigInt: -12_345_678_910n]",
    );
  });
});
