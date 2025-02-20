import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Error", () => {
  it("should show error", () => {
    let error = new Error("foo");

    expect(show(error)).toMatch(/^Error: foo\n {4}at /);
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "foo\n  bar\n    at";
    expect(show(error)).toEqual("foo\n  bar\n    at");
    expect(inspect(error)).toEqual(util.inspect(error));

    error = new TypeError("bar");

    expect(show(error)).toMatch(/^TypeError: bar\n {4}at /);
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "foo\n  bar\n    at";
    expect(show(error)).toEqual("foo\n  bar\n    at");
    expect(inspect(error)).toEqual(util.inspect(error));
  });

  it("should show errors with invalid `stack`", () => {
    /* Invalid stack with message */
    let error = new Error("foo");

    error.stack = "";
    expect(show(error)).toEqual("[Error: foo]");
    expect(inspect(error)).toEqual(util.inspect(error));
    error.stack = undefined;
    expect(show(error)).toEqual("[Error: foo]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "foo\n  bar\n   at";
    expect(show(error)).toEqual("[foo\n  bar\n   at]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error = new TypeError("bar");

    error.stack = "";
    expect(show(error)).toEqual("[TypeError: bar]");
    expect(inspect(error)).toEqual(util.inspect(error));
    error.stack = undefined;
    expect(show(error)).toEqual("[TypeError: bar]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "foo\n  bar\n   at";
    expect(show(error)).toEqual("[foo\n  bar\n   at]");
    expect(inspect(error)).toEqual(util.inspect(error));

    /* Invalid stack without message */
    error = new Error();

    error.stack = "";
    expect(show(error)).toEqual("[Error]");
    expect(inspect(error)).toEqual(util.inspect(error));
    error.stack = undefined;
    expect(show(error)).toEqual("[Error]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "foo\n  bar\n   at";
    expect(show(error)).toEqual("[foo\n  bar\n   at]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error = new TypeError();

    error.stack = "";
    expect(show(error)).toEqual("[TypeError]");
    expect(inspect(error)).toEqual(util.inspect(error));
    error.stack = undefined;
    expect(show(error)).toEqual("[TypeError]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "foo\n  bar\n   at";
    expect(show(error)).toEqual("[foo\n  bar\n   at]");
    expect(inspect(error)).toEqual(util.inspect(error));
  });

  it("should show errors with `Symbol.toStringTag`", () => {
    /* Valid stack */
    const error = Object.defineProperty(new Error("foo"), Symbol.toStringTag, { value: "MyError" });

    expect(show(error)).toMatch(/^Error \[MyError\]: foo\n {4}at /);
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "Error\n  bar\n    at";
    expect(show(error)).toEqual("Error [MyError]\n  bar\n    at");
    expect(inspect(error)).toEqual(util.inspect(error));
    error.stack = "Error: foo\n  bar\n    at";
    expect(show(error)).toEqual("Error [MyError]: foo\n  bar\n    at");
    expect(inspect(error)).toEqual(util.inspect(error));

    // Valid stack with invalid prefix
    error.stack = "Error \n  bar\n    at";
    expect(show(error)).toEqual("Error \n  bar\n    at");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "TypeError\n  bar\n    at";
    expect(show(error)).toEqual("TypeError\n  bar\n    at");
    expect(inspect(error)).toEqual(util.inspect(error));

    /* Invalid stack */
    error.stack = "Error";
    expect(show(error)).toEqual("[Error [MyError]]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "Error: hello\n  foo";
    expect(show(error)).toEqual("[Error [MyError]: hello\n  foo]");
    expect(inspect(error)).toEqual(util.inspect(error));

    // Invalid stack with invalid prefix
    error.stack = "Error \n  bar\n   at";
    expect(show(error)).toEqual("[Error \n  bar\n   at]");
    expect(inspect(error)).toEqual(util.inspect(error));

    error.stack = "TypeError\n  bar\n   at";
    expect(show(error)).toEqual("[TypeError\n  bar\n   at]");
    expect(inspect(error)).toEqual(util.inspect(error));

    /* Only message */
    error.stack = "";

    error.message = "foo";
    expect(show(error)).toEqual("[Error [MyError]: foo]");
    expect(inspect(error)).toEqual(util.inspect(error));

    /* No message */
    error.message = "";
    expect(show(error)).toEqual("[Error [MyError]]");
    expect(inspect(error)).toEqual(util.inspect(error));
  });
});
