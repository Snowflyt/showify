/*!
 * Copyright (c) 2026 Ge Gao (Snowflyt) and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from "vitest";

import { show } from "../src";

describe("Promise", () => {
  it("should show promise state", () => {
    const promise = new Promise(() => {});

    expect(show(promise)).toEqual("Promise { <state unknown> }");
  });

  it("should show promise with additional properties", () => {
    const promiseWithProps = Object.assign(new Promise(() => {}), {
      foo: "bar",
      count: 42,
      nested: { value: true },
    });

    expect(show(promiseWithProps)).toEqual(
      'Promise { <state unknown>, foo: "bar", count: 42, nested: { value: true } }',
    );
  });

  it("should show promise with `Symbol.toStringTag`", () => {
    const taggedPromise = Object.defineProperty(new Promise(() => {}), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedPromise)).toEqual("Promise [MyTag] { <state unknown> }");
  });
});
