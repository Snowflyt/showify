import * as util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Module", () => {
  it("should show modules", () => {
    let mod = Object.defineProperty(Object.create(null), Symbol.toStringTag, {
      value: "Module",
      configurable: false,
      enumerable: false,
      writable: false,
    });
    expect(show(mod)).toEqual("[Module: null prototype] {}");

    mod = Object.defineProperty({}, Symbol.toStringTag, {
      value: "Module",
      configurable: false,
      enumerable: false,
      writable: false,
    });
    expect(show(mod)).toEqual("[Module] {}");
  });

  it("should produce the same output as `util.inspect`", () => {
    expect(inspect(util, { breakLength: Infinity })).toEqual(
      util.inspect(util, { breakLength: Infinity }),
    );
    expect(inspect(util, { colors: true, breakLength: Infinity })).toEqual(
      util.inspect(util, { colors: true, breakLength: Infinity }),
    );
    expect(inspect(util, { colors: true, breakLength: Infinity, depth: Infinity })).toEqual(
      util.inspect(util, { colors: true, breakLength: Infinity, depth: Infinity }),
    );
  });
});
