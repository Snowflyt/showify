import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect, trimIndent } from "./test-utils";

describe("Class", () => {
  it("should show class name", () => {
    class MyClass {}

    expect(show(MyClass)).toEqual("[class MyClass]");
    expect(inspect(MyClass)).toEqual(util.inspect(MyClass));
    expect(inspect(MyClass, { colors: true })).toEqual(util.inspect(MyClass, { colors: true }));
  });

  it("should show anonymous class", () => {
    const AnonymousClass = (() => class {})();

    expect(show(AnonymousClass)).toEqual("[class (anonymous)]");
    expect(inspect(AnonymousClass)).toEqual(util.inspect(AnonymousClass));
    expect(inspect(AnonymousClass, { colors: true })).toEqual(
      util.inspect(AnonymousClass, { colors: true }),
    );
  });

  it("should show class with superclass", () => {
    class BaseClass {}
    class DerivedClass extends BaseClass {}

    expect(show(DerivedClass)).toEqual("[class DerivedClass extends BaseClass]");
    expect(inspect(DerivedClass)).toEqual(util.inspect(DerivedClass));
    expect(inspect(DerivedClass, { colors: true })).toEqual(
      util.inspect(DerivedClass, { colors: true }),
    );
  });

  it("should show class prototypes", () => {
    class BaseClass {}
    class DerivedClass extends BaseClass {}

    expect(show(BaseClass.prototype)).toEqual("{}");
    expect(inspect(BaseClass.prototype)).toEqual(util.inspect(BaseClass.prototype));
    expect(inspect(BaseClass.prototype, { colors: true })).toEqual(
      util.inspect(BaseClass.prototype, { colors: true }),
    );

    expect(show(DerivedClass.prototype)).toEqual("BaseClass {}");
    expect(inspect(DerivedClass.prototype)).toEqual(util.inspect(DerivedClass.prototype));
    expect(inspect(DerivedClass.prototype, { colors: true })).toEqual(
      util.inspect(DerivedClass.prototype, { colors: true }),
    );
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
    expect(inspect(WrongTaggedClass, { colors: true })).toEqual(
      util.inspect(WrongTaggedClass, { colors: true }),
    );

    class TaggedClass {
      static get [Symbol.toStringTag]() {
        return "MyTag";
      }
    }

    expect(show(TaggedClass)).toEqual("[class TaggedClass [MyTag]]");
    expect(inspect(TaggedClass)).toEqual(util.inspect(TaggedClass));
    expect(inspect(TaggedClass, { colors: true })).toEqual(
      util.inspect(TaggedClass, { colors: true }),
    );

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
    expect(inspect(TaggedDerivedClass, { colors: true })).toEqual(
      util.inspect(TaggedDerivedClass, { colors: true }),
    );
  });

  it('should hide meta properties when `showHidden` is `"exclude-meta"`', () => {
    class TestClass1 {}

    expect(show(TestClass1, { showHidden: "exclude-meta" })).toEqual("[class TestClass1]");
    expect(inspect(TestClass1, { showHidden: "always" })).toEqual(
      trimIndent(String.raw`
        <ref *1> [class TestClass1] {
          [length]: 0,
          [name]: 'TestClass1',
          [prototype]: { [constructor]: [Circular *1] }
        }
      `),
    );
    expect(inspect(TestClass1, { showHidden: "always" })).toEqual(
      util.inspect(TestClass1, { showHidden: true }),
    );
    expect(inspect(TestClass1, { showHidden: "always", colors: true })).toEqual(
      util.inspect(TestClass1, { showHidden: true, colors: true }),
    );

    class TestClass2 {
      method() {}
      static staticMethod() {}
    }

    expect(show(TestClass2, { indent: 2, showHidden: "exclude-meta" })).toEqual(
      trimIndent(
        String.raw`
          <ref *1> [class TestClass2] {
            [prototype]: { [constructor]: [Circular *1], [method]: [Function: method] },
            [staticMethod]: [Function: staticMethod]
          }
        `,
      ),
    );
    expect(inspect(TestClass2, { showHidden: "always" })).toEqual(
      trimIndent(String.raw`
        <ref *1> [class TestClass2] {
          [length]: 0,
          [name]: 'TestClass2',
          [prototype]: {
            [constructor]: [Circular *1],
            [method]: [Function: method] { [length]: 0, [name]: 'method' }
          },
          [staticMethod]: [Function: staticMethod] {
            [length]: 0,
            [name]: 'staticMethod'
          }
        }
      `),
    );
    expect(inspect(TestClass2, { showHidden: "always", breakLength: Infinity })).toEqual(
      util.inspect(TestClass2, { showHidden: true, breakLength: Infinity }),
    );
    expect(
      inspect(TestClass2, { showHidden: "always", colors: true, breakLength: Infinity }),
    ).toEqual(util.inspect(TestClass2, { showHidden: true, colors: true, breakLength: Infinity }));
  });
});
