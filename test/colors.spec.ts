import { describe, expect, it } from "vitest";

import type { Serializer } from "../src";
import { Node, show } from "../src";

let c: Parameters<Serializer["then"]>[1]["c"];
show(
  {},
  {
    colors: true,
    serializers: [
      {
        if: (value) => !!value,
        then: (_, { c: _c }) => {
          c = _c;
          return Node.text("{}");
        },
      },
    ],
  },
);

describe("Colors", () => {
  it("should colorize a string with ANSI escape codes", () => {
    /* Modifiers */
    expect(c.bold("---")).toEqual("\x1b[1m---\x1b[22m");
    expect(c.dim("---")).toEqual("\x1b[2m---\x1b[22m");
    expect(c.reset("---")).toEqual("\x1b[0m---\x1b[0m");

    /* Colors */
    expect(c.black("---")).toEqual("\x1b[30m---\x1b[39m");
    expect(c.blue("---")).toEqual("\x1b[34m---\x1b[39m");
    expect(c.cyan("---")).toEqual("\x1b[36m---\x1b[39m");
    expect(c.gray("---")).toEqual("\x1b[90m---\x1b[39m");
    expect(c.green("---")).toEqual("\x1b[32m---\x1b[39m");
    expect(c.magenta("---")).toEqual("\x1b[35m---\x1b[39m");
    expect(c.red("---")).toEqual("\x1b[31m---\x1b[39m");
    expect(c.white("---")).toEqual("\x1b[37m---\x1b[39m");
    expect(c.yellow("---")).toEqual("\x1b[33m---\x1b[39m");
  });

  it("should change colors in a custom serializer", () => {
    const obj = {
      a: 42,
      b: "foo",
      c: { "no-color": true, e: "bar" },
      d: { "change-color": true, f: "baz", g: 42n },
    };

    expect(
      show(obj, {
        colors: true,
        serializers: [
          {
            if: (value) => value["no-color"],
            then: (value, _, expand) => {
              const obj = { ...value };
              delete obj["no-color"];
              return expand(obj, { colors: false });
            },
          },
          {
            if: (value) => value["change-color"],
            then: (value, _, expand) => {
              const obj = { ...value };
              delete obj["change-color"];
              return expand(obj, { styles: { string: "magenta" } });
            },
          },
        ],
      }),
    ).toEqual(
      '{ a: \x1b[33m42\x1b[39m, b: \x1b[32m"foo"\x1b[39m, c: { e: "bar" }, d: { f: \x1b[35m"baz"\x1b[39m, g: \x1b[33m42n\x1b[39m } }',
    );
  });
});
