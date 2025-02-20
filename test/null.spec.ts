import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("null", () => {
  it("should show `null`", () => {
    expect(show(null)).toEqual("null");
    expect(inspect(null)).toEqual(util.inspect(null));
    expect(inspect(null, { colors: true })).toEqual(util.inspect(null, { colors: true }));
  });
});
