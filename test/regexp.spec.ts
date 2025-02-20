import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("RegExp", () => {
  it("should show regular expressions", () => {
    expect(show(/foo/g)).toEqual("/foo/g");
    expect(inspect(/foo/g)).toEqual(util.inspect(/foo/g));
    expect(inspect(/foo/g, { colors: true })).toEqual(util.inspect(/foo/g, { colors: true }));
  });

  it("should show subclass of `RegExp`", () => {
    class MyRegExp extends RegExp {
      constructor(...args: ConstructorParameters<RegExpConstructor>) {
        super(...args);
      }
    }

    expect(show(new MyRegExp("foo", "g"))).toEqual("MyRegExp /foo/g");
    expect(inspect(new MyRegExp("foo", "g"))).toEqual(util.inspect(new MyRegExp("foo", "g")));
    expect(inspect(new MyRegExp("foo", "g"), { colors: true })).toEqual(
      util.inspect(new MyRegExp("foo", "g"), { colors: true }),
    );
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
    expect(inspect(regexpWithSameTag, { colors: true })).toEqual(
      util.inspect(regexpWithSameTag, { colors: true }),
    );
    expect(show(regexpWithDifferentTag)).toEqual("RegExp [RegExp1] /foo/g");
    expect(inspect(regexpWithDifferentTag)).toEqual(util.inspect(regexpWithDifferentTag));
    expect(inspect(regexpWithDifferentTag, { colors: true })).toEqual(
      util.inspect(regexpWithDifferentTag, { colors: true }),
    );

    class MyRegExp extends RegExp {
      constructor(...args: ConstructorParameters<RegExpConstructor>) {
        super(...args);
      }

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
    expect(inspect(myRegExpWithSameTag, { colors: true })).toEqual(
      util.inspect(myRegExpWithSameTag, { colors: true }),
    );
    expect(show(myRegExpWithDifferentTag)).toEqual("MyRegExp [MyRegExp1] /foo/g");
    expect(inspect(myRegExpWithDifferentTag)).toEqual(util.inspect(myRegExpWithDifferentTag));
    expect(inspect(myRegExpWithDifferentTag, { colors: true })).toEqual(
      util.inspect(myRegExpWithDifferentTag, { colors: true }),
    );
  });
});
