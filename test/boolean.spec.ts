import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Boolean primitive", () => {
  it("should show booleans", () => {
    expect(show(true)).toEqual("true");
    expect(show(false)).toEqual("false");
    expect(inspect(true)).toEqual(util.inspect(true));
    expect(inspect(true, { colors: true })).toEqual(util.inspect(true, { colors: true }));
    expect(inspect(false)).toEqual(util.inspect(false));
    expect(inspect(false, { colors: true })).toEqual(util.inspect(false, { colors: true }));
  });
});

describe("Wrapper object for booleans", () => {
  it("should show booleans", () => {
    expect(show(new Boolean(true))).toEqual("[Boolean: true]");
    expect(show(new Boolean(false))).toEqual("[Boolean: false]");
    expect(inspect(new Boolean(true))).toEqual(util.inspect(new Boolean(true)));
    expect(inspect(new Boolean(true), { colors: true })).toEqual(
      util.inspect(new Boolean(true), { colors: true }),
    );
    expect(inspect(new Boolean(false))).toEqual(util.inspect(new Boolean(false)));
    expect(inspect(new Boolean(false), { colors: true })).toEqual(
      util.inspect(new Boolean(false), { colors: true }),
    );
  });

  it("should show subclass of `Boolean`", () => {
    class MyBoolean extends Boolean {
      constructor(...args: any[]) {
        super(...args);
      }
    }

    expect(show(new MyBoolean(true))).toEqual("[Boolean (MyBoolean): true]");
    expect(inspect(new MyBoolean(true))).toEqual(util.inspect(new MyBoolean(true)));
    expect(inspect(new MyBoolean(true), { colors: true })).toEqual(
      util.inspect(new MyBoolean(true), { colors: true }),
    );
    expect(show(new MyBoolean(false))).toEqual("[Boolean (MyBoolean): false]");
    expect(inspect(new MyBoolean(false))).toEqual(util.inspect(new MyBoolean(false)));
    expect(inspect(new MyBoolean(false), { colors: true })).toEqual(
      util.inspect(new MyBoolean(false), { colors: true }),
    );
  });
});
