import * as util from "node:util";

import { type } from "arktype";
import { describe, expect, it } from "vitest";

import { inspect } from "./test-utils";

const normalize = (s: string) => {
  const lines = s.split("\n");

  for (let i = 0; i < lines.length; i++) {
    // util.inspect prints property names containing '$' (e.g., $ or arg$) with quotes
    // To avoid false negatives when comparing to util.inspect,
    // normalize both outputs by unquoting such property names
    lines[i] = lines[i]!.replace(
      // eslint-disable-next-line no-control-regex, sonarjs/slow-regex
      /(\s*)(?:\x1b\[[0-9;]*m)*'([A-Za-z_$][A-Za-z0-9_$]*)'(?:\x1b\[[0-9;]*m)*:\s/,
      "$1$2: ",
    );

    // Remove all <ref *\d+> since util.inspect sometimes doesn't include them
    // We already test reference handling elsewhere
    // eslint-disable-next-line no-control-regex
    lines[i] = lines[i]!.replace(/(?:\x1b\[[0-9;]*m)*<ref \*\d+>(?:\x1b\[[0-9;]*m)* /g, "");
  }

  return lines.join("\n");
};

describe("Performance", () => {
  it("should show very large objects within reasonable time", () => {
    // util.inspect may not wrap exactly at breakLength,
    // so we slightly reduce it to keep our output consistent with util.inspect
    expect(normalize(inspect(type))).toEqual(normalize(util.inspect(type, { breakLength: 78 })));
    expect(normalize(inspect(type, { colors: true }))).toEqual(
      normalize(util.inspect(type, { colors: true, breakLength: 78 })),
    );
  });
});
