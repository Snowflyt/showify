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

describe("undefined", () => {
  it("should show `undefined`", () => {
    expect(show(undefined)).toEqual("undefined");
    expect(inspect(undefined)).toEqual(util.inspect(undefined));
  });
});
