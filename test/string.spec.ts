import util from "node:util";

import { describe, expect, it } from "vitest";

import type { ShowOptions } from "../src";
import { show } from "../src";

import { inspect, trimIndent } from "./test-utils";

function showBreak(value: unknown, options?: ShowOptions) {
  return show(value, { indent: 2, breakLength: 16, ...options });
}

describe("String primitive", () => {
  it("should show simple strings as is", () => {
    expect(show("foo")).toEqual(`"foo"`);
    expect(show("foo", { quoteStyle: "single" })).toEqual(`'foo'`);
    expect(showBreak("foo")).toEqual(`"foo"`);
    expect(showBreak("foo", { quoteStyle: "single" })).toEqual(`'foo'`);
    expect(inspect("foo")).toEqual(util.inspect("foo"));
    expect(inspect("foo", { colors: true })).toEqual(util.inspect("foo", { colors: true }));
    expect(show(`'Hello', "world!"`)).toEqual(`\`'Hello', "world!"\``);
    expect(show(`'Hello', "world!"`, { quoteStyle: "single" })).toEqual(`'\\'Hello\\', "world!"'`);
    expect(showBreak(`'Hello', "world!"`)).toEqual(`\`'Hello', "world!"\``);
    expect(showBreak(`'Hello', "world!"`, { quoteStyle: "single" })).toEqual(
      `'\\'Hello\\', "world!"'`,
    );
    expect(inspect(`'Hello', "world!"`)).toEqual(util.inspect(`'Hello', "world!"`));
  });

  it("should short strings with newlines as is", () => {
    expect(showBreak("foo\nbar")).toEqual(`"foo\\nbar"`);
    expect(inspect("foo\nbar")).toEqual(util.inspect("foo\nbar", { breakLength: 16 }));
    expect(showBreak("foo\n\nb\r\nc")).toEqual(`"foo\\n\\nb\\r\\nc"`);
    expect(inspect("foo\n\nb\r\nc")).toEqual(util.inspect("foo\n\nb\r\nc", { breakLength: 16 }));
    expect(showBreak("foo\n\nb\r\nc-")).toEqual(`"foo\\n\\nb\\r\\nc-"`);
    expect(inspect("foo\n\nb\r\nc-")).toEqual(util.inspect("foo\n\nb\r\nc-", { breakLength: 16 }));
    expect(showBreak("foo\n\nb\r\nc--", { indent: 0 })).toEqual(`"foo\\n\\nb\\r\\nc--"`);
    expect(inspect("foo\n\nb\r\nc--", { indent: 0, breakLength: 16 })).toEqual(
      util.inspect("foo\n\nb\r\nc--", { breakLength: Infinity }),
    );
  });

  it("should show long strings with newlines with breaks", () => {
    expect(showBreak("foo\n\nb\r\nc--")).toEqual(
      trimIndent(String.raw`
        "foo\n" +
          "\n" +
          "b\r\n" +
          "c--"
      `),
    );
    expect(showBreak(`foo\n"bar"\n'baz'\n-----`)).toEqual(
      trimIndent(String.raw`
        "foo\n" +
          '"bar"\n' +
          "'baz'\n" +
          "-----"
      `),
    );
    expect(inspect(`foo\n"bar"\n'baz'\n-----`, { breakLength: 16 })).toEqual(
      util.inspect(`foo\n"bar"\n'baz'\n-----`, { breakLength: 16 }),
    );
    expect(showBreak(`foo\n"bar"\n'baz'\n-----`, { quoteStyle: "single" })).toEqual(
      trimIndent(String.raw`
        'foo\n' +
          '"bar"\n' +
          '\'baz\'\n' +
          '-----'
      `),
    );
  });

  it("should show long strings with ellipsis when `maxStringLength` is set", () => {
    expect(show("abcdefghij", { maxStringLength: 10 })).toEqual('"abcdefghij"');
    expect(inspect("abcdefghij", { maxStringLength: 10 })).toEqual(
      util.inspect("abcdefghij", { maxStringLength: 10 }),
    );
    expect(show("abcdefghijk", { maxStringLength: 10 })).toEqual(
      `"abcdefghij"... 1 more character`,
    );
    expect(inspect("abcdefghijk", { maxStringLength: 10 })).toEqual(
      util.inspect("abcdefghijk", { maxStringLength: 10 }),
    );
    expect(show("abcdefghijklmnopqrstuvwxyz", { maxStringLength: 10 })).toEqual(
      `"abcdefghij"... 16 more characters`,
    );
    expect(inspect("abcdefghijklmnopqrstuvwxyz", { maxStringLength: 10 })).toEqual(
      util.inspect("abcdefghijklmnopqrstuvwxyz", { maxStringLength: 10 }),
    );
    expect(showBreak("foo\n\nb\r\nc--", { maxStringLength: 10 })).toEqual(
      trimIndent(String.raw`
        "foo\n" +
          "\n" +
          "b\r\n" +
          "c-"... 1 more character
      `),
    );
    expect(inspect("foo\n\nb\r\nc--", { maxStringLength: 10 })).toEqual(
      util.inspect("foo\n\nb\r\nc--", { maxStringLength: 10 }),
    );
    expect(showBreak(`foo\n"bar"\n'baz'\n-----`, { maxStringLength: 10 })).toEqual(
      trimIndent(String.raw`
        "foo\n" +
          '"bar"\n'... 11 more characters
      `),
    );
    expect(inspect(`foo\n"bar"\n'baz'\n-----`, { maxStringLength: 10 })).toEqual(
      util.inspect(`foo\n"bar"\n'baz'\n-----`, { maxStringLength: 10 }),
    );
    expect(inspect(`foo\n"bar"\n'baz'\n-----`, { colors: true, maxStringLength: 10 })).toEqual(
      util.inspect(`foo\n"bar"\n'baz'\n-----`, { colors: true, maxStringLength: 10 }),
    );
  });

  it("should show strings with different quote styles", () => {
    expect(show("foo", { quoteStyle: "single" })).toEqual("'foo'");
    expect(show("'foo'", { quoteStyle: "single" })).toEqual("'\\'foo\\''");
    expect(show("foo", { quoteStyle: "double" })).toEqual('"foo"');
    expect(show('"foo"', { quoteStyle: "double" })).toEqual('"\\"foo\\""');
    expect(show("foo", { quoteStyle: "backtick" })).toEqual("`foo`");
    expect(show("`foo`", { quoteStyle: "backtick" })).toEqual("`\\`foo\\``");

    expect(inspect("foo")).toEqual("'foo'");
    expect(inspect("foo")).toEqual(util.inspect("foo"));
    expect(inspect("'foo'")).toEqual(`"'foo'"`);
    expect(inspect("'foo'")).toEqual(util.inspect("'foo'"));
    expect(inspect(`foo'bar"`)).toEqual(`\`foo'bar"\``);
    expect(inspect(`foo'bar"`)).toEqual(util.inspect(`foo'bar"`));
    expect(inspect(`foo''bar"baz\``)).toEqual("'foo\\'\\'bar\"baz`'");
    expect(inspect(`foo''bar"baz\``)).toEqual(util.inspect(`foo''bar"baz\``));

    expect(inspect(`foo''bar"baz\``, { quoteStyle: ["double", "single", "backtick"] })).toEqual(
      `"foo''bar\\"baz\`"`,
    );
    expect(inspect(`foo''bar"baz\``, { quoteStyle: ["single", "double", "backtick"] })).toEqual(
      `'foo\\'\\'bar"baz\`'`,
    );
    expect(inspect(`foo''bar"baz\``, { quoteStyle: ["backtick", "single", "double"] })).toEqual(
      `\`foo''bar"baz\\\`\``,
    );
  });
});

describe("Wrapper object for strings", () => {
  it("should show simple strings as is", () => {
    expect(show(Object("foo"))).toEqual(`[String: "foo"]`);
    expect(show(Object("foo"), { quoteStyle: "single" })).toEqual(`[String: 'foo']`);
    expect(showBreak(Object("foo"))).toEqual(`[String: "foo"]`);
    expect(showBreak(Object("foo"), { quoteStyle: "single" })).toEqual(`[String: 'foo']`);
    expect(inspect(Object("foo"))).toEqual(util.inspect(Object("foo")));
    expect(show(Object(`'Hello', "world!"`))).toEqual(`[String: \`'Hello', "world!"\`]`);
    expect(show(Object(`'Hello', "world!"`), { quoteStyle: "single" })).toEqual(
      `[String: '\\'Hello\\', "world!"']`,
    );
    expect(showBreak(Object(`'Hello', "world!"`))).toEqual(`[String: \`'Hello', "world!"\`]`);
    expect(showBreak(Object(`'Hello', "world!"`), { quoteStyle: "single" })).toEqual(
      `[String: '\\'Hello\\', "world!"']`,
    );
    expect(inspect(Object(`'Hello', "world!"`))).toEqual(util.inspect(Object(`'Hello', "world!"`)));
  });

  it("should show short strings with newlines as is", () => {
    expect(showBreak(Object("\nb"))).toEqual(`[String: "\\nb"]`);
    expect(inspect(Object("\nb"))).toEqual(util.inspect(Object("\nb")));
    expect(showBreak(Object("a\nb"))).toEqual(`[String: "a\\nb"]`);
    expect(inspect(Object("a\nb"))).toEqual(util.inspect(Object("a\nb")));
    expect(showBreak(Object("a\nb-"), { indent: 0 })).toEqual(`[String: "a\\nb-"]`);
    expect(inspect(Object("a\nb-"), { indent: 0, breakLength: 16 })).toEqual(
      util.inspect(Object("a\nb-"), { breakLength: Infinity }),
    );
  });

  it("should show long strings with newlines with breaks", () => {
    expect(showBreak(Object("a\nb-"))).toEqual(
      trimIndent(String.raw`
        [String: "a\n" +
          "b-"]
      `),
    );
    expect(showBreak(Object("foo\n\nb\r\nc--"))).toEqual(
      trimIndent(String.raw`
        [String: "foo\n" +
          "\n" +
          "b\r\n" +
          "c--"]
      `),
    );
    expect(showBreak(Object(`foo\n"bar"\n'baz'\n-----`))).toEqual(
      trimIndent(String.raw`
        [String: "foo\n" +
          '"bar"\n' +
          "'baz'\n" +
          "-----"]
      `),
    );
    expect(inspect(Object(`foo\n"bar"\n'baz'\n-----`), { breakLength: 16 })).toEqual(
      util.inspect(Object(`foo\n"bar"\n'baz'\n-----`), { breakLength: 16 }),
    );
    expect(inspect(Object(`foo\n"bar"\n'baz'\n-----`), { colors: true, breakLength: 16 })).toEqual(
      util.inspect(Object(`foo\n"bar"\n'baz'\n-----`), { colors: true, breakLength: 16 }),
    );
    expect(showBreak(Object(`foo\n"bar"\n'baz'\n-----`), { quoteStyle: "single" })).toEqual(
      trimIndent(String.raw`
        [String: 'foo\n' +
          '"bar"\n' +
          '\'baz\'\n' +
          '-----']
      `),
    );
  });

  it("should show long strings with ellipsis when `maxStringLength` is set", () => {
    expect(show(Object("abcdefghij"), { maxStringLength: 10 })).toEqual(`[String: "abcdefghij"]`);
    expect(inspect(Object("abcdefghij"), { maxStringLength: 10 })).toEqual(
      util.inspect(Object("abcdefghij"), { maxStringLength: 10 }),
    );
    expect(show(Object("abcdefghijk"), { maxStringLength: 10 })).toEqual(
      `[String: "abcdefghij"... 1 more character]`,
    );
    expect(inspect(Object("abcdefghijk"), { maxStringLength: 10 })).toEqual(
      util.inspect(Object("abcdefghijk"), { maxStringLength: 10 }),
    );
    expect(show(Object("abcdefghijklmnopqrstuvwxyz"), { maxStringLength: 10 })).toEqual(
      `[String: "abcdefghij"... 16 more characters]`,
    );
    expect(inspect(Object("abcdefghijklmnopqrstuvwxyz"), { maxStringLength: 10 })).toEqual(
      util.inspect(Object("abcdefghijklmnopqrstuvwxyz"), { maxStringLength: 10 }),
    );
    expect(showBreak(Object("foo\n\nb\r\nc--"), { maxStringLength: 10 })).toEqual(
      trimIndent(String.raw`
        [String: "foo\n" +
          "\n" +
          "b\r\n" +
          "c-"... 1 more character]
      `),
    );
    expect(inspect(Object("foo\n\nb\r\nc--"), { maxStringLength: 10 })).toEqual(
      util.inspect(Object("foo\n\nb\r\nc--"), { maxStringLength: 10 }),
    );
    expect(showBreak(Object(`foo\n"bar"\n'baz'\n-----`), { maxStringLength: 10 })).toEqual(
      trimIndent(String.raw`
        [String: "foo\n" +
          '"bar"\n'... 11 more characters]
      `),
    );
    expect(inspect(Object(`foo\n"bar"\n'baz'\n-----`), { maxStringLength: 10 })).toEqual(
      util.inspect(Object(`foo\n"bar"\n'baz'\n-----`), { maxStringLength: 10 }),
    );
  });

  it("should show strings with different quote styles", () => {
    expect(show(Object("foo"), { quoteStyle: "single" })).toEqual(`[String: 'foo']`);
    expect(show(Object("'foo'"), { quoteStyle: "single" })).toEqual(`[String: '\\'foo\\'']`);
    expect(show(Object("foo"), { quoteStyle: "double" })).toEqual(`[String: "foo"]`);
    expect(show(Object('"foo"'), { quoteStyle: "double" })).toEqual(`[String: "\\"foo\\""]`);
    expect(show(Object("foo"), { quoteStyle: "backtick" })).toEqual(`[String: \`foo\`]`);
    expect(show(Object("`foo`"), { quoteStyle: "backtick" })).toEqual(`[String: \`\\\`foo\\\`\`]`);

    expect(inspect(Object("foo"))).toEqual(`[String: 'foo']`);
    expect(inspect(Object("foo"))).toEqual(util.inspect(Object("foo")));
    expect(inspect(Object("'foo'"))).toEqual(`[String: "'foo'"]`);
    expect(inspect(Object("'foo'"))).toEqual(util.inspect(Object("'foo'")));
    expect(inspect(Object(`foo'bar"`))).toEqual(`[String: \`foo'bar"\`]`);
    expect(inspect(Object(`foo'bar"`))).toEqual(util.inspect(Object(`foo'bar"`)));
    expect(inspect(Object(`foo''bar"baz\``))).toEqual(`[String: 'foo\\'\\'bar"baz\`']`);

    expect(
      inspect(Object(`foo''bar"baz\``), { quoteStyle: ["double", "single", "backtick"] }),
    ).toEqual(`[String: "foo''bar\\"baz\`"]`);
    expect(
      inspect(Object(`foo''bar"baz\``), { quoteStyle: ["single", "double", "backtick"] }),
    ).toEqual(`[String: 'foo\\'\\'bar"baz\`']`);
    expect(
      inspect(Object(`foo''bar"baz\``), { quoteStyle: ["backtick", "single", "double"] }),
    ).toEqual(`[String: \`foo''bar"baz\\\`\`]`);
  });

  it("should show subclass of `String`", () => {
    class MyString extends String {
      constructor(...args: any[]) {
        super(...args);
      }
    }

    expect(show(new MyString("foo"))).toEqual('[String (MyString): "foo"]');
    expect(inspect(new MyString("foo"))).toEqual(util.inspect(new MyString("foo")));
    expect(inspect(new MyString("foo"), { colors: true })).toEqual(
      util.inspect(new MyString("foo"), { colors: true }),
    );
  });

  it("should show wrapper object for strings with `Symbol.toStringTag`", () => {
    const shortStr = Object.defineProperty(new String("foo"), Symbol.toStringTag, { value: "Bar" });
    const longStr = Object.defineProperty(
      new String(
        "foo\nbar\nbaz\n-------------------------------------------------------------------------",
      ),
      Symbol.toStringTag,
      { value: "Bar" },
    );

    expect(show(shortStr)).toEqual(`[String: "foo"] [Bar]`);
    expect(inspect(shortStr)).toEqual(util.inspect(shortStr));
    expect(inspect(shortStr, { colors: true })).toEqual(util.inspect(shortStr, { colors: true }));

    expect(show(longStr, { indent: 2 })).toEqual(
      trimIndent(String.raw`
        [String: "foo\n" +
          "bar\n" +
          "baz\n" +
          "-------------------------------------------------------------------------"] [Bar]
      `),
    );
    expect(inspect(longStr)).toEqual(util.inspect(longStr));
    expect(inspect(longStr, { colors: true })).toEqual(util.inspect(longStr, { colors: true }));
  });
});
