import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Date", () => {
  it("should show dates", () => {
    const date = new Date("2025-01-01T00:00:00.000Z");

    expect(show(date)).toEqual("2025-01-01T00:00:00.000Z");
    expect(inspect(date)).toEqual(util.inspect(date));
    expect(inspect(date, { colors: true })).toEqual(util.inspect(date, { colors: true }));
  });

  it("should show invalid dates", () => {
    const date = new Date("foo");

    expect(show(date)).toEqual("Invalid Date");
    expect(inspect(date)).toEqual(util.inspect(date));
    expect(inspect(date, { colors: true })).toEqual(util.inspect(date, { colors: true }));
  });

  it("should show subclass of `Date`", () => {
    class MyDate extends Date {
      constructor(value: string | number | Date) {
        super(value);
      }
    }
    const date = new MyDate("2025-01-01T00:00:00.000Z");

    expect(show(date)).toEqual("MyDate 2025-01-01T00:00:00.000Z");
    expect(inspect(date)).toEqual(util.inspect(date));
    expect(inspect(date, { colors: true })).toEqual(util.inspect(date, { colors: true }));
  });

  it("should show `Symbol.toStringTag`", () => {
    const dateWithSameTag = Object.defineProperty(
      new Date("2025-01-01T00:00:00.000Z"),
      Symbol.toStringTag,
      { value: "Date" },
    );
    const dateWithDifferentTag = Object.defineProperty(
      new Date("2025-01-01T00:00:00.000Z"),
      Symbol.toStringTag,
      { value: "Date1" },
    );

    expect(show(dateWithSameTag)).toEqual("2025-01-01T00:00:00.000Z");
    expect(inspect(dateWithSameTag)).toEqual(util.inspect(dateWithSameTag));
    expect(inspect(dateWithSameTag, { colors: true })).toEqual(
      util.inspect(dateWithSameTag, { colors: true }),
    );
    expect(show(dateWithDifferentTag)).toEqual("Date [Date1] 2025-01-01T00:00:00.000Z");
    expect(inspect(dateWithDifferentTag)).toEqual(util.inspect(dateWithDifferentTag));
    expect(inspect(dateWithDifferentTag, { colors: true })).toEqual(
      util.inspect(dateWithDifferentTag, { colors: true }),
    );

    class MyDate extends Date {
      constructor(...args: ConstructorParameters<DateConstructor>) {
        super(...args);
      }

      get [Symbol.toStringTag]() {
        return "MyDate1";
      }
    }
    const myDateWithSameTag = Object.defineProperty(
      new MyDate("2025-01-01T00:00:00.000Z"),
      Symbol.toStringTag,
      { value: "MyDate" },
    );
    const myDateWithDifferentTag = new MyDate("2025-01-01T00:00:00.000Z");

    expect(show(myDateWithSameTag)).toEqual("MyDate 2025-01-01T00:00:00.000Z");
    expect(inspect(myDateWithSameTag)).toEqual(util.inspect(myDateWithSameTag));
    expect(inspect(myDateWithSameTag, { colors: true })).toEqual(
      util.inspect(myDateWithSameTag, { colors: true }),
    );
    expect(show(myDateWithDifferentTag)).toEqual("MyDate [MyDate1] 2025-01-01T00:00:00.000Z");
    expect(inspect(myDateWithDifferentTag)).toEqual(util.inspect(myDateWithDifferentTag));
    expect(inspect(myDateWithDifferentTag, { colors: true })).toEqual(
      util.inspect(myDateWithDifferentTag, { colors: true }),
    );
  });
});
