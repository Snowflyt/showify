/* eslint-disable @typescript-eslint/class-literal-property-style */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Class", () => {
  it("should show class name", () => {
    class MyClass {}

    expect(show(MyClass)).toEqual("[class MyClass]");
    expect(inspect(MyClass)).toEqual(util.inspect(MyClass));
  });

  it("should show anonymous class", () => {
    const AnonymousClass = (() => class {})();

    expect(show(AnonymousClass)).toEqual("[class (anonymous)]");
    expect(inspect(AnonymousClass)).toEqual(util.inspect(AnonymousClass));
  });

  it("should show class with superclass", () => {
    class BaseClass {}
    class DerivedClass extends BaseClass {}

    expect(show(DerivedClass)).toEqual("[class DerivedClass extends BaseClass]");
    expect(inspect(DerivedClass)).toEqual(util.inspect(DerivedClass));
  });

  it("should show class prototypes", () => {
    class BaseClass {}
    class DerivedClass extends BaseClass {}

    expect(show(BaseClass.prototype)).toEqual("{}");
    expect(inspect(BaseClass.prototype)).toEqual(util.inspect(BaseClass.prototype));

    expect(show(DerivedClass.prototype)).toEqual("BaseClass {}");
    expect(inspect(DerivedClass.prototype)).toEqual(util.inspect(DerivedClass.prototype));
  });

  it("should show class with `Symbol.toStringTag`", () => {
    /* Without superclass */
    class WrongTaggedClass {
      // `Symbol.toStringTag` defined on instances will not be shown
      get [Symbol.toStringTag]() {
        return "MyTag";
      }
    }

    expect(show(WrongTaggedClass)).toEqual("[class WrongTaggedClass]");
    expect(inspect(WrongTaggedClass)).toEqual(util.inspect(WrongTaggedClass));

    class TaggedClass {
      static get [Symbol.toStringTag]() {
        return "MyTag";
      }
    }

    expect(show(TaggedClass)).toEqual("[class TaggedClass [MyTag]]");
    expect(inspect(TaggedClass)).toEqual(util.inspect(TaggedClass));

    /* With superclass */
    class BaseClass {}
    class TaggedDerivedClass extends BaseClass {
      static get [Symbol.toStringTag]() {
        return "MyTag";
      }
    }

    expect(show(TaggedDerivedClass)).toEqual(
      "[class TaggedDerivedClass [MyTag] extends BaseClass]",
    );
    expect(inspect(TaggedDerivedClass)).toEqual(util.inspect(TaggedDerivedClass));
  });
});
