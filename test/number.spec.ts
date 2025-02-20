import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Number primitive", () => {
  it("should show numbers", () => {
    expect(show(123)).toEqual("123");
    expect(inspect(123)).toEqual(util.inspect(123));
    expect(inspect(123, { colors: true })).toEqual(util.inspect(123, { colors: true }));
    expect(show(-123)).toEqual("-123");
    expect(inspect(-123)).toEqual(util.inspect(-123));
    expect(inspect(-123, { colors: true })).toEqual(util.inspect(-123, { colors: true }));
    expect(show(123.456)).toEqual("123.456");
    expect(inspect(123.456)).toEqual(util.inspect(123.456));
    expect(show(-123.456)).toEqual("-123.456");
    expect(show(-123.456)).toEqual("-123.456");
    expect(inspect(-123.456)).toEqual(util.inspect(-123.456));
    expect(inspect(-123.456, { colors: true })).toEqual(util.inspect(-123.456, { colors: true }));
    expect(show(0)).toEqual("0");
    expect(inspect(0)).toEqual(util.inspect(0));
    expect(inspect(0, { colors: true })).toEqual(util.inspect(0, { colors: true }));
    expect(show(-0)).toEqual("-0");
    expect(inspect(-0)).toEqual(util.inspect(-0));
    expect(inspect(-0, { colors: true })).toEqual(util.inspect(-0, { colors: true }));
    expect(show(NaN)).toEqual("NaN");
    expect(inspect(NaN)).toEqual(util.inspect(NaN));
    expect(inspect(NaN, { colors: true })).toEqual(util.inspect(NaN, { colors: true }));
    expect(show(Infinity)).toEqual("Infinity");
    expect(inspect(Infinity)).toEqual(util.inspect(Infinity));
    expect(inspect(Infinity, { colors: true })).toEqual(util.inspect(Infinity, { colors: true }));
    expect(show(-Infinity)).toEqual("-Infinity");
    expect(inspect(-Infinity)).toEqual(util.inspect(-Infinity));
    expect(inspect(-Infinity, { colors: true })).toEqual(util.inspect(-Infinity, { colors: true }));
  });

  it('should add numeric separators if `numericSeparator` is not `"none"`', () => {
    expect(show(1000, { numericSeparator: "none" })).toEqual("1000");
    expect(inspect(1000, { numericSeparator: "none" })).toEqual(util.inspect(1000));
    expect(inspect(1000, { numericSeparator: "none", colors: true })).toEqual(
      util.inspect(1000, { colors: true }),
    );
    expect(show(0, { numericSeparator: "," })).toEqual("0");
    expect(show(-0, { numericSeparator: "," })).toEqual("-0");
    expect(show(123, { numericSeparator: "," })).toEqual("123");
    expect(show(-123, { numericSeparator: "," })).toEqual("-123");
    expect(show(1000, { numericSeparator: "," })).toEqual("1,000");
    expect(show(12345, { numericSeparator: "_" })).toEqual("12_345");
    expect(inspect(12345, { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(12345, { numericSeparator: true, colors: true }),
    );
    expect(show(12345678910, { numericSeparator: "_" })).toEqual("12_345_678_910");
    expect(inspect(12345678910, { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(12345678910, { numericSeparator: true, colors: true }),
    );
    expect(show(12345.12345, { numericSeparator: "_" })).toEqual("12_345.123_45");
    expect(inspect(12345.12345, { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(12345.12345, { numericSeparator: true, colors: true }),
    );
    expect(show(-12345.1234, { numericSeparator: "_" })).toEqual("-12_345.123_4");
    expect(inspect(-12345.1234, { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(-12345.1234, { numericSeparator: true, colors: true }),
    );
    expect(show(12345678910.1234, { numericSeparator: "_" })).toEqual("12_345_678_910.123_4");
    expect(inspect(12345678910.1234, { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(12345678910.1234, { numericSeparator: true, colors: true }),
    );
  });
});

describe("Wrapper object for numbers", () => {
  it("should show numbers", () => {
    expect(show(new Number(123))).toEqual("[Number: 123]");
    expect(inspect(new Number(123))).toEqual(util.inspect(new Number(123)));
    expect(inspect(new Number(123), { colors: true })).toEqual(
      util.inspect(new Number(123), { colors: true }),
    );
    expect(show(new Number(-123))).toEqual("[Number: -123]");
    expect(inspect(new Number(-123))).toEqual(util.inspect(new Number(-123)));
    expect(inspect(new Number(-123), { colors: true })).toEqual(
      util.inspect(new Number(-123), { colors: true }),
    );
    expect(show(new Number(123.456))).toEqual("[Number: 123.456]");
    expect(inspect(new Number(123.456))).toEqual(util.inspect(new Number(123.456)));
    expect(inspect(new Number(123.456), { colors: true })).toEqual(
      util.inspect(new Number(123.456), { colors: true }),
    );
    expect(show(new Number(-123.456))).toEqual("[Number: -123.456]");
    expect(inspect(new Number(-123.456))).toEqual(util.inspect(new Number(-123.456)));
    expect(inspect(new Number(-123.456), { colors: true })).toEqual(
      util.inspect(new Number(-123.456), { colors: true }),
    );
    expect(show(new Number(0))).toEqual("[Number: 0]");
    expect(inspect(new Number(0))).toEqual(util.inspect(new Number(0)));
    expect(inspect(new Number(0), { colors: true })).toEqual(
      util.inspect(new Number(0), { colors: true }),
    );
    expect(show(new Number(-0))).toEqual("[Number: -0]");
    expect(inspect(new Number(-0))).toEqual(util.inspect(new Number(-0)));
    expect(inspect(new Number(-0), { colors: true })).toEqual(
      util.inspect(new Number(-0), { colors: true }),
    );
    expect(show(new Number(NaN))).toEqual("[Number: NaN]");
    expect(inspect(new Number(NaN))).toEqual(util.inspect(new Number(NaN)));
    expect(inspect(new Number(NaN), { colors: true })).toEqual(
      util.inspect(new Number(NaN), { colors: true }),
    );
    expect(show(new Number(Infinity))).toEqual("[Number: Infinity]");
    expect(inspect(new Number(Infinity))).toEqual(util.inspect(new Number(Infinity)));
    expect(inspect(new Number(Infinity), { colors: true })).toEqual(
      util.inspect(new Number(Infinity), { colors: true }),
    );
    expect(show(new Number(-Infinity))).toEqual("[Number: -Infinity]");
    expect(inspect(new Number(-Infinity))).toEqual(util.inspect(new Number(-Infinity)));
    expect(inspect(new Number(-Infinity), { colors: true })).toEqual(
      util.inspect(new Number(-Infinity), { colors: true }),
    );
  });

  it('should add numeric separators if `numericSeparator` is not `"none"`', () => {
    expect(show(new Number(1000), { numericSeparator: "none" })).toEqual("[Number: 1000]");
    expect(inspect(new Number(1000), { numericSeparator: "none" })).toEqual(
      util.inspect(new Number(1000)),
    );
    expect(inspect(new Number(1000), { numericSeparator: "none", colors: true })).toEqual(
      util.inspect(new Number(1000), { colors: true }),
    );
    expect(show(new Number(0), { numericSeparator: "," })).toEqual("[Number: 0]");
    expect(show(new Number(-0), { numericSeparator: "," })).toEqual("[Number: -0]");
    expect(show(new Number(123), { numericSeparator: "," })).toEqual("[Number: 123]");
    expect(show(new Number(-123), { numericSeparator: "," })).toEqual("[Number: -123]");
    expect(show(new Number(1000), { numericSeparator: "," })).toEqual("[Number: 1,000]");
    expect(show(new Number(12345), { numericSeparator: "_" })).toEqual("[Number: 12_345]");
    expect(inspect(new Number(12345), { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(new Number(12345), { numericSeparator: true, colors: true }),
    );
    expect(show(new Number(12345678910), { numericSeparator: "_" })).toEqual(
      "[Number: 12_345_678_910]",
    );
    expect(inspect(new Number(12345678910), { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(new Number(12345678910), { numericSeparator: true, colors: true }),
    );
    expect(show(new Number(12345.12345), { numericSeparator: "_" })).toEqual(
      "[Number: 12_345.123_45]",
    );
    expect(inspect(new Number(12345.12345), { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(new Number(12345.12345), { numericSeparator: true, colors: true }),
    );
    expect(show(new Number(-12345.1234), { numericSeparator: "_" })).toEqual(
      "[Number: -12_345.123_4]",
    );
    expect(inspect(new Number(-12345.1234), { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(new Number(-12345.1234), { numericSeparator: true, colors: true }),
    );
    expect(show(new Number(12345678910.1234), { numericSeparator: "_" })).toEqual(
      "[Number: 12_345_678_910.123_4]",
    );
    expect(inspect(new Number(12345678910.1234), { numericSeparator: "_", colors: true })).toEqual(
      util.inspect(new Number(12345678910.1234), { numericSeparator: true, colors: true }),
    );
  });

  it("should show subclass of `Number`", () => {
    class MyNumber extends Number {
      constructor(...args: any[]) {
        super(...args);
      }
    }

    expect(show(new MyNumber(42))).toEqual("[Number (MyNumber): 42]");
    expect(inspect(new MyNumber(42))).toEqual(util.inspect(new MyNumber(42)));
    expect(inspect(new MyNumber(42), { colors: true })).toEqual(
      util.inspect(new MyNumber(42), { colors: true }),
    );
  });
});
