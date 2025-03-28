import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Object", () => {
  it("should show empty object", () => {
    const obj = {};

    expect(show(obj)).toEqual("{}");
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it("should show object with primitive values", () => {
    const obj = {
      str: "hello",
      num: 42,
      bool: true,
      nil: null,
      undef: undefined,
      sym: Symbol("test"),
    };

    expect(show(obj)).toEqual(
      '{ str: "hello", num: 42, bool: true, nil: null, undef: undefined, sym: Symbol(test) }',
    );
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it("should show object with non-identifier keys", () => {
    const obj = {
      "foo-bar": 2,
      "123": 1,
      foo: 42n,
      "": 3,
      "a b": 4,
    };

    expect(show(obj)).toEqual('{ "123": 1, "foo-bar": 2, foo: 42n, "": 3, "a b": 4 }');
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it("should show object with symbol keys", () => {
    const sym1 = Symbol("test1");
    const sym2 = Symbol("test2");
    const obj = {
      [sym1]: 1,
      [sym2]: 2,
    };

    expect(show(obj)).toEqual("{ [Symbol(test1)]: 1, [Symbol(test2)]: 2 }");
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it('should show object with non-enumerable properties when `showHidden` is not `"none"`', () => {
    const obj = {};
    Object.defineProperties(obj, {
      visible: {
        value: 1,
        enumerable: true,
      },
      hidden: {
        value: 2,
        enumerable: false,
      },
    });

    expect(show(obj)).toEqual("{ visible: 1 }");
    expect(show(obj, { showHidden: "always" })).toEqual("{ visible: 1, [hidden]: 2 }");
    expect(inspect(obj, { showHidden: "always" })).toEqual(util.inspect(obj, { showHidden: true }));
  });

  it("should show object with getters and setters", () => {
    const obj = {
      get getter() {
        return "get value";
      },
      set setter(value: string) {
        // Do nothing
      },

      get both() {
        return { foo: "both value" };
      },
      set both(value: any) {
        // Do nothing
      },
    };

    expect(show(obj)).toEqual("{ getter: [Getter], setter: [Setter], both: [Getter/Setter] }");
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));

    expect(show(obj, { getters: "all" })).toEqual(
      '{ getter: [Getter: "get value"], setter: [Setter], both: [Getter/Setter] { foo: "both value" } }',
    );
    expect(inspect(obj, { getters: "all" })).toEqual(util.inspect(obj, { getters: true }));
    expect(inspect(obj, { getters: "all", colors: true })).toEqual(
      util.inspect(obj, { getters: true, colors: true }),
    );

    expect(show(obj, { getters: "get" })).toEqual(
      '{ getter: [Getter: "get value"], setter: [Setter], both: [Getter/Setter] }',
    );
    expect(inspect(obj, { getters: "get", breakLength: Infinity })).toEqual(
      util.inspect(obj, { getters: "get", breakLength: Infinity }),
    );
    expect(inspect(obj, { getters: "get", breakLength: Infinity, colors: true })).toEqual(
      util.inspect(obj, { getters: "get", breakLength: Infinity, colors: true }),
    );

    expect(show(obj, { getters: "set" })).toEqual(
      '{ getter: [Getter], setter: [Setter], both: [Getter/Setter] { foo: "both value" } }',
    );
    expect(inspect(obj, { getters: "set", breakLength: Infinity })).toEqual(
      util.inspect(obj, { getters: "set", breakLength: Infinity }),
    );
    expect(inspect(obj, { getters: "set", breakLength: Infinity, colors: true })).toEqual(
      util.inspect(obj, { getters: "set", breakLength: Infinity, colors: true }),
    );
  });

  it("should handle getter that throws error", () => {
    /* Throw non-nullable */
    const obj1 = {
      get error1() {
        throw new Error("Getter error");
      },

      get error2() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { message: "Getter/Setter error" };
      },
      set error2(value: string) {
        // Do nothing
      },

      get error3() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { message: "" };
      },

      get error4() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw {};
      },

      get error5() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "";
      },
    };

    expect(show(obj1, { getters: "all" })).toEqual(
      "{ error1: [Getter: <Inspection threw (Getter error)>], " +
        "error2: [Getter/Setter: <Inspection threw (Getter/Setter error)>], " +
        "error3: [Getter: <Inspection threw ()>], " +
        "error4: [Getter: <Inspection threw (undefined)>], " +
        "error5: [Getter: <Inspection threw (undefined)>] }",
    );
    expect(inspect(obj1, { getters: "all" })).toEqual(util.inspect(obj1, { getters: true }));
    expect(inspect(obj1, { getters: "all", colors: true })).toEqual(
      util.inspect(obj1, { getters: true, colors: true }),
    );

    /* Throw nullable */
    const obj2 = {
      get errorNull() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw null;
      },

      get errorUndefined() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw undefined;
      },
    };

    expect(show(obj2, { getters: "all" })).toEqual(
      "{ errorNull: [Getter: <Inspection threw (null)>], errorUndefined: [Getter: <Inspection threw (undefined)>] }",
    );
  });

  it("should show object with nested objects and arrays", () => {
    const obj = {
      arr: [1, 2, { x: 3 }],
      nested: { a: 1, b: { c: 2 } },
      mix: [{ d: [3] }],
    };

    expect(show(obj)).toEqual(
      "{ arr: [1, 2, { x: 3 }], nested: { a: 1, b: { c: 2 } }, mix: [{ d: [3] }] }",
    );
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it("should sort object keys when `sorted` is `true`", () => {
    const obj = {
      c: 3,
      a: 1,
      get b() {
        return 2;
      },
      [Symbol("sym")]: 0,
      [Symbol("sym")]: 0,
    };

    expect(show(obj, { sorted: true })).toEqual(
      "{ [Symbol(sym)]: 0, [Symbol(sym)]: 0, a: 1, b: [Getter], c: 3 }",
    );
    expect(inspect(obj, { sorted: true })).toEqual(util.inspect(obj, { sorted: true }));
    expect(inspect(obj, { sorted: true, colors: true })).toEqual(
      util.inspect(obj, { sorted: true, colors: true }),
    );
  });

  it("should quote all keys when quoteKeys is always", () => {
    const obj = {
      normal: 1,
      "special-key": 2,
    };

    expect(show(obj, { quoteKeys: "always" })).toEqual('{ "normal": 1, "special-key": 2 }');
  });

  it("should show object with circular reference", () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    obj.nested = { ref: obj };

    expect(show(obj)).toEqual(
      "<ref *1> { a: 1, self: [Circular *1], nested: { ref: [Circular *1] } }",
    );
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { breakLength: Infinity, colors: true })).toEqual(
      util.inspect(obj, { breakLength: Infinity, colors: true }),
    );
  });

  it("should handle object with null prototype", () => {
    const obj = Object.create(null);
    obj.foo = "bar";

    expect(show(obj)).toEqual('[Object: null prototype] { foo: "bar" }');
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it("should handle object with `Symbol.toStringTag`", () => {
    const obj = Object.defineProperty({ foo: "bar" }, Symbol.toStringTag, {
      value: "CustomObject",
    });

    expect(show(obj)).toEqual('Object [CustomObject] { foo: "bar" }');
    expect(inspect(obj)).toEqual(util.inspect(obj));
    expect(inspect(obj, { colors: true })).toEqual(util.inspect(obj, { colors: true }));
  });

  it("should call `.toJSON()` method", () => {
    const obj = {
      toJSON() {
        return { foo: "bar" };
      },
      bar: "baz",
    };

    expect(show(obj)).toEqual('{ foo: "bar" }');

    // `omittedKeys` should disable `.toJSON()`
    expect(show(obj, { omittedKeys: new Set(["toJSON"]) })).toEqual('{ bar: "baz" }');
  });
});
