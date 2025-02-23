/* eslint-disable @typescript-eslint/class-literal-property-style */

import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("RegExp", () => {
  it("should show regular expressions", () => {
    expect(show(/foo/g)).toEqual("/foo/g");
    expect(inspect(/foo/g)).toEqual(util.inspect(/foo/g));
  });

  it("should show subclass of `RegExp`", () => {
    class MyRegExp extends RegExp {}

    expect(show(new MyRegExp("foo", "g"))).toEqual("MyRegExp /foo/g");
    expect(inspect(new MyRegExp("foo", "g"))).toEqual(util.inspect(new MyRegExp("foo", "g")));
  });

  it("should show `Symbol.toStringTag`", () => {
    const regexpWithSameTag = Object.defineProperty(/foo/g, Symbol.toStringTag, {
      value: "RegExp",
    });
    const regexpWithDifferentTag = Object.defineProperty(/foo/g, Symbol.toStringTag, {
      value: "RegExp1",
    });

    expect(show(regexpWithSameTag)).toEqual("/foo/g");
    expect(inspect(regexpWithSameTag)).toEqual(util.inspect(regexpWithSameTag));
    expect(show(regexpWithDifferentTag)).toEqual("RegExp [RegExp1] /foo/g");
    expect(inspect(regexpWithDifferentTag)).toEqual(util.inspect(regexpWithDifferentTag));

    class MyRegExp extends RegExp {
      get [Symbol.toStringTag]() {
        return "MyRegExp1";
      }
    }
    const myRegExpWithSameTag = Object.defineProperty(
      new MyRegExp("foo", "g"),
      Symbol.toStringTag,
      { value: "MyRegExp" },
    );
    const myRegExpWithDifferentTag = new MyRegExp("foo", "g");

    expect(show(myRegExpWithSameTag)).toEqual("MyRegExp /foo/g");
    expect(inspect(myRegExpWithSameTag)).toEqual(util.inspect(myRegExpWithSameTag));
    expect(show(myRegExpWithDifferentTag)).toEqual("MyRegExp [MyRegExp1] /foo/g");
    expect(inspect(myRegExpWithDifferentTag)).toEqual(util.inspect(myRegExpWithDifferentTag));
  });
});
