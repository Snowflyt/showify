import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Symbol primitive", () => {
  it("should show symbols", () => {
    expect(show(Symbol("foo"))).toEqual("Symbol(foo)");
    expect(show(Symbol("foo bar"))).toEqual("Symbol(foo bar)");
    expect(show(Symbol("Hello,\nworld!"))).toEqual("Symbol(Hello,\nworld!)");
    expect(inspect(Symbol("foo bar"))).toEqual(util.inspect(Symbol("foo bar")));
  });
});

describe("Wrapper object for symbols", () => {
  it("should show symbols", () => {
    expect(show(Object(Symbol("foo")))).toEqual("[Symbol: Symbol(foo)]");
    expect(show(Object(Symbol("foo bar")))).toEqual("[Symbol: Symbol(foo bar)]");
    expect(show(Object(Symbol("Hello,\nworld!")))).toEqual("[Symbol: Symbol(Hello,\nworld!)]");
    expect(inspect(Object(Symbol("foo bar")))).toEqual(util.inspect(Object(Symbol("foo bar"))));
  });
});
