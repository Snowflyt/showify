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

  it("should format error stack for runtimes other than V8", () => {
    // SpiderMonkey style
    let stack =
      "anonymous/<@https://repl.js.org/assets/sandbox-p74DAVuo.js line 459 > Function:5:26\n" +
      "anonymous@https://repl.js.org/assets/sandbox-p74DAVuo.js line 459 > Function:7:3\n" +
      "dFe@https://repl.js.org/assets/sandbox-p74DAVuo.js:459:1720\n" +
      "execute@https://repl.js.org/assets/sandbox-p74DAVuo.js:453:61\n" +
      "execute@https://repl.js.org/assets/index-Cgwg-zxb.js:163:2411\n" +
      "ve@https://repl.js.org/assets/index-Cgwg-zxb.js:146:18187\n" +
      "kf/I[b]<@https://repl.js.org/assets/index-Cgwg-zxb.js:146:22073\n" +
      "cv/ve<@https://repl.js.org/assets/index-Cgwg-zxb.js:165:556\n" +
      "onKeyDown@https://repl.js.org/assets/index-Cgwg-zxb.js:166:103\n" +
      "Dh@https://repl.js.org/assets/index-Cgwg-zxb.js:48:124738\n" +
      "mp/Zr/<@https://repl.js.org/assets/index-Cgwg-zxb.js:48:129926\n" +
      "Bu@https://repl.js.org/assets/index-Cgwg-zxb.js:48:16986\n" +
      "Zr@https://repl.js.org/assets/index-Cgwg-zxb.js:48:126047\n" +
      "lf@https://repl.js.org/assets/index-Cgwg-zxb.js:49:25915\n" +
      "Pm@https://repl.js.org/assets/index-Cgwg-zxb.js:49:25735\n";
    let expected =
      "Error: foo\n" +
      "    at anonymous/< (https://repl.js.org/assets/sandbox-p74DAVuo.js line 459 > Function:5:26)\n" +
      "    at anonymous (https://repl.js.org/assets/sandbox-p74DAVuo.js line 459 > Function:7:3)\n" +
      "    at dFe (https://repl.js.org/assets/sandbox-p74DAVuo.js:459:1720)\n" +
      "    at execute (https://repl.js.org/assets/sandbox-p74DAVuo.js:453:61)\n" +
      "    at execute (https://repl.js.org/assets/index-Cgwg-zxb.js:163:2411)\n" +
      "    at ve (https://repl.js.org/assets/index-Cgwg-zxb.js:146:18187)\n" +
      "    at kf/I[b]< (https://repl.js.org/assets/index-Cgwg-zxb.js:146:22073)\n" +
      "    at cv/ve< (https://repl.js.org/assets/index-Cgwg-zxb.js:165:556)\n" +
      "    at onKeyDown (https://repl.js.org/assets/index-Cgwg-zxb.js:166:103)\n" +
      "    at Dh (https://repl.js.org/assets/index-Cgwg-zxb.js:48:124738)\n" +
      "    at mp/Zr/< (https://repl.js.org/assets/index-Cgwg-zxb.js:48:129926)\n" +
      "    at Bu (https://repl.js.org/assets/index-Cgwg-zxb.js:48:16986)\n" +
      "    at Zr (https://repl.js.org/assets/index-Cgwg-zxb.js:48:126047)\n" +
      "    at lf (https://repl.js.org/assets/index-Cgwg-zxb.js:49:25915)\n" +
      "    at Pm (https://repl.js.org/assets/index-Cgwg-zxb.js:49:25735)";
    expect(show(Object.assign(new Error("foo"), { stack }))).toEqual(expected);

    // JavaScriptCore style
    stack =
      "@\n" +
      "anonymous@\n" +
      "@https://repl.js.org/assets/sandbox-p74DAVuo.js:453:65\n" +
      "execute@https://repl.js.org/assets/sandbox-p74DAVuo.js:447:9047\n" +
      "@https://repl.js.org/assets/index-Cgwg-zxb.js:163:2418\n" +
      "execute@https://repl.js.org/assets/index-Cgwg-zxb.js:163:2745\n" +
      "ve@https://repl.js.org/assets/index-Cgwg-zxb.js:146:18192\n" +
      "@https://repl.js.org/assets/index-Cgwg-zxb.js:165:563\n" +
      "@https://repl.js.org/assets/index-Cgwg-zxb.js:165:606\n" +
      "onKeyDown@https://repl.js.org/assets/index-Cgwg-zxb.js:166:105\n" +
      "Dh@https://repl.js.org/assets/index-Cgwg-zxb.js:48:124738\n" +
      "@https://repl.js.org/assets/index-Cgwg-zxb.js:48:129926\n" +
      "Bu@https://repl.js.org/assets/index-Cgwg-zxb.js:48:16986\n" +
      "Zr@https://repl.js.org/assets/index-Cgwg-zxb.js:48:126047\n" +
      "lf@https://repl.js.org/assets/index-Cgwg-zxb.js:49:25915\n" +
      "Pm@https://repl.js.org/assets/index-Cgwg-zxb.js:49:25737";
    expected =
      "TypeError\n" +
      "    at <anonymous> (https://repl.js.org/assets/sandbox-p74DAVuo.js:453:65)\n" +
      "    at execute (https://repl.js.org/assets/sandbox-p74DAVuo.js:447:9047)\n" +
      "    at <anonymous> (https://repl.js.org/assets/index-Cgwg-zxb.js:163:2418)\n" +
      "    at execute (https://repl.js.org/assets/index-Cgwg-zxb.js:163:2745)\n" +
      "    at ve (https://repl.js.org/assets/index-Cgwg-zxb.js:146:18192)\n" +
      "    at <anonymous> (https://repl.js.org/assets/index-Cgwg-zxb.js:165:563)\n" +
      "    at <anonymous> (https://repl.js.org/assets/index-Cgwg-zxb.js:165:606)\n" +
      "    at onKeyDown (https://repl.js.org/assets/index-Cgwg-zxb.js:166:105)\n" +
      "    at Dh (https://repl.js.org/assets/index-Cgwg-zxb.js:48:124738)\n" +
      "    at <anonymous> (https://repl.js.org/assets/index-Cgwg-zxb.js:48:129926)\n" +
      "    at Bu (https://repl.js.org/assets/index-Cgwg-zxb.js:48:16986)\n" +
      "    at Zr (https://repl.js.org/assets/index-Cgwg-zxb.js:48:126047)\n" +
      "    at lf (https://repl.js.org/assets/index-Cgwg-zxb.js:49:25915)\n" +
      "    at Pm (https://repl.js.org/assets/index-Cgwg-zxb.js:49:25737)";
    expect(show(Object.assign(new TypeError(), { stack }))).toEqual(expected);

    // QuickJS style
    stack = "    at <eval> (<evalScript>:1:4)\n";
    expected = "TypeError: bar\n    at <eval> (<evalScript>:1:4)";
    expect(show(Object.assign(new TypeError("bar"), { stack }))).toEqual(expected);
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
