import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("undefined", () => {
  it("should show `undefined`", () => {
    expect(show(undefined)).toEqual("undefined");
    expect(inspect(undefined)).toEqual(util.inspect(undefined));
    expect(inspect(undefined, { colors: true })).toEqual(util.inspect(undefined, { colors: true }));
  });
});
