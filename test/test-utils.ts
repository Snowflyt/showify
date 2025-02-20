import type { ShowOptions } from "../src";
import { show } from "../src";

/**
 * An `inspect` function that uses `show` with default options close to Node.js `util.inspect`.
 * @param value The value to show.
 * @param options The options to pass to `show`.
 * @returns The string representation of the value.
 */
export function inspect(value: unknown, options?: ShowOptions) {
  return show(value, {
    depth: 2,
    indent: 2,
    quoteStyle: ["single", "double", "backtick"],
    arrayBracketSpacing: true,
    maxArrayLength: 100,
    maxStringLength: 10000,
    ...options,
  });
}

/**
 * A Kotlin-like `trimIndent` function that removes the common indent from all lines.
 * @param str The string to trim.
 * @returns The trimmed string.
 */
export function trimIndent(str: string) {
  const lines = str.split("\n");
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue;
    const indent = line.search(/\S/);
    if (indent !== -1) minIndent = Math.min(minIndent, indent);
  }
  return lines
    .map((line) => line.slice(minIndent))
    .join("\n")
    .trim();
}
