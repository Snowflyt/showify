import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("WeakMap", () => {
  it("should show WeakMap items", () => {
    const map = new WeakMap();

    expect(show(map)).toEqual("WeakMap { <items unknown> }");
    expect(inspect(map)).toEqual(util.inspect(map));
  });

  it("should show WeakMap with additional properties", () => {
    const mapWithProps = Object.assign(new WeakMap(), {
      foo: "bar",
      nested: { value: true },
    });

    expect(show(mapWithProps)).toEqual(
      'WeakMap { <items unknown>, foo: "bar", nested: { value: true } }',
    );
    expect(inspect(mapWithProps)).toEqual(util.inspect(mapWithProps));
  });

  it("should show WeakMap with `Symbol.toStringTag`", () => {
    const taggedWeakMap = Object.defineProperty(new WeakMap(), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedWeakMap)).toEqual("WeakMap [MyTag] { <items unknown> }");
    expect(inspect(taggedWeakMap)).toEqual(util.inspect(taggedWeakMap));
  });

  it("should show subclass of WeakMap", () => {
    class MyWeakMap extends WeakMap {}
    const myWeakMap = new MyWeakMap();
    expect(show(myWeakMap)).toEqual("MyWeakMap { <items unknown> }");
    expect(inspect(myWeakMap)).toEqual(util.inspect(myWeakMap));
  });
});

describe("WeakSet", () => {
  it("should show WeakSet items", () => {
    const set = new WeakSet();

    expect(show(set)).toEqual("WeakSet { <items unknown> }");
    expect(inspect(set)).toEqual(util.inspect(set));
  });

  it("should show WeakSet with additional properties", () => {
    const setWithProps = Object.assign(new WeakSet(), {
      foo: "bar",
      nested: { value: true },
    });

    expect(show(setWithProps)).toEqual(
      'WeakSet { <items unknown>, foo: "bar", nested: { value: true } }',
    );
    expect(inspect(setWithProps)).toEqual(util.inspect(setWithProps));
  });

  it("should show WeakSet with `Symbol.toStringTag`", () => {
    const taggedWeakSet = Object.defineProperty(new WeakSet(), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedWeakSet)).toEqual("WeakSet [MyTag] { <items unknown> }");
    expect(inspect(taggedWeakSet)).toEqual(util.inspect(taggedWeakSet));
  });

  it("should show subclass of WeakSet", () => {
    class MyWeakSet extends WeakSet {}
    const myWeakSet = new MyWeakSet();
    expect(show(myWeakSet)).toEqual("MyWeakSet { <items unknown> }");
    expect(inspect(myWeakSet)).toEqual(util.inspect(myWeakSet));
  });
});
