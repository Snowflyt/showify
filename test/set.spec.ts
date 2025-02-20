import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Set", () => {
  it("should show empty set", () => {
    const set = new Set();

    expect(show(set)).toEqual("Set(0) {}");
    expect(inspect(set)).toEqual(util.inspect(set));
    expect(inspect(set, { colors: true })).toEqual(util.inspect(set, { colors: true }));
  });

  it("should show set with primitive values", () => {
    const set = new Set(["value", 42, true, Symbol("sym"), null, undefined]);

    expect(show(set)).toEqual('Set(6) { "value", 42, true, Symbol(sym), null, undefined }');
    expect(inspect(set)).toEqual(util.inspect(set));
    expect(inspect(set, { colors: true })).toEqual(util.inspect(set, { colors: true }));
  });

  it("should show set with object values", () => {
    const set = new Set([{}, [], new Date("2023-01-01"), new RegExp("test")]);

    expect(show(set)).toEqual("Set(4) { {}, [], 2023-01-01T00:00:00.000Z, /test/ }");
    expect(inspect(set)).toEqual(util.inspect(set));
    expect(inspect(set, { colors: true })).toEqual(util.inspect(set, { colors: true }));
  });

  it("should show set with `Symbol.toStringTag`", () => {
    const taggedSet = Object.defineProperty(new Set(["value"]), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedSet)).toEqual('Set(1) [MyTag] { "value" }');
    expect(inspect(taggedSet)).toEqual(util.inspect(taggedSet));
    expect(inspect(taggedSet, { colors: true })).toEqual(util.inspect(taggedSet, { colors: true }));
  });

  it("should sort set items when sorted is true", () => {
    const set = new Set(["c", "a", "b", false, true, Symbol(), Symbol()]);

    expect(show(set, { sorted: true })).toEqual(
      'Set(7) { "a", "b", "c", Symbol(), Symbol(), false, true }',
    );
    expect(inspect(set, { sorted: true })).toEqual(util.inspect(set, { sorted: true }));
    // NOTE: `util.inspect` just sort entries by their resulting string, so ANSI colors can
    // interfere with the order.
    expect(inspect(set, { sorted: true, colors: true })).toEqual(
      util.inspect(set, { sorted: true, colors: true }),
    );
  });

  it("should show circular references in set", () => {
    const set = new Set();
    const obj = { set };
    set.add(obj);

    expect(show(set)).toEqual("<ref *1> Set(1) { { set: [Circular *1] } }");
    expect(inspect(set)).toEqual(util.inspect(set));
    expect(inspect(set, { colors: true })).toEqual(util.inspect(set, { colors: true }));
  });
});
