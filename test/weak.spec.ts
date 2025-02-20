import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("WeakMap", () => {
  it("should show WeakMap items", () => {
    const map = new WeakMap();

    expect(show(map)).toEqual("WeakMap { <items unknown> }");
    expect(inspect(map)).toEqual(util.inspect(map));
    expect(inspect(map, { colors: true })).toEqual(util.inspect(map, { colors: true }));
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
    expect(inspect(mapWithProps, { colors: true })).toEqual(
      util.inspect(mapWithProps, { colors: true }),
    );
  });

  it("should show WeakMap with `Symbol.toStringTag`", () => {
    const taggedWeakMap = Object.defineProperty(new WeakMap(), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedWeakMap)).toEqual("WeakMap [MyTag] { <items unknown> }");
    expect(inspect(taggedWeakMap)).toEqual(util.inspect(taggedWeakMap));
    expect(inspect(taggedWeakMap, { colors: true })).toEqual(
      util.inspect(taggedWeakMap, { colors: true }),
    );
  });

  it("should show subclass of WeakMap", () => {
    class MyWeakMap extends WeakMap {}
    const myWeakMap = new MyWeakMap();
    expect(show(myWeakMap)).toEqual("MyWeakMap [WeakMap] { <items unknown> }");
    expect(inspect(myWeakMap)).toEqual(util.inspect(myWeakMap));
    expect(inspect(myWeakMap, { colors: true })).toEqual(util.inspect(myWeakMap, { colors: true }));
  });
});

describe("WeakSet", () => {
  it("should show WeakSet items", () => {
    const set = new WeakSet();

    expect(show(set)).toEqual("WeakSet { <items unknown> }");
    expect(inspect(set)).toEqual(util.inspect(set));
    expect(inspect(set, { colors: true })).toEqual(util.inspect(set, { colors: true }));
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
    expect(inspect(setWithProps, { colors: true })).toEqual(
      util.inspect(setWithProps, { colors: true }),
    );
  });

  it("should show WeakSet with `Symbol.toStringTag`", () => {
    const taggedWeakSet = Object.defineProperty(new WeakSet(), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedWeakSet)).toEqual("WeakSet [MyTag] { <items unknown> }");
    expect(inspect(taggedWeakSet)).toEqual(util.inspect(taggedWeakSet));
    expect(inspect(taggedWeakSet, { colors: true })).toEqual(
      util.inspect(taggedWeakSet, { colors: true }),
    );
  });

  it("should show subclass of WeakSet", () => {
    class MyWeakSet extends WeakSet {}
    const myWeakSet = new MyWeakSet();
    expect(show(myWeakSet)).toEqual("MyWeakSet [WeakSet] { <items unknown> }");
    expect(inspect(myWeakSet)).toEqual(util.inspect(myWeakSet));
    expect(inspect(myWeakSet, { colors: true })).toEqual(util.inspect(myWeakSet, { colors: true }));
  });
});
