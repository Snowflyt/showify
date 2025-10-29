/* eslint-disable @typescript-eslint/class-literal-property-style */

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
    class MyRegExp extends RegExp {}

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

  it("should syntax highlight regular expressions", () => {
    // Comprehensive set of regexes covering branches in highlightRegExp
    // Copied from Node.js tests (test/parallel/test-util-inspect-regexp.js)
    // See: https://github.com/nodejs/node/blob/77a0a0fc6029cc9499559c2268095377f68b08ba/test/parallel/test-util-inspect-regexp.js
    /* eslint-disable */
    const regexps = [
      /a/,
      /a|b/,
      /^$/,
      /^(?<year>\d{4})-(?<mon>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\d|3[01])$/u,
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/,
      /\b(?<!\$)\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/,
      /\b\w+(?=\s*:\s)/,
      /^(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[A-Za-z]{2,}(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?$/,
      /^(?<ip>(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3})$/,
      /^(?<h>[0-1]?\d|2[0-3]):(?<m>[0-5]\d)(?::(?<s>[0-5]\d))?$/,
      /^(?:(?!cat).)*$/s,
      /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/,
      /\b(0[xX])(?<hex>[0-9A-Fa-f]+)\b/,
      /\b(?<num>\d+)\.(?<frac>\d+)\b/,
      /\b([A-Za-z]+)\s+\1\b/i,
      /^([A-Za-z]\w*)(?:\s*,\s*\1)*$/,
      /^\s*(?!<\/?script\b).*<\/?[A-Za-z][^>]*>\s*$/is,
      /^(?:\r\n|[\n\r\u2028\u2029])+$/,
      /^(?<oct>[0-7]+)$|^(?<bin>[01]+)b$|^(?<hex>[0-9A-Fa-f]+)h$/,
      /^(?!.*(.)\1\1)[A-Za-z0-9]{8,}$/,
      /\b(?:(?:19|20)\d{2})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b(?![^<]*>)/,
      /^(?<user>[A-Za-z0-9._%+-]+)@(?<host>[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/,
      /^\$(?<amt>\d{1,3}(?:,\d{3})*(?:\.\d{2})?)$/,
      /\b(?<area>\d{3})-(?<ex>\d{3})-(?<line>\d{4})\b/,
      /^(?<open><([A-Za-z][A-Za-z0-9:-]*)\b[^>]*>)(?<inner>[\s\S]*?)<\/\2>$/,
      /^(?=.*\b(cat|dog)\b)(?=.*\b(red|blue)\b).+$/i,
      /^[-+]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?(?:[eE][-+]?\d+)?$/,
      /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?\d{2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/,
      /^(?:0|[1-9]\d*)(?:\.\d+)?(?:(?:e|E)[-+]?\d+)?$/,
      /\b(?<maj>\d+)\.(?<min>\d+)\.(?<patch>\d+)(?:-(?<pre>[0-9A-Za-z.-]+))?(?:\+(?<build>[0-9A-Za-z.-]+))?\b/,
      /^#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?$/,
      /\b(?:https?):\/\/(?:(?!\/{2,})[^\s])+\b/,
      /^(?:(?!.*\b(foo).*\b\1\b).)*$/s,
      /^(?<sign>[-+])?(?:Infinity|NaN|\d+(?:\.\d+)?)(?=\s*$)/,
      /^(?=.*\d)(?=.*[^\x61-\x7F])(?=.*[A-Za-z]).{8,}$/u,
      /^\p{Lu}\p{Ll}+(?:\s\p{Lu}\p{Ll}+)+$/u,
      /^(?<emoji>\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u,
      /^[\p{Script=Greek}\p{Nd}]+$/u,
      /^(?=.*\p{Extended_Pictographic}).{1,140}$/su,
      /^(?:\[(?:[^\]\\]|\.)*]|"(?:[^"\\]|\\.)*")$/,
      /^(?<quote>["'])(?:\.|(?!\k<quote>)[\s\S])*\k<quote>$/,
      /^(?:[A-Za-z_]\w*|\$[A-Za-z_]\w*)$/,
      /^((?:.\.\/)+)(?!\.)[A-Za-z0-9._/-]+$/,
      /^(?!.*\b(\w{3,})\b.*\b\1\b)[A-Za-z\s]+$/i,
      /^(?:[A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/,
      /^\[(?<ts>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)\]\s(?<lvl>INFO|WARN|ERROR)\s(?<msg>.*)$/,
      /^(?<lhs>\w+)\s*(?<op>\+=|-=|\*\*=|<<=)\s*(?<rhs>[^;]+);$/,
      /^(?<scheme>[a-z][a-z0-9+-.]*):(?<rest>\/\/[^?#\s]+(?:\?[^#\s]*)?(?:#[^\s]*)?|[^/\s][^\s]*)$/i,
      /^(?:[\p{Letter}\p{Mark}\p{Number}._-]+)@(?:[\p{Letter}\p{Number}\p{Mark}.-]+)\.[\p{Letter}]{2,}$/u,
      /^[\p{Alphabetic}&&\p{ASCII}]+$/v,
      /(a)/,
      /(?:a)/,
      /(?=a)/,
      /(?!a)/,
      /(?<=a)/,
      /(?<!a)/,
      /(?<name>a)/,
      /(?<name>a)\k<name>/,
      /\p{Letter}+/u,
      /[\u{1F600}-\u{1F601}]/u,
      /\x61/,
      /\u{1F600}/u,
      /[a-z-]/,
      /[a-z-]/,
      /.{2,3}?abc?/,
      /a{2}/,
      /\d/,
      /[^a-z\d\u{1F600}-\u{1F601}]/u,
      /(?<year>\d{4})-\d{2}|\d{2}-(?<year>\d{4})/,
      /(?<=Mr\.|Mrs.)\s[A-Z]\w+/,
      /a/giu,
      // @ts-expect-error - testing invalid flags
      /\p{Let(?<quote>["'])(?:\.|(?!\k<quote>)[\s\S])*\k<quote>$/,
      /^p{Lu}p{Ll}+(?:sp{Lu}p{Ll}+)+$/,
    ];
    /* eslint-enable */

    for (const re of regexps) {
      expect(inspect(re)).toEqual(util.inspect(re));
      expect(inspect(re, { colors: true })).toEqual(util.inspect(re, { colors: true }));
    }
  });
});
