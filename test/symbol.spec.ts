/*!
 * Copyright (c) 2026 Ge Gao (Snowflyt) and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
    expect(inspect(Symbol("foo bar"), { colors: true })).toEqual(
      util.inspect(Symbol("foo bar"), { colors: true }),
    );
  });
});

describe("Wrapper object for symbols", () => {
  it("should show symbols", () => {
    expect(show(Object(Symbol("foo")))).toEqual("[Symbol: Symbol(foo)]");
    expect(show(Object(Symbol("foo bar")))).toEqual("[Symbol: Symbol(foo bar)]");
    expect(show(Object(Symbol("Hello,\nworld!")))).toEqual("[Symbol: Symbol(Hello,\nworld!)]");
    expect(inspect(Object(Symbol("foo bar")))).toEqual(util.inspect(Object(Symbol("foo bar"))));
    expect(inspect(Object(Symbol("foo bar")), { colors: true })).toEqual(
      util.inspect(Object(Symbol("foo bar")), { colors: true }),
    );
  });
});
