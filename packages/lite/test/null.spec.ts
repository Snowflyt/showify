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

describe("null", () => {
  it("should show `null`", () => {
    expect(show(null)).toEqual("null");
    expect(inspect(null)).toEqual(util.inspect(null));
  });
});
