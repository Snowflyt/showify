import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Map", () => {
  it("should show empty map", () => {
    const map = new Map();

    expect(show(map)).toEqual("Map(0) {}");
    expect(inspect(map)).toEqual(util.inspect(map));
    expect(inspect(map, { colors: true })).toEqual(util.inspect(map, { colors: true }));
  });

  it("should show map with primitive values", () => {
    const map = new Map<any, any>([
      ["key", "value"],
      [42, true],
      [Symbol("sym"), null],
    ]);

    expect(show(map)).toEqual('Map(3) { "key" => "value", 42 => true, Symbol(sym) => null }');
    expect(inspect(map)).toEqual(util.inspect(map));
    expect(inspect(map, { colors: true })).toEqual(util.inspect(map, { colors: true }));
  });

  it("should show map with object values", () => {
    const map = new Map<any, any>([
      [{}, []],
      [[], {}],
      [new Date("2023-01-01"), new RegExp("test")],
    ]);

    expect(show(map)).toEqual("Map(3) { {} => [], [] => {}, 2023-01-01T00:00:00.000Z => /test/ }");
    expect(inspect(map)).toEqual(util.inspect(map));
    expect(inspect(map, { colors: true })).toEqual(util.inspect(map, { colors: true }));
  });

  it("should show map with `Symbol.toStringTag`", () => {
    const taggedMap = Object.defineProperty(new Map([["key", "value"]]), Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedMap)).toEqual('Map(1) [MyTag] { "key" => "value" }');
    expect(inspect(taggedMap)).toEqual(util.inspect(taggedMap));
    expect(inspect(taggedMap, { colors: true })).toEqual(util.inspect(taggedMap, { colors: true }));
  });

  it("should sort map entries when sorted is true", () => {
    const map = new Map<any, any>([
      ["c", 3],
      ["a", 1],
      ["b", 2],
      [Symbol(), 4],
      [Symbol(), 5],
    ]);

    expect(show(map, { sorted: true })).toEqual(
      'Map(5) { "a" => 1, "b" => 2, "c" => 3, Symbol() => 4, Symbol() => 5 }',
    );
    expect(inspect(map, { sorted: true })).toEqual(util.inspect(map, { sorted: true }));
    expect(inspect(map, { sorted: true, colors: true })).toEqual(
      util.inspect(map, { sorted: true, colors: true }),
    );
  });

  it("should show circular references in map", () => {
    const map = new Map();
    const obj = { map };
    map.set("self", obj);

    expect(show(map)).toEqual('<ref *1> Map(1) { "self" => { map: [Circular *1] } }');
    expect(inspect(map)).toEqual(util.inspect(map));
    expect(inspect(map, { colors: true })).toEqual(util.inspect(map, { colors: true }));
  });
});
