/**
 * Options for {@link show}.
 */
export interface ShowOptions {
  /**
   * Whether to call `toJSON` on the value before stringifying it (if available).
   * @default false
   */
  callToJSON?: boolean;
  /**
   * Whether to call `Symbol.for("nodejs.util.inspect.custom")` on the value before stringifying it
   * (if available). This option takes precedence over `callToJSON`.
   * @default true
   */
  callNodeInspect?: boolean;
  /**
   * Whether to call `Symbol.for("showify.inspect.custom")` on the value before stringifying it
   * (if available). This option takes precedence over `callToJSON` and `callNodeInspect`.
   * @default true
   */
  callCustomInspect?: boolean;
  /**
   * The maximum depth to show.
   * @default Infinity
   */
  depth?: number;
  /**
   * The number of spaces to use for indentation.
   * @default 0
   */
  indent?: number;
  /**
   * The maximum line length before breaking. If `indent` is `0`, this option is ignored.
   * @default 80
   */
  breakLength?: number;
  /**
   * Whether to show non-enumerable properties, should be `"none"`, `"always"`, or `"exclude-meta"`.
   *
   * For compatibility with Node.js’s `util.inspect`, `true` is also accepted as `"always"`, and
   * `false` is also accepted as `"none"`, but it is recommended to use the string values for
   * clarity.
   *
   * If this option is set to `"exclude-meta"`, it behaves the same as `"always"`, but the following
   * “meta” properties are excluded:
   *
   * - `name` and `length` for callables.
   * - “Regular” `prototype` for callables, which is one of the following:
   *   - If the callable is an instance of `Function`, its `prototype` has only one own property
   *     which is `constructor`, the `constructor` is the callable itself, and the [[Prototype]] of
   *     the `prototype` property is `Object.prototype`, then it is excluded.
   *   - If the callable is an instance of `GeneratorFunction`, its `prototype` has no properties,
   *     and the [[Prototype]] of the `prototype` property is
   *    `GeneratorFunction.prototype.prototype`, then it is excluded.
   *   - If the callable is an instance of `AsyncGeneratorFunction`, its `prototype` has no
   *     properties, and the [[Prototype]] of the `prototype` property is
   *     `AsyncGeneratorFunction.prototype.prototype`, then it is excluded.
   *   - (Async functions do not have a `prototype` property, so they are not affected.)
   * - `length` for arrays and typed arrays.
   * @default "none"
   */
  showHidden?: "none" | "always" | "exclude-meta" | boolean;
  /**
   * Whether to inspect getters.
   *
   * - If set to `"none"`, getters are not inspected, only shown as `[Getter]` or `[Getter/Setter]`.
   * - If set to `"get"`, only getters without a corresponding setter are inspected.
   * - If set to `"set"`, only setters with a corresponding getter are inspected.
   * - If set to `"all"`, all getters are inspected.
   *
   * For compatibility with Node.js’s `util.inspect`, `true` is also accepted as `"always"`, and
   * `false` is also accepted as `"none"`, but it is recommended to use the string values for
   * clarity.
   * @default "none"
   */
  getters?: "none" | "get" | "set" | "all" | boolean;
  /**
   * Whether to sort the keys of objects (including `Map`s and `Set`s) in the resulting string.
   */
  sorted?: boolean;
  /**
   * A set of keys to omit from the output.
   *
   * NOTE: This option is not recursive and only omits the top-level keys.
   */
  omittedKeys?: Set<string | symbol>;
  /**
   * The quote style to use for strings.
   * @default ["double", "single", "backtick"]
   */
  quoteStyle?: QuoteStyle;
  /**
   * Whether to add quote around keys in objects. If set to `"auto"`, it will add quotes only when
   * the key is not a valid identifier.
   * @default "auto"
   */
  quoteKeys?: "auto" | "always";
  /**
   * Whether to add separators as thousands separators in numbers (including BigInts). If not set to
   * `"none"`, it will use the provided string as the separator, e.g., `","` or `"_"`.
   *
   * For compatibility with Node.js’s `util.inspect`, `true` is also accepted as `"_"`, and `false`
   * is also accepted as `"none"`, but it is recommended to use the string values for clarity.
   * @default "none"
   */
  numericSeparator?: "none" | (string & {}) | boolean;
  /**
   * Whether to add a trailing comma to the last item in an array or object. If set to `"auto"`, it
   * will add a trailing comma if the last item is on a separate line.
   * @default "none"
   */
  trailingComma?: "none" | "auto" | "always";
  /**
   * Whether to add spaces inside array brackets.
   * @default false
   */
  arrayBracketSpacing?: boolean;
  /**
   * Whether to add spaces inside object curly braces.
   * @default true
   */
  objectCurlySpacing?: boolean;
  /**
   * Whether to add a reference pointer to circular references. If set to `false`, circular
   * references are displayed as `[Circular]`.
   * @default true
   */
  referencePointer?: boolean;
  /**
   * The maximum length of an array to show. If the array is longer than this length, it will be
   * truncated and an ellipsis with the length of the truncation (e.g., `[1, 2, ... 3 more items]`)
   * will be shown.
   * @default Infinity
   */
  maxArrayLength?: number;
  /**
   * The maximum length of a string to show. If the string is longer than this length, it will be
   * truncated and an ellipsis with the length of the truncation (e.g., "'aa'... 3 more characters")
   * will be shown.
   * @default Infinity
   */
  maxStringLength?: number;
  /**
   * Whether to colorize the output with ANSI codes.
   */
  colors?: boolean;
  /**
   * Colors for different types of values.
   * @default { string: "green", symbol: "green", number: "yellow", bigint: "yellow", boolean: "yellow", null: "bold", undefined: "gray", date: "magenta", regexp: highlightRegExp, special: "cyan" }
   */
  styles?: Partial<Styles>;
  /**
   * An array of `{ if: (value) => boolean, then: (value, options, expand) => Node }` objects to
   * handle custom cases.
   *
   * NOTE: These custom serializers are only invoked for objects, primitives are not passed to them.
   */
  serializers?: readonly Serializer[];
}
type QuoteStyle =
  | "single"
  | "double"
  | "backtick"
  | ["single", "double", "backtick"]
  | ["double", "single", "backtick"]
  | ["single", "backtick", "double"]
  | ["double", "backtick", "single"]
  | ["backtick", "single", "double"]
  | ["backtick", "double", "single"]
  | ["single", "double"]
  | ["double", "single"]
  | ["single", "backtick"]
  | ["backtick", "single"]
  | ["double", "backtick"]
  | ["backtick", "double"];
interface Styles {
  readonly string: colorize.Color | ((s: string) => string);
  readonly symbol: colorize.Color | ((s: string) => string);
  readonly number: colorize.Color | ((s: string) => string);
  readonly bigint: colorize.Color | ((s: string) => string);
  readonly boolean: colorize.Color | ((s: string) => string);
  readonly null: colorize.Color | ((s: string) => string);
  readonly undefined: colorize.Color | ((s: string) => string);
  readonly date: colorize.Color | ((isoString: string) => string);
  readonly regexp: colorize.Color | ((regexpString: string) => string);
  readonly special: colorize.Color | ((s: string) => string);
}
export interface Serializer {
  if: (value: object, options: SerializerOptions) => boolean;
  then: (
    value: object,
    options: SerializerOptions,
    expand: (value: unknown, options?: Partial<SerializerOptions>) => Node,
  ) => Node;
}
export type SerializerOptions =
  Omit<Required<ShowOptions>, "indent" | "breakLength" | "referencePointer"> & {
    level: number;
    ancestors: readonly object[];
    c: ReturnType<typeof colorize.buildC>;
  } extends infer R ?
    // Expand the type to human-readable format in TypeScript
    { [K in keyof R]: R[K] }
  : never;
type RequiredShowOptions = {
  [K in keyof Required<ShowOptions>]-?: K extends "styles" ? Styles : Required<ShowOptions>[K];
};

/**
 * Helper function to create a serializer for a specific type.
 *
 * This function just returns the given serializer as is, and is only used to make TypeScript happy.
 * @param serializer The serializer function.
 * @returns
 */
export function serializer<T extends object>(serializer: {
  if: (value: object, options: SerializerOptions) => value is T;
  then: (
    value: T,
    options: SerializerOptions,
    expand: (value: unknown, options?: Partial<SerializerOptions>) => Node,
  ) => Node;
}): Serializer;
export function serializer(serializer: Serializer): Serializer;
export function serializer(serializer: Serializer): Serializer {
  return serializer;
}

/**
 * Stringify a value just like `util.inspect` in Node.js, handling almost all cases that you might
 * encounter, including auto line breaking, indentation, terminal colors, circular references (with
 * reference numbers), classes, wrapper objects, `Map`, array empty items, typed arrays, `Date`,
 * `RegExp`, `Error`, `Promise`, and more.
 * @param value The value to stringify.
 * @param options The options for stringification.
 * @returns The stringified value.
 *
 * @example
 * ```javascript
 * const value = {
 *   foo: "bar",
 *   "Hello\nworld": [-0, 2n, NaN],
 *   [Symbol("qux")]: { quux: "corge" },
 *   map: new Map([
 *     ["foo", "bar"],
 *     [{ bar: 42 }, "qux"],
 *   ]),
 * };
 * value.circular = value;
 *
 * console.log(show(value, { indent: 2, trailingComma: "auto", colors: true }));
 * // <ref *1> {
 * //   foo: "bar",
 * //   "Hello\nworld": [-0, 2n, NaN],
 * //   map: Map(2) { "foo" => "bar", { bar: 42 } => "qux" },
 * //   circular: [Circular *1],
 * //   Symbol(qux): { quux: "corge" },
 * // }
 * ```
 */
export function show(value: unknown, options: ShowOptions = {}): string {
  const refs = new Map<object, number>();
  const getDefaultOptions = () =>
    (show as unknown as { defaultOptions: RequiredShowOptions }).defaultOptions;
  const defaultOptions = getDefaultOptions();
  const fullOptions = Object.assign({}, defaultOptions, options, {
    styles: Object.assign({}, defaultOptions.styles, options.styles),
  });
  const tree = buildTree(
    value,
    Object.assign({}, fullOptions, {
      level: 0,
      ancestors: [],
      refs,
      c: colorize.buildC(fullOptions.colors, fullOptions.styles),
    }),
  );
  return stringify(
    tree,
    Object.assign({}, fullOptions, {
      level: 0,
      forceWrap: false,
      restLineLength: fullOptions.breakLength,
      refs,
    }),
  );
}
export declare namespace show {
  let defaultOptions: RequiredShowOptions;
}
Object.defineProperty(show, "defaultOptions", {
  get: (): RequiredShowOptions => ({
    callToJSON: false,
    callNodeInspect: true,
    callCustomInspect: true,
    depth: Infinity,
    indent: 0,
    breakLength: 80,
    showHidden: "none",
    getters: "none",
    sorted: false,
    omittedKeys: new Set(),
    quoteStyle: ["double", "single", "backtick"],
    quoteKeys: "auto",
    numericSeparator: "none",
    trailingComma: "none",
    arrayBracketSpacing: false,
    objectCurlySpacing: true,
    referencePointer: true,
    maxArrayLength: Infinity,
    maxStringLength: Infinity,
    colors: false,
    styles: {
      string: "green",
      symbol: "green",
      number: "yellow",
      bigint: "yellow",
      boolean: "yellow",
      null: "bold",
      undefined: "gray",
      date: "magenta",
      regexp: highlightRegExp,
      special: "cyan",
    },
    serializers: [],
  }),
});

/**
 * Stringify a tree structure of {@link Node}s into a string.
 * @param node The root node of the tree.
 * @param options The options for stringification.
 * @returns The stringified value.
 */
function stringify(
  node: Node,
  options: RequiredShowOptions & {
    level: number;
    forceWrap: boolean;
    restLineLength: number;
    refs: Map<object, number>;
  },
): string {
  const { type } = node;
  const {
    breakLength,
    colors,
    forceWrap,
    indent,
    level,
    referencePointer,
    refs,
    restLineLength: originalRestLineLength,
    styles,
  } = options;

  if (type === "circular") {
    const str = referencePointer ? `[Circular *${refs.get(node.ref)!}]` : "[Circular]";
    return colors ? colorize(str, styles.special) : str;
  }

  /* Handle nodes start */
  let result = "";

  const restLineLength = () =>
    !result.includes("\n") ?
      options.restLineLength - result.length
    : breakLength - result.slice(result.lastIndexOf("\n") + 1).length;

  // text
  if (type === "text") {
    const { value } = node;
    result = value;
  }

  // variant
  else if (type === "variant") {
    const { inline, wrap } = node;

    if (!forceWrap) {
      options.indent = 0;
      result = stringify(inline, options);
      options.indent = indent;
    }

    if (forceWrap || (indent && cleanANSI(result).length > originalRestLineLength)) {
      options.forceWrap = true;
      options.restLineLength = restLineLength();
      result = stringify(wrap, options);
      options.forceWrap = forceWrap;
      options.restLineLength = originalRestLineLength;
    }
  }

  // sequence
  else if (type === "sequence") {
    const { values } = node;

    if (!forceWrap) {
      options.indent = 0;
      result = "";
      for (const value of values) result += stringify(value, options);
      options.indent = indent;
    }

    if (forceWrap || (indent && cleanANSI(result).length > originalRestLineLength)) {
      // Optimize restLineLength() usage by tracking current line length incrementally
      options.forceWrap = true;
      result = "";
      let currentLineLen = breakLength - options.restLineLength;
      for (const value of values) {
        options.restLineLength = breakLength - currentLineLen;
        const part = stringify(value, options);
        result += part;
        const nl = part.lastIndexOf("\n");
        currentLineLen = nl === -1 ? currentLineLen + part.length : part.length - (nl + 1);
      }
      options.forceWrap = forceWrap;
      options.restLineLength = originalRestLineLength;
    }
  }

  // between
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (type === "between") {
    const { close, open, values } = node;

    if (!forceWrap) {
      options.indent = 0;
      result = "";
      if (open) result += stringify(open, options);
      for (const val of values) result += stringify(val, options);
      if (close) result += stringify(close, options);
      options.indent = indent;
    }

    if (forceWrap || (indent && cleanANSI(result).length > originalRestLineLength)) {
      // Special-case: group array elements into columns like util.inspect
      result =
        (indent &&
          values.length > 6 && // Only group if there are more than 6 items
          open &&
          close &&
          open.type === "text" &&
          close.type === "text" &&
          open.value === "[" &&
          close.value === "]" &&
          groupArrayElements(values, options)) ||
        "";
      if (!result) {
        // Optimize restLineLength() by maintaining the current line length
        // without scanning the whole result each time
        options.forceWrap = false;
        if (open) result = stringify(open, options);
        let currentLineLen = breakLength - options.restLineLength;
        if (result) {
          const nlOpen = result.lastIndexOf("\n");
          currentLineLen =
            nlOpen === -1 ? currentLineLen + result.length : result.length - (nlOpen + 1);
        }
        options.level = level + 1;
        for (let i = 0; i < values.length; i++) {
          const value = values[i]!;
          if (i !== 0 || result) {
            const pad = " ".repeat((level + 1) * indent);
            result += "\n" + pad;
            currentLineLen = pad.length;
          }
          options.restLineLength = breakLength - currentLineLen;
          const part = stringify(value, options);
          result += part;
          const nl = part.lastIndexOf("\n");
          currentLineLen = nl === -1 ? currentLineLen + part.length : part.length - (nl + 1);
        }
        options.level = level;
        if (close) {
          options.restLineLength = breakLength - currentLineLen;
          const after = stringify(close, options);
          if (values.length) {
            const pad = " ".repeat(level * indent);
            result += "\n" + pad + after;
          } else {
            result += after;
          }
        }
        options.forceWrap = forceWrap;
        options.restLineLength = originalRestLineLength;
      }
    }
  }
  /* Handle nodes end */

  // Add reference pointer if available
  if (referencePointer && "ref" in node && node.ref) {
    const pointer = refs.get(node.ref);
    if (pointer) {
      const str = `<ref *${pointer}>`;
      result = (colors ? colorize(str, styles.special) : str) + " " + result;
    }
  }

  return result;
}

/**
 * Render an array body by grouping items into columns similar to Node.js’s `util.inspect`.
 * Returns `null` if grouping should not be applied (falls back to default rendering).
 *
 * Adapted from the `groupArrayElements` function in Node.js’s `util.inspect` implementation:
 * <https://github.com/nodejs/node/blob/fdcf4d9454f050d199c49ff25f25d7bad133ff56/lib/internal/util/inspect.js#L2025-L2133>
 * @param nodes The array of nodes representing the items in the array.
 * @param options The options for stringification.
 * @returns The grouped multiline string or `null` if grouping is not applied.
 */
function groupArrayElements(
  nodes: Node[],
  options: Parameters<typeof stringify>[1],
): string | null {
  const { breakLength, indent, level } = options;

  nodes = nodes.slice();
  const extraNodes: Node[] = [];

  // Separate trailing "... n more items" if present
  const last = nodes[nodes.length - 1];
  if (last && last.type === "text" && cleanANSI(last.value).startsWith("... "))
    extraNodes.unshift(nodes.pop()!);

  // Extract base node (without trailing comma) and remember original trailing-comma
  const items = nodes.map((node) =>
    (
      node.type === "sequence" &&
      node.values.length === 2 &&
      node.values[1]!.type === "text" &&
      node.values[1]!.value === ","
    ) ?
      { base: node.values[0]!, hasComma: true }
    : { base: node, hasComma: false },
  );

  // Render each base node inline
  const noIndentOptions = Object.assign({}, options, { indent: 0 });
  const out = Array(items.length) as string[];
  const dataLen = Array(items.length) as number[];
  let totalLength = 0;
  let maxLength = 0;
  const separatorSpace = 2; // 1 for comma, 1 for space
  for (let i = 0; i < items.length; i++) {
    const s = stringify(items[i]!.base, noIndentOptions);
    out[i] = s;
    const len = cleanANSI(s).length;
    dataLen[i] = len;
    totalLength += len + separatorSpace;
    if (len > maxLength) maxLength = len;
  }

  const actualMax = maxLength + separatorSpace;
  const currentIndent = (level + 1) * indent;
  // At least three entries per row and avoid huge gaps
  if (
    !(
      actualMax * 3 + currentIndent < breakLength &&
      (totalLength / actualMax > 5 || maxLength <= 6)
    )
  )
    return null;

  // Decide columns
  const approxCharHeights = 2.5;
  const averageBias = Math.sqrt(actualMax - totalLength / items.length);
  const biasedMax = Math.max(actualMax - 3 - averageBias, 1);
  // Dynamically check how many columns seem possible.
  const columns = Math.min(
    // Ideally a square should be drawn. We expect a character to be about 2.5 times as high as wide
    // This is the area formula to calculate a square which contains n rectangles of size `actualMax * approxCharHeights`
    // Divide that by `actualMax` to receive the correct number of columns
    // The added bias increases the columns for short entries
    Math.round(Math.sqrt(approxCharHeights * biasedMax * items.length) / biasedMax),
    // Do not exceed breakLength
    Math.floor((breakLength - currentIndent) / actualMax),
    // Limit the columns to a maximum of twelve
    12,
  );
  if (columns <= 1) return null;

  // Compute per-column max printable length (plus separator slot)
  const maxLineLength = Array(columns) as number[];
  for (let i = 0; i < columns; i++) {
    let lineMax = 0;
    for (let j = i; j < items.length; j += columns) lineMax = Math.max(lineMax, dataLen[j]!);
    maxLineLength[i] = lineMax + separatorSpace;
  }

  // Numeric right-align if all look numeric; otherwise left-align
  let pad = padStart;
  for (const s of out)
    if (!isNumericLike(cleanANSI(s).trim())) {
      pad = padEnd;
      break;
    }

  // Build grouped lines
  const lines: string[] = [];
  for (let i = 0; i < items.length; i += columns) {
    const max = Math.min(i + columns, items.length);
    let line = "";
    let j = i;
    for (; j < max - 1; j++)
      line += pad(out[j]! + ", ", maxLineLength[j - i]! + out[j]!.length - dataLen[j]!);
    line +=
      pad === padStart ?
        pad(out[j]!, maxLineLength[j - i]! + out[j]!.length - dataLen[j]! - separatorSpace)
      : out[j]!;
    if (items[j]!.hasComma) line += ",";
    lines.push(line);
  }

  const padPrefix = " ".repeat((level + 1) * indent);
  let result = "[";
  for (const line of lines) result += "\n" + padPrefix + line;
  for (const node of extraNodes) result += "\n" + padPrefix + stringify(node, options);
  return result + "\n" + " ".repeat(level * indent) + "]";
}

class MaximumDepthError extends Error {}

/**
 * Build a tree structure of {@link Node}s from a value.
 * @param value The value to build a tree from.
 * @param depth The current depth of the tree.
 * @param options The options for building the tree.
 * @returns The root node of the tree.
 */
function buildTree(
  value: unknown,
  options: Omit<SerializerOptions, "styles"> & {
    refs: Map<object, number>;
    styles: Styles;
    c: ReturnType<typeof colorize.buildC>;
    breakLength: number; // Only used for Node.js compatibility
    referencePointer: boolean; // Only used for Node.js compatibility
  },
): Node {
  const {
    ancestors,
    arrayBracketSpacing,
    c,
    callCustomInspect,
    callNodeInspect,
    callToJSON,
    colors,
    getters,
    maxArrayLength,
    maxStringLength,
    numericSeparator,
    objectCurlySpacing,
    omittedKeys: _omittedKeys,
    quoteKeys,
    quoteStyle,
    refs,
    serializers,
    showHidden,
    sorted,
    trailingComma,
  } = options;
  const omittedKeys = new Set(_omittedKeys);

  /* Primitive values */
  if (value === undefined) return text(c.undefined("undefined"));
  if (value === null) return text(c.null("null"));
  if (typeof value === "string") {
    const truncated = value.length > maxStringLength;
    const truncatedStr = truncated ? value.slice(0, maxStringLength) : value;
    const ellipsis =
      truncated ?
        `... ${value.length - maxStringLength} more character` +
        (value.length - maxStringLength === 1 ? "" : "s")
      : "";

    const inline = (value: string, ellipsis = "") =>
      text(c.string(stringifyString(value, quoteStyle)) + ellipsis);

    if (!truncatedStr.includes("\n")) return inline(truncatedStr, ellipsis);

    let rest = truncatedStr;
    let parts: ReturnType<typeof text>[] = [];
    let index: number;
    while (((index = rest.indexOf("\n")), index !== -1)) {
      parts.push(inline(rest.slice(0, index + 1)));
      rest = rest.slice(index + 1);
    }
    if (rest) parts.push(inline(rest));
    parts = parts.map((node, i) =>
      i !== parts.length - 1 ? Object.assign({}, node, { value: node.value + " +" }) : node,
    );
    if (ellipsis) parts[parts.length - 1]!.value += ellipsis;
    return variant(inline(truncatedStr, ellipsis), between(parts));
  }
  if (typeof value === "symbol") return text(c.symbol(value));
  if (typeof value === "number") return text(c.number(stringifyNumber(value, numericSeparator)));
  if (typeof value === "bigint") return text(c.bigint(stringifyNumber(value, numericSeparator)));
  if (typeof value === "boolean") return text(c.boolean(value));

  /* Helper functions */
  const expand = (v: unknown, opts: Partial<SerializerOptions> = {}) => {
    // Mutate `options` in-place for performance, but restore original values after expansion
    const prev = {} as typeof options;

    // Always give nested call its own omittedKeys set
    prev.omittedKeys = options.omittedKeys;
    options.omittedKeys = opts.omittedKeys || new Set();

    // Merge styles if provided, otherwise keep existing styles
    if (opts.styles) {
      prev.styles = options.styles;
      options.styles = Object.assign({}, options.styles, opts.styles) as Styles;
    }

    // Apply any other option overrides from `opts`, saving previous values
    for (const k in opts) {
      if (k === "styles" || k === "omittedKeys") continue;
      // Save previous value only once
      if (!(k in prev)) (prev as any)[k] = (options as any)[k];
      (options as any)[k] = (opts as any)[k];
    }

    // level and ancestors are always adjusted for nested expansion
    prev.level = options.level;
    options.level++;
    prev.ancestors = options.ancestors;
    options.ancestors = ancestors.concat([value]);

    // Rebuild colorizer if colors or styles changed
    prev.c = options.c;
    prev.colors = options.colors;
    if (options.colors !== prev.colors || options.styles !== prev.styles)
      options.c = colorize.buildC(options.colors, options.styles);

    try {
      if (options.level > options.depth + 1) throw new MaximumDepthError();
      return buildTree(v, options);
    } finally {
      // Restore previous values
      for (const k in prev) (options as any)[k] = (prev as any)[k];
    }
  };

  /* Objects (including functions and arrays) */
  if (isObject(value)) {
    /* Circular structures */
    // If circular reference is found, return a special node with a reference pointer
    if (ancestors.indexOf(value) !== -1) {
      if (!refs.has(value)) refs.set(value, refs.size + 1);
      return circular(value);
    }

    const className = getClassName(value);

    try {
      /* Custom serializers */
      for (const { if: predicate, then: serializer } of serializers)
        if (predicate(value, options)) {
          const newOptions = {
            callToJSON,
            callNodeInspect,
            callCustomInspect,
            depth: options.depth,
            showHidden,
            getters,
            sorted,
            omittedKeys,
            quoteStyle,
            quoteKeys,
            numericSeparator,
            trailingComma,
            arrayBracketSpacing,
            objectCurlySpacing,
            maxArrayLength,
            maxStringLength,
            colors,
            styles: options.styles,
            serializers,
            level: options.level + 1,
            ancestors,
            c,
          } satisfies SerializerOptions;
          return Object.assign({}, serializer(value, newOptions, expand), { ref: value });
        }

      if (
        callCustomInspect &&
        !omittedKeys.has(CustomInspectSymbol) &&
        !(value instanceof Date) &&
        typeof (value as { [CustomInspectSymbol]?: unknown })[CustomInspectSymbol] === "function"
      ) {
        // Copy options to avoid mutation by custom inspect function
        const originalOptions = options;
        options = Object.assign({}, options);
        const node = (value as { [CustomInspectSymbol]: CustomInspectFunction })[
          CustomInspectSymbol
        ](options, expand);
        options = originalOptions;
        return node;
      }
      if (
        callNodeInspect &&
        !omittedKeys.has(NodeInspectSymbol) &&
        !(value instanceof Date) &&
        typeof (value as { [NodeInspectSymbol]?: unknown })[NodeInspectSymbol] === "function"
      ) {
        const result = (value as { [NodeInspectSymbol]: NodeCustomInspectFunction })[
          NodeInspectSymbol
        ](
          options.depth - options.level,
          convertToInspectOptions(options),
          function inspect(value, options) {
            return options ? show(value, convertToShowOptions(options)) : show(value);
          },
        );
        if (typeof result === "string") return text(result);
        return buildTree(result, options);
      }
      if (
        callToJSON &&
        !omittedKeys.has("toJSON") &&
        !(value instanceof Date) &&
        typeof (value as { toJSON?: unknown }).toJSON === "function"
      )
        return buildTree((value as { toJSON: () => unknown }).toJSON(), options);

      /* Initial setup */
      let bodyStyle: "Array" | "Object" = "Object";
      let prefix: Node | undefined = undefined;
      let prefixColor: keyof typeof c | null = null;
      const extraEntries: Node[] = []; // Before main entries
      let removeEmptyBody = false;
      let tmp: unknown;

      const pushExtraProperty = (key: string | symbol, val: unknown) => {
        extraEntries.push(pair(text(c.string("[" + formatKey(key) + "]") + ": "), expand(val)));
      };

      /* Build prefix for special cases */
      // `Date`, `RegExp` and `Error`
      if (value instanceof Date || value instanceof RegExp) {
        const type = value instanceof Date ? "Date" : "RegExp";
        let str =
          type === "Date" ?
            isNaN(value as any) ? "Invalid Date"
            : (value as Date).toISOString()
          : value.toString();
        // The rule of `Symbol.toStringTag` for `Date`s and `RegExp`s is different from other
        // objects, so we should handle it here.
        const toStringTag = getToStringTag(value, showHidden);
        const classNameWithTag = className + (toStringTag ? ` [${toStringTag}]` : "");
        if (classNameWithTag !== type) str = `${classNameWithTag} ${str}`;
        prefix = text(str);
        prefixColor = type.toLowerCase() as "date" | "regexp";
        removeEmptyBody = true;
      } else if (value instanceof Error) {
        if (value.stack) {
          const errorName =
            Object.prototype.hasOwnProperty.call(value, "name") ? value.name : className;
          let str = value.stack;
          const lines = str.split("\n");
          // Force error name to be its `name` property if the error stack is valid
          if (
            lines.length >= 2 &&
            !lines[0]!.startsWith("    at") &&
            lines[1]!.startsWith("    at")
          ) {
            let errorNameInStack = lines[0]!.split(" ", 1)[0]!;
            if (errorNameInStack.endsWith(":")) errorNameInStack = errorNameInStack.slice(0, -1);
            str = errorName + str.slice(errorNameInStack.length);
          }
          let stackPrefix = errorName + (value.message ? `: ${value.message}` : "");
          // The rule of `Symbol.toStringTag` for `Error`s is different from other
          // objects, so we should handle it here.
          const toStringTag = getToStringTag(value, showHidden);
          if (toStringTag) {
            // Escape special characters in the class name
            // Copied from: https://stackoverflow.com/a/3561711/21418758
            const errorNameRegEx = new RegExp(
              `^${errorName.replace(/[/\-\\^$*+?.()|[\]{}]/, "\\$&")}(?=:|$|\n)`,
              "m",
            );
            str = str.replace(errorNameRegEx, `${errorName} [${toStringTag}]`);
            stackPrefix = stackPrefix.replace(errorNameRegEx, `${errorName} [${toStringTag}]`);
          }
          const stack = formatErrorStack(str, stackPrefix);
          if (!stack || !stack.includes("\n")) {
            prefix = text(stack || `[${str}]`);
          } else {
            prefix = variant(
              text(stack),
              between(
                stack
                  .split("\n")
                  .map((line, i) =>
                    // De-indent 4-space padding to 2-space padding so `between` nodes can format
                    // the stack back to 4-space padding
                    i !== 0 && line.startsWith("    at") ? line.slice(2) : line,
                  )
                  .map(text),
              ),
            );
          }
        } else {
          const toStringTag = getToStringTag(value, showHidden);
          const classNameWithTag = className + (toStringTag ? ` [${toStringTag}]` : "");
          prefix = text(
            value.message ? `[${classNameWithTag}: ${value.message}]` : `[${classNameWithTag}]`,
          );
        }
        removeEmptyBody = true;
      }

      // Module
      else if (isESModule(value)) {
        prefix = text(`[Module${Object.getPrototypeOf(value) === null ? ": null prototype" : ""}]`);
      }

      // null prototype
      else if (Object.getPrototypeOf(value) === null) {
        prefix = text("[Object: null prototype]");
      }

      // Callable (function / ES6 class)
      else if (typeof value === "function") {
        let str: string;
        let type = "Function";
        // ES6 class
        if (isES6Class(value)) {
          const proto: unknown = Object.getPrototypeOf(value);
          // The rule of `Symbol.toStringTag` for classes is different from other objects,
          // so we should handle it here.
          const toStringTag = getToStringTag(value, showHidden);
          str =
            // Show class name if available, or `(anonymous)` otherwise
            `[class ${value.name || "(anonymous)"}` +
            // Show `Symbol.toStringTag` right after the class name
            (toStringTag ? ` [${toStringTag}]` : "") +
            // Show superclass name if it is available
            (typeof proto === "function" && proto.name ? ` extends ${proto.name}` : "") +
            "]";
        }
        // Other callable objects (functions)
        else {
          // The type of the function (`Function`, `GeneratorFunction`, `AsyncFunction`, etc.)
          type =
            generatorFunctionRegExp.test(Function.prototype.toString.call(value)) ?
              "GeneratorFunction"
            : asyncFunctionRegExp.test(Function.prototype.toString.call(value)) ? "AsyncFunction"
            : asyncGeneratorFunctionRegExp.test(Function.prototype.toString.call(value)) ?
              "AsyncGeneratorFunction"
            : "Function";
          // Show function name as `: ${name}` if available, or `(anonymous)` otherwise
          str = value.name ? `[${type}: ${value.name}]` : `[${type} (anonymous)]`;
          // Add trailing class name if it is not the same as the type
          if (className !== type) str += ` ${className}`;
        }
        // Highlight the class / function name
        prefix = text(str);
        prefixColor = "special";
        // Hide `name/length` and default `prototype` if `showHidden` is `exclude-meta`
        if (showHidden === "exclude-meta") {
          omittedKeys.add("name");
          omittedKeys.add("length");
          const prototype = value.prototype;
          if (prototype) {
            const ownKeys = Reflect.ownKeys(prototype);
            if (
              (type === "Function" &&
                ownKeys.length === 1 &&
                ownKeys[0] === "constructor" &&
                prototype.constructor === value &&
                Object.getPrototypeOf(prototype) === Object.prototype) ||
              (type === "GeneratorFunction" &&
                ownKeys.length === 0 &&
                Object.getPrototypeOf(prototype) === GeneratorFunction.prototype.prototype) ||
              (type === "AsyncGeneratorFunction" &&
                ownKeys.length === 0 &&
                Object.getPrototypeOf(prototype) ===
                  getAsyncGeneratorFunction().prototype.prototype)
            )
              omittedKeys.add("prototype");
          }
        }
        removeEmptyBody = true;
      }

      // Array / typed array
      else if (
        // is `Array`
        Array.isArray(value) ||
        // is typed array
        (ArrayBuffer.isView(value) && !(value instanceof DataView))
      ) {
        // Set style to `Array` to use `[...]` instead of `{...}` for the body
        bodyStyle = "Array";
        // Show class name with length if the class name is not `Array`
        if (className !== "Array" && "length" in value && typeof value.length === "number")
          prefix = text(`${className}(${value.length})`);
        // Hide `length` property if `showHidden` is `exclude-meta`
        if (showHidden === "exclude-meta") {
          omittedKeys.add("length");
        } else if (
          showHidden &&
          showHidden !== "none" &&
          // Show special properties for typed arrays
          ArrayBuffer.isView(value) &&
          !(value instanceof DataView)
        ) {
          pushExtraProperty("BYTES_PER_ELEMENT", (value as Uint8Array).BYTES_PER_ELEMENT);
          pushExtraProperty("length", (value as Uint8Array).length);
          pushExtraProperty("byteLength", value.byteLength);
          pushExtraProperty("byteOffset", value.byteOffset);
          pushExtraProperty("buffer", value.buffer);
        }
      }

      // Wrapper objects for primitives
      else if ((tmp = getWrapperClass(value))) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        const type = (tmp as Function).name;
        const openStr = `[${type}` + (className !== type ? ` (${className})` : "") + ": ";
        // For strings, it might be a long multiline string that should be broken into lines,
        // so we should expand the value here
        if (type === "String") {
          const data = (value as { valueOf(): string }).valueOf();
          // A wrapped string has positive integer keys from 0 to `length - 1`,
          // e.g., `new String("foo")` has keys `0`, `1`, `2`.
          // We should omit them here to avoid showing them in the output.
          for (let i = 0; i < data.length; i++) omittedKeys.add("" + i);
          prefix = sequence([
            text(openStr),
            // Disable colors to avoid corrupting ANSI codes in the string
            expand(data, { colors: false, depth: Infinity }),
            text("]"),
          ]);
          prefixColor = "string";
        }
        // For other types, just use `toString` to get the value
        else {
          prefix = text(
            openStr +
              (type === "Number" || type === "BigInt" ?
                stringifyNumber(value.valueOf() as number | bigint, numericSeparator)
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
              : value.toString()) +
              "]",
          );
          prefixColor = type.toLowerCase() as keyof typeof c;
        }
        removeEmptyBody = true;
      }

      /* Build base entries */
      const allKeys = Reflect.ownKeys(value).filter((key) => !omittedKeys.has(key));
      const arrayItemKeys: string[] = [];
      let hiddenArrayItemsCount = 0;
      const otherKeys = [];
      for (const key of allKeys) {
        if (bodyStyle === "Array" && isPositiveIntegerKey(key)) {
          if (arrayItemKeys.length === maxArrayLength) {
            hiddenArrayItemsCount++;
            continue;
          }
          arrayItemKeys.push(key);
          continue;
        }
        // Hide non-enumerable keys when `showHidden` is `"none"`
        if (
          (showHidden !== "none" && showHidden !== false) ||
          (!(value instanceof Error && key === "name") && // `name` is already used as error prefix
            Object.getOwnPropertyDescriptor(value, key)!.enumerable)
        )
          otherKeys.push(key);
      }
      const ensurePreservedKeys = [
        // Error.cause
        value instanceof Error && "cause",
        // AggregateError.errors
        // @ts-expect-error - AggregateError is only available in ES2021+
        typeof AggregateError !== "undefined" &&
          // @ts-expect-error - AggregateError is only available in ES2021+
          value instanceof AggregateError &&
          "errors",
      ].filter((k) => k) as string[];
      for (const key of ensurePreservedKeys)
        if (allKeys.indexOf(key) !== -1 && otherKeys.indexOf(key) === -1) otherKeys.push(key);

      // Array element
      const arrayEntries: Node[] = arrayItemKeys.map((key) =>
        expand(value[key as keyof typeof value]),
      );
      if (hiddenArrayItemsCount)
        arrayEntries.push(
          text(`... ${hiddenArrayItemsCount} more item${hiddenArrayItemsCount === 1 ? "" : "s"}`),
        );

      function formatKey(key: string | symbol): string {
        return (
          typeof key === "symbol" ? c.symbol(key.toString())
            // Always quote keys if `quoteKeys` is set to `"always"`
          : quoteKeys === "always" ? c.string(stringifyString(key, quoteStyle))
            // For string keys that are valid identifiers, we should show them as is
          : /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key
            // For other string keys, we should wrap them with quotes
          : c.string(stringifyString(key, quoteStyle))
        );
      }

      // Object key/value pair
      const objectEntries = otherKeys.map((key) => {
        const desc = Object.getOwnPropertyDescriptor(value, key)!;

        let keyDisplay = formatKey(key);
        // Add `[]` around non-enumerable string keys
        if (typeof key === "string" && !desc.enumerable) keyDisplay = `[${keyDisplay}]`;

        // Expand the value
        const propType =
          desc.get && desc.set ? "Getter/Setter"
          : desc.get ? "Getter"
          : desc.set ? "Setter"
          : "";
        // Just show the value if it is not a getter/setter
        if (!propType)
          return pair(text(`${keyDisplay}: `), expand(value[key as keyof typeof value]));

        const shouldExpand =
          ((getters === "all" || getters === true) && !!desc.get) ||
          (getters === "get" && desc.get && !desc.set) ||
          (getters === "set" && desc.get && !!desc.set);

        if (!shouldExpand) return text(`${keyDisplay}: ` + c.special(`[${propType}]`));

        // Getters may throw errors, so we should wrap it in a try-catch block
        let val: unknown;
        let errorMessage: string | undefined;
        try {
          val = value[key as keyof typeof value];
        } catch (err) {
          errorMessage = err == null ? String(err) : String((err as any).message);
        }

        // Show errors as `foo: [Getter: <Inspection threw (error message)>]`
        if (errorMessage !== undefined)
          return text(
            `${keyDisplay}: ` +
              c.special(`[${propType}:`) +
              ` <Inspection threw (${errorMessage})>` +
              c.special("]"),
          );

        // Show objects as `foo: [Getter/Setter] { bar: "baz" }`
        if (isObject(val))
          return pair(text(`${keyDisplay}: ` + c.special(`[${propType}]`) + " "), expand(val));

        // Show primitives as `foo: [Getter: "hello"]`
        return sequence([
          text(`${keyDisplay}: ` + c.special(`[${propType}:`) + " "),
          expand(val),
          text(c.special("]")),
        ]);
      });
      if (sorted)
        // Sort object keys if `sorted` is `true`
        objectEntries.sort((a, b) => {
          const aStr = cleanANSI(a.type === "text" ? a.value : a.values[0].value);
          const bStr = cleanANSI(b.type === "text" ? b.value : b.values[0].value);
          return (
            aStr < bStr ? -1
            : aStr > bStr ? 1
            : 0
          );
        });

      /* Refine entries */
      // Promise
      if (value instanceof Promise) {
        extraEntries.push(text(c.special("<state unknown>")));
      }

      // Map
      else if (value instanceof Map) {
        prefix = text(`Map(${value.size})`);
        const mapEntries = Array.from(value.entries());
        if (sorted)
          // Sort map entries if `sorted` is `true`
          mapEntries.sort((a, b) => {
            const aStr = String(
              typeof a[0] === "string" ? stringifyString(a[0], quoteStyle) : a[0],
            );
            const bStr = String(
              typeof b[0] === "string" ? stringifyString(b[0], quoteStyle) : b[0],
            );
            return (
              aStr < bStr ? -1
              : aStr > bStr ? 1
              : 0
            );
          });
        for (const [key, val] of mapEntries)
          (objectEntries as Node[]).push(sequence([expand(key), text(" => "), expand(val)]));
      }

      // Set
      else if (value instanceof Set) {
        prefix = text(`Set(${value.size})`);
        const setItems = Array.from(value);
        if (sorted)
          // Sort set items if `sorted` is `true`
          setItems.sort((a, b) => {
            const aStr = String(typeof a === "string" ? stringifyString(a, quoteStyle) : a);
            const bStr = String(typeof b === "string" ? stringifyString(b, quoteStyle) : b);
            return (
              aStr < bStr ? -1
              : aStr > bStr ? 1
              : 0
            );
          });
        for (const val of setItems) (objectEntries as Node[]).push(expand(val));
      }

      // WeakMap and WeakSet
      else if (value instanceof WeakMap || value instanceof WeakSet) {
        extraEntries.push(text(c.special("<items unknown>")));
      }

      // Empty item markers for arrays
      else if (Array.isArray(value)) {
        const integerKeys = Reflect.ownKeys(value).filter(isPositiveIntegerKey).map(Number);
        let pointer = 1;
        for (let i = 0; i < integerKeys.length - 1; i++) {
          const key = integerKeys[i]!;
          const nextKey = integerKeys[i + 1]!;
          if (nextKey === key + 1) {
            pointer++;
            continue;
          }
          const str = `<${nextKey - key - 1} empty item${nextKey - key - 1 === 1 ? "" : "s"}>`;
          arrayEntries.splice(pointer, 0, text(c.gray(str)));
          pointer += 2;
        }
        // Insert trailing empty item markers if necessary
        let lastKey = integerKeys[integerKeys.length - 1];
        if (lastKey === undefined) lastKey = -1;
        const len = value.length;
        if (lastKey < len - 1) {
          const str = `<${len - lastKey - 1} empty item${len - lastKey - 1 === 1 ? "" : "s"}>`;
          arrayEntries.push(text(c.gray(str)));
        }
      }

      // ArrayBuffer
      else if (
        value instanceof ArrayBuffer ||
        // @ts-expect-error - SharedArrayBuffer is only available in ES2017+
        (typeof SharedArrayBuffer !== "undefined" && value instanceof SharedArrayBuffer)
      ) {
        // Uint8Contents
        let contents = "<";
        let buffer: Uint8Array | undefined;
        try {
          buffer = new Uint8Array(value as ArrayBuffer);
        } catch (e) {
          extraEntries.push(text(c.special("(detached)")));
        }
        if (buffer) {
          let i = 0;
          for (; i < Math.min(maxArrayLength, buffer.length); i++) {
            const byte = buffer[i]!;
            if (contents !== "<") contents += " ";
            let part = byte.toString(16);
            if (part.length === 1) part = "0" + part;
            contents += part;
          }
          if (i < buffer.length)
            contents += ` ... ${buffer.length - i} more byte${buffer.length - i === 1 ? "" : "s"}`;
          contents += ">";
          extraEntries.push(
            pair(text(c.special("[Uint8Contents]") + ": "), text(c.special(contents))),
          );
        }
        // byteLength
        pushExtraProperty("byteLength", (value as ArrayBuffer).byteLength);
      }

      // DataView
      else if (value instanceof DataView) {
        pushExtraProperty("byteLength", value.byteLength);
        pushExtraProperty("byteOffset", value.byteOffset);
        pushExtraProperty("buffer", value.buffer);
      }

      /* Build body */
      const entries = arrayEntries;
      Array.prototype.push.apply(entries, extraEntries);
      Array.prototype.push.apply(entries, objectEntries);

      // Wrap `[]` for array-style objects, and `{}` for others
      const [open, close] = bodyStyle === "Array" ? ["[", "]"] : ["{", "}"];
      const braceSpacing = bodyStyle === "Array" ? arrayBracketSpacing : objectCurlySpacing;
      const body =
        entries.length === 0 ?
          text(bodyStyle === "Array" ? "[]" : "{}")
        : variant(
            between(
              // Add comma separator for entries
              entries.map((node, i, arr) =>
                i !== arr.length - 1 ? pair(node, text(", "))
                : trailingComma === "always" ? pair(node, text(","))
                : node,
              ),
              text(open + (braceSpacing ? " " : "")),
              text((braceSpacing ? " " : "") + close),
            ),
            between(
              // Add comma separator for entries
              entries.map((node, i, arr) =>
                trailingComma !== "none" || i !== arr.length - 1 ? pair(node, text(",")) : node,
              ),
              text(open),
              text(close),
            ),
          );

      // Add `Symbol.toStringTag`
      if (
        !(value instanceof Date) &&
        !(value instanceof RegExp) &&
        !(value instanceof Error) &&
        !isES6Class(value)
      ) {
        // `Date`s, `RegExp`s and ES6 classes are handled in the prefix,
        // so we only need to handle the rest here.
        const toStringTag = getToStringTag(value, showHidden);
        if (toStringTag && (!isESModule(value) || toStringTag !== "Module")) {
          if (!prefix) prefix = text(`${className} [${toStringTag}]`);
          else if (prefix.type === "text")
            prefix = Object.assign({}, prefix, { value: `${prefix.value} [${toStringTag}]` });
          else prefix = pair(prefix, text(` [${toStringTag}]`));
        }
      }

      // Add class name
      if (
        !prefix &&
        className &&
        className !== "Object" &&
        !(bodyStyle === "Array" && Array.isArray(value))
      )
        prefix = text(className);

      // Remove empty body (`[]` for array-style objects, `{}` for others) if necessary
      const result =
        prefix ?
          body.type === "text" && removeEmptyBody ?
            prefixColor && (prefix.type === "text" || prefix.type === "sequence") ?
              colorizeNode(prefix, c, prefixColor)
            : prefix
          : sequence([prefix, text(" "), body])
        : body;

      // Add reference pointer to help identify circular structures
      return Object.assign({}, result, { ref: value });
    } catch (err) {
      if (err instanceof MaximumDepthError)
        return text(
          c.special(
            `[${className}${Object.getPrototypeOf(value) === null ? ": null prototype" : ""}]`,
          ),
        );
      throw err;
    }
  }

  // This should never happen, but for future compatibility,
  // we use a fallback `JSON.stringify` for unknown types.
  return text(JSON.stringify(value));
}

/********
 * Node *
 ********/
/**
 * A tree node that represents a value to be stringified.
 */
export type Node =
  | { type: "circular"; ref: object }
  | { type: "text"; value: string; ref?: object }
  | { type: "variant"; inline: Node; wrap: Node; ref?: object }
  | { type: "sequence"; values: Node[]; ref?: object }
  | { type: "between"; values: Node[]; open?: Node; close?: Node; ref?: object };
/**
 * Helper functions for building {@link Node}s.
 */
export const Node = { circular, text, variant, sequence, pair, between };

function circular(ref: object): { type: "circular"; ref: object } {
  return { type: "circular", ref };
}
function text(value: string): { type: "text"; value: string } {
  return { type: "text", value };
}
function variant<I extends Node, W extends Node>(
  inline: I,
  wrap: W,
): { type: "variant"; inline: I; wrap: W } {
  return { type: "variant", inline, wrap };
}
function sequence<const Nodes extends Node[]>(values: Nodes): { type: "sequence"; values: Nodes } {
  return { type: "sequence", values };
}
function pair<L extends Node, R extends Node>(
  left: L,
  right: R,
): { type: "sequence"; values: [L, R] } {
  return sequence([left, right]);
}
function between<const Nodes extends Node[]>(
  values: Nodes,
  open?: Node,
  close?: Node,
): { type: "between"; values: Nodes; open?: Node; close?: Node } {
  return Object.assign(
    {
      type: "between",
      values,
    },
    open !== undefined ? { open } : {},
    close !== undefined ? { close } : {},
  ) as { type: "between"; values: Nodes; open?: Node; close?: Node };
}

/**********************
 * Internal utilities *
 **********************/
const CustomInspectSymbol = Symbol.for("showify.inspect.custom");
type CustomInspectSymbol = typeof CustomInspectSymbol;
const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
type NodeInspectSymbol = typeof NodeInspectSymbol;

const GeneratorFunction = /* #__PURE__ */ function* () {}.constructor;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
let cachedAsyncGeneratorFunction: Function | undefined;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getAsyncGeneratorFunction(): Function {
  if (!cachedAsyncGeneratorFunction)
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      cachedAsyncGeneratorFunction = Function("return async function*(){}")().constructor;
    } catch (e) {
      cachedAsyncGeneratorFunction = function () {}.constructor;
    }
  return cachedAsyncGeneratorFunction!;
}

const generatorFunctionRegExp = /^\s*(?:function)?\*/;
const asyncFunctionRegExp =
  /^\s*async(?:\s+function(?:\s+[A-Za-z_$][A-Za-z0-9_$]*|\s*\()|\s*\(|\s+[A-Za-z_$][A-Za-z0-9_$]*\s*\(|\s*\[)/;
const asyncGeneratorFunctionRegExp = /^\s*async\s*(?:function\s*)?\*/;

/**
 * Colorize a string with ANSI escape codes.
 * @param str The string to colorize.
 * @param color The color to use.
 * @returns The colorized string.
 */
function colorize(
  str: string,
  color:
    | "bold"
    | "dim"
    | "reset"
    | "black"
    | "blue"
    | "cyan"
    | "gray"
    | "green"
    | "magenta"
    | "red"
    | "white"
    | "yellow"
    | ((s: string) => string),
): string {
  if (typeof color === "function") return color(str);

  switch (color) {
    /* Modifiers */
    case "bold":
      return `\x1b[1m${str}\x1b[22m`;
    case "dim":
      return `\x1b[2m${str}\x1b[22m`;
    case "reset":
      return `\x1b[0m${str}\x1b[0m`;
    /* Colors */
    case "black":
      return `\x1b[30m${str}\x1b[39m`;
    case "blue":
      return `\x1b[34m${str}\x1b[39m`;
    case "cyan":
      return `\x1b[36m${str}\x1b[39m`;
    case "gray":
      return `\x1b[90m${str}\x1b[39m`;
    case "green":
      return `\x1b[32m${str}\x1b[39m`;
    case "magenta":
      return `\x1b[35m${str}\x1b[39m`;
    case "red":
      return `\x1b[31m${str}\x1b[39m`;
    case "white":
      return `\x1b[37m${str}\x1b[39m`;
    case "yellow":
      return `\x1b[33m${str}\x1b[39m`;
  }
}
declare namespace colorize {
  const colors: readonly [
    /* Modifiers */
    "bold",
    "dim",
    "reset",
    /* Colors */
    "black",
    "blue",
    "cyan",
    "gray",
    "green",
    "magenta",
    "red",
    "white",
    "yellow",
  ];
  type Color = (typeof colors)[number];

  /**
   * Build `c` object for colorizing strings.
   * @param colorEnabled If `false`, the returned object will not colorize strings and will return
   * the input as is.
   * @param styles The styles for different types of values.
   * @returns
   */
  function buildC(
    colorEnabled: boolean,
    styles: Styles,
  ): Record<Color | keyof Styles, (value: string | number | boolean | symbol) => string>;
}
Object.defineProperty(colorize, "colors", {
  value: [
    /* Modifiers */
    "bold",
    "dim",
    "reset",
    /* Colors */
    "black",
    "blue",
    "cyan",
    "gray",
    "green",
    "magenta",
    "red",
    "white",
    "yellow",
  ] satisfies typeof colorize.colors,
});
Object.defineProperty(colorize, "buildC", {
  value: function buildC(colorEnabled: boolean, styles: Styles) {
    const c = {} as ReturnType<typeof colorize.buildC>;
    if (colorEnabled) {
      for (const color of colorize.colors) c[color] = (value) => colorize(value.toString(), color);
      for (const type of Object.keys(styles)) {
        const style = styles[type as keyof typeof styles];
        c[type as keyof typeof styles] = (value) => colorize(value.toString(), style);
      }
    } else {
      for (const color of colorize.colors) c[color] = (value) => value.toString();
      for (const type of Object.keys(styles))
        c[type as keyof typeof styles] = (value) => value.toString();
    }
    return c;
  },
});

/**
 * Colorize a {@link Node}.
 * @param node The {@link Node} to colorize.
 * @param c The `c` object returned by {@linkcode colorize.buildC}.
 * @param color The color to use.
 * @returns The colorized {@link Node}.
 */
function colorizeNode<N extends ReturnType<typeof text> | ReturnType<typeof sequence>>(
  node: N,
  c: ReturnType<typeof colorize.buildC>,
  color: colorize.Color | keyof Styles,
): N {
  /* text */
  if (node.type === "text") return Object.assign({}, node, { value: c[color](node.value) });

  /* sequence */
  if (!node.values.length) return node;

  const values = [...node.values];
  const first = values[0]!;
  const last = values[values.length - 1]!;

  const [open, close] = c[color]("|").split("|", 2) as [string, string];

  // Open color
  if (first.type === "text") values[0] = Object.assign({}, first, { value: open + first.value });
  else values.splice(0, 0, text(open));

  // Close color
  if (last.type === "text")
    values[values.length - 1] = Object.assign({}, last, { value: last.value + close });
  else values.push(text(close));

  return Object.assign({}, node, { values });
}

/**
 * Remove ANSI escape codes from a string.
 *
 * Modified from [this StackOverflow answer](https://stackoverflow.com/a/29497680/21418758).
 * @param str The string to remove ANSI escape codes from.
 * @returns
 */
function cleanANSI(str: string): string {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    "",
  );
}

const HIGHLIGHT_REGEXP_COLORS = [
  "green",
  "red",
  "yellow",
  "cyan",
  "magenta",
] as const satisfies colorize.Color[];

/**
 * This function is shamelessly copied from Node.js’s implementation of `util.inspect`:
 * <https://github.com/nodejs/node/blob/dec0213c834607e7721ee250d8c46ef9cd112efe/lib/internal/util/inspect.js#L526-L768>
 *
 * Thanks to [@BridgeAR](https://github.com/BridgeAR) for [the original implementation](https://github.com/nodejs/node/pull/59710) in Node.js!
 *
 * Colorize a JavaScript RegExp pattern per ECMAScript grammar.
 * This is a tolerant single-pass highlighter using heuristics in some cases.
 * It supports: groups (named/unnamed, lookaround), assertions, alternation,
 * quantifiers, escapes (incl. Unicode properties), character classes and
 * backreferences.
 * @param regexpString The RegExp pattern string (including leading and trailing slashes).
 * @returns The colorized RegExp pattern string.
 */
function highlightRegExp(regexpString: string) {
  let result = "";
  let i = 0;
  let depth = 0;
  let inClass = false;

  const writeGroup = (start: string, end: string, decDepth = 1) => {
    let seq = "";
    i++;
    // Only checking for the closing delimiter is a fast heuristic for regular
    // expressions without the u or v flag. A safer check would verify that the
    // read characters are all alphanumeric.
    while (i < regexpString.length && regexpString[i] !== end) seq += regexpString[i++];
    if (i < regexpString.length) {
      depth -= decDepth;
      write(start);
      writeDepth(seq, 1, 1);
      write(end);
      depth += decDepth;
    } else {
      // The group is not closed which would lead to mistakes in the output.
      // This is a workaround to prevent output from being corrupted.
      writeDepth(start, 1, -seq.length);
    }
  };

  const write = (s: string) => {
    const idx = depth % HIGHLIGHT_REGEXP_COLORS.length;
    // Safeguard against bugs in the implementation.
    const color = HIGHLIGHT_REGEXP_COLORS[idx] || HIGHLIGHT_REGEXP_COLORS[0];
    result += colorize(s, color);
    return idx;
  };

  function writeDepth(s: string, incDepth: number, incI: number) {
    depth += incDepth;
    write(s);
    depth -= incDepth;
    i += incI;
  }

  // Opening '/'
  write("/");
  depth++;
  i = 1;

  // Parse pattern until next unescaped '/'
  while (i < regexpString.length) {
    const ch = regexpString[i]!;

    if (inClass) {
      if (ch === "\\") {
        let seq = "\\";
        i++;
        if (i < regexpString.length) {
          seq += regexpString[i++];
          const next = seq[1];
          if (
            (next === "u" && regexpString[i] === "{") ||
            ((next === "p" || next === "P") && regexpString[i] === "{")
          ) {
            writeGroup(`${seq}{`, "}", 0);
            continue;
          } else if (seq[1] === "x") {
            seq += regexpString.slice(i, i + 2);
            i += 2;
          }
        }
        write(seq);
      } else if (ch === "]") {
        depth--;
        write("]");
        i++;
        inClass = false;
      } else if (
        ch === "-" &&
        regexpString[i - 1] !== "[" &&
        i + 1 < regexpString.length &&
        regexpString[i + 1] !== "]"
      ) {
        writeDepth("-", 1, 1);
      } else {
        write(ch);
        i++;
      }
    } else if (ch === "[") {
      // Enter class
      write("[");
      depth++;
      i++;
      inClass = true;
    } else if (ch === "(") {
      write("(");
      depth++;
      i++;
      if (i < regexpString.length && regexpString[i] === "?") {
        // Assertions and named groups
        i++;
        const a = i < regexpString.length ? regexpString[i] : "";
        if (a === ":" || a === "=" || a === "!") {
          writeDepth(`?${a}`, -1, 1);
        } else {
          const b = i + 1 < regexpString.length ? regexpString[i + 1] : "";
          if (a === "<" && (b === "=" || b === "!")) {
            writeDepth(`?<${b}`, -1, 2);
          } else if (a === "<") {
            // Named capture: write '?<name>' as a single colored token
            i++; // Consume '<'
            const start = i;
            while (i < regexpString.length && regexpString[i] !== ">") i++;
            const name = regexpString.slice(start, i);
            if (i < regexpString.length && regexpString[i] === ">") {
              depth--;
              write("?<");
              writeDepth(name, 1, 0);
              write(">");
              depth++;
              i++;
            } else {
              writeDepth("?<", -1, 0);
              write(name);
            }
          } else {
            write("?");
          }
        }
      }
    } else if (ch === ")") {
      depth--;
      write(")");
      i++;
    } else if (ch === "\\") {
      let seq = "\\";
      i++;
      if (i < regexpString.length) {
        seq += regexpString[i++];
        const next = seq[1]!;
        if (i < regexpString.length) {
          if (
            regexpString[i] === "{" &&
            (next === "u" || /* Unicode properties */ next === "p" || next === "P")
          ) {
            writeGroup(`${seq}{`, "}", 0);
            continue;
          } else if (next === "x") {
            seq += regexpString.slice(i, i + 2);
            i += 2;
          } else if (next >= "0" && next <= "9") {
            while (i < regexpString.length && regexpString[i]! >= "0" && regexpString[i]! <= "9") {
              seq += regexpString[i++];
            }
          } else if (next === "k" && regexpString[i] === "<") {
            writeGroup(`${seq}<`, ">");
            continue;
          }
        }
      }
      writeDepth(seq, 1, 0);
    } else if (
      ch === "|" ||
      ch === "+" ||
      ch === "*" ||
      ch === "?" ||
      ch === "," ||
      ch === "^" ||
      ch === "$"
    ) {
      writeDepth(ch, 3, 1);
    } else if (ch === "{") {
      i++;
      let digits = "";
      while (i < regexpString.length && regexpString[i]! >= "0" && regexpString[i]! <= "9")
        digits += regexpString[i++];
      if (digits) {
        write("{");
        depth++;
        writeDepth(digits, 1, 0);
      }
      if (i < regexpString.length) {
        if (regexpString[i] === ",") {
          if (!digits) {
            write("{");
            depth++;
          }
          write(",");
          i++;
        } else if (!digits) {
          depth += 1;
          write("{");
          depth -= 1;
          continue;
        }
      }
      let digits2 = "";
      while (i < regexpString.length && regexpString[i]! >= "0" && regexpString[i]! <= "9")
        digits2 += regexpString[i++];
      if (digits2) writeDepth(digits2, 1, 0);
      if (i < regexpString.length && regexpString[i] === "}") {
        depth--;
        write("}");
        i++;
      }
      if (i < regexpString.length && regexpString[i] === "?") writeDepth("?", 3, 1);
    } else if (ch === ".") {
      writeDepth(ch, 2, 1);
    } else if (ch === "/") {
      // Stop at closing delimiter (unescaped, outside of character class)
      break;
    } else {
      writeDepth(ch, 1, 1);
    }
  }

  // Closing delimiter and flags
  writeDepth("/", -1, 1);
  if (i < regexpString.length) write(regexpString.slice(i));

  return result;
}

/**
 * Get the class name of an object.
 * @param value The value to get the class name of.
 * @returns
 */
function getClassName(value: object): string {
  let obj: object | null = value;
  while (obj || isUndetectableObject(obj)) {
    const desc = Object.getOwnPropertyDescriptor(obj, "constructor");
    const ctorName = desc && typeof desc.value === "function" && (desc.value.name as string);
    if (ctorName && isInstanceOf(value, desc.value))
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
      return String(ctorName);
    obj = Object.getPrototypeOf(obj);
  }
  return "Object";
}

/**
 * Get the `Symbol.toStringTag` property of an object if satisfies the following conditions:
 *
 * - It is a string.
 * - It is not an empty string.
 * - It is not already displayed by `showHidden`.
 * - The class name does not already end with the `Symbol.toStringTag` value.
 *
 * Otherwise, return `null`.
 * @param value The object to get the `Symbol.toStringTag` of.
 * @returns
 */
function getToStringTag(
  value: object,
  showHidden: NonNullable<ShowOptions["showHidden"]>,
): string | null {
  const toStringTag: unknown = value[Symbol.toStringTag as keyof typeof value];
  return (
      typeof toStringTag === "string" &&
        toStringTag &&
        (showHidden !== "none" && showHidden !== false ?
          !Object.prototype.hasOwnProperty.call(value, Symbol.toStringTag)
        : !Object.prototype.propertyIsEnumerable.call(value, Symbol.toStringTag)) &&
        !getClassName(value).endsWith(toStringTag)
    ) ?
      toStringTag
    : null;
}

/**
 * Get the wrapper class of a value if it is a wrapper object, or `null` otherwise.
 * @param value The value to get the wrapper class of.
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getWrapperClass(value: object): Function | null {
  if (value instanceof String) return String;
  if (value instanceof Symbol) return Symbol;
  if (value instanceof Number) return Number;
  // @ts-expect-error - BigInt is only available in ES2020+
  if (typeof BigInt === "function" && value instanceof BigInt) return BigInt;
  if (value instanceof Boolean) return Boolean;
  return null;
}

/**
 * Stringify a string value with a specific quote style.
 * @param value The string value to stringify.
 * @param quoteStyle The quote style to use.
 * @returns The stringified value.
 */
function stringifyString(
  value: string,
  quoteStyle: NonNullable<ShowOptions["quoteStyle"]>,
): string {
  if (quoteStyle === "double") return JSON.stringify(value);

  const unescaped = JSON.stringify(value).slice(1, -1).replace(/\\"/g, '"');

  // Avoid using backticks when the content looks like a template literal
  // i.e., contains the sequence "${". This mirrors Node's util.inspect behavior
  const hasTemplate = unescaped.includes("${");
  if (hasTemplate && quoteStyle === "backtick") return JSON.stringify(value);

  if (quoteStyle === "single") return `'${unescaped.replace(/'/g, "\\'")}'`;
  if (quoteStyle === "backtick") return `\`${unescaped.replace(/`/g, "\\`")}\``;

  if (hasTemplate) {
    const idx = (quoteStyle as (typeof quoteStyle)[number][]).indexOf("backtick");
    if (idx !== -1) {
      quoteStyle = quoteStyle.slice() as typeof quoteStyle;
      quoteStyle.splice(idx, 1);
    }
  }

  const hasSingle = unescaped.includes("'");
  const hasDouble = unescaped.includes('"');
  const hasBack = unescaped.includes("`");
  for (const quote of quoteStyle)
    switch (quote) {
      case "single":
        if (!hasSingle) return `'${unescaped}'`;
        break;
      case "double":
        if (!hasDouble) return `"${unescaped}"`;
        break;
      case "backtick":
        if (!hasBack) return `\`${unescaped}\``;
        break;
    }
  switch (quoteStyle[0]) {
    case "single":
      return `'${unescaped.replace(/'/g, "\\'")}'`;
    case "double":
      return `"${unescaped.replace(/"/g, '\\"')}"`;
    case "backtick":
      return `\`${unescaped.replace(/`/g, "\\`")}\``;
  }
}

/**
 * Stringify a number value with a specific numeric separator.
 * @param value The number value to stringify.
 * @param sep The numeric separator to use. If `"none"`, no separator will be used.
 * @returns The stringified value.
 */
function stringifyNumber(value: number | bigint, sep: "none" | (string & {}) | boolean): string {
  if (sep === "none" || !sep)
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return (Object.is(value, -0) ? "-0" : value) + (typeof value === "bigint" ? "n" : "");
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const parts = (Object.is(value, -0) ? "-0" : "" + value).split(".");
  return (
    // TODO: Refactor this slow regex to a faster implementation
    // eslint-disable-next-line sonarjs/slow-regex
    parts[0]!.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + (sep === true ? "_" : sep)) +
    (parts[1] ? "." + parts[1].replace(/(\d{3})/g, "$1" + (sep === true ? "_" : sep)) : "") +
    (typeof value === "bigint" ? "n" : "")
  );
}

/**
 * Check if a key is a positive integer.
 * @param key The key to check.
 * @returns
 */
function isPositiveIntegerKey(key: string | symbol): key is `${number}` {
  return typeof key === "string" && Number.isInteger(+key) && +key >= 0;
}

/**
 * Check whether a string looks like a number/bigint literal or a numeric special
 * (NaN/Infinity/-Infinity/-0). Used to decide right-align (padStart) vs left-align.
 * @param s The string to check.
 * @returns Whether the string is numeric-like.
 */
function isNumericLike(s: string): boolean {
  // Allow bigint suffix 'n'
  if (/^-?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:e[+-]?\d+)?n?$/.test(s)) return true;
  return s === "NaN" || s === "Infinity" || s === "-Infinity" || s === "-0";
}

/**
 * Format an error stack if it is valid, otherwise return `null`.
 * @param stack The stack to format.
 * @param prefix The prefix used to format the stack.
 * @returns
 */
function formatErrorStack(stack: string, prefix: string): string | null {
  const lines = stack.split("\n");
  if (!lines.length) return null;

  // V8
  if (
    lines.length >= 2 &&
    !lines[0]!.startsWith("    at") &&
    lines.slice(1).some((line) => line.startsWith("    at"))
  )
    return stack;

  // SpiderMonkey & JavaScriptCore
  if (lines.every((line) => !line || line.includes("@")))
    return (
      prefix +
      "\n" +
      lines
        .filter((line) => line && !line.endsWith("@"))
        .map((line) => "    at " + line.replace(/^@/, "<anonymous>@").replace(/@/, " (") + ")")
        .join("\n")
    );

  // QuickJS
  if (lines[lines.length - 1] === "" && lines.every((line) => !line || line.startsWith("    at")))
    return prefix + "\n" + lines.filter(Boolean).join("\n");

  return null;
}

/**
 * Check if a value is an object (including functions and arrays).
 * @param value The value to check.
 * @returns
 */
function isObject(value: unknown): value is object {
  return (
    (value !== null && (typeof value === "object" || typeof value === "function")) ||
    isUndetectableObject(value)
  );
}

/**
 * Detect undetectable objects (aka [[IsHTMLDDA]] values like `document.all`).
 *
 * See: <https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot>
 * @param value The value to check.
 * @returns
 */
function isUndetectableObject(value: unknown): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return typeof value === "undefined" && value !== undefined;
}

/**
 * Check if a value is an instance of a prototype.
 * Detect undetectable objects (aka [[IsHTMLDDA]] values like `document.all`).
 *
 * See: <https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot>
 * @param value The value to check.
 * @param proto The prototype to check against.
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function isInstanceOf(value: unknown, proto: Function): boolean {
  try {
    return value instanceof proto;
  } catch (e) {
    // Cross-realm/proxy oddities: ignore and continue.
    return false;
  }
}

/**
 * Check if a value is an ES6 class.
 * @param value The function to check.
 * @returns
 */
function isES6Class(value: unknown): boolean {
  return typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value));
}

/**
 * Check if an object is an ES module.
 * @returns
 */
function isESModule(value: object) {
  const desc = Object.getOwnPropertyDescriptor(value, Symbol.toStringTag);
  if (!desc) return false;
  return (
    desc.value === "Module" &&
    desc.writable === false &&
    desc.enumerable === false &&
    desc.configurable === false
  );
}

/* `padStart` and `padEnd` for ES2015 */
function padStart(s: string, length: number): string {
  return s.length >= length ? s : " ".repeat(length - s.length) + s;
}
function padEnd(s: string, length: number): string {
  return s.length >= length ? s : s + " ".repeat(length - s.length);
}

/**
 * Custom inspect method for {@linkcode show} (`Symbol.for("showify.inspect.custom")`).
 */
export type CustomInspectFunction = (
  options: SerializerOptionsStylized,
  expand: (value: unknown, options?: Partial<SerializerOptions>) => Node,
) => Node;
export interface SerializerOptionsStylized extends Omit<SerializerOptions, "styles"> {
  refs: Map<object, number>;
  styles: Styles;
  c: ReturnType<typeof colorize.buildC>;
}

/**
 * Custom inspect function compatible with Node.js `Symbol.for("nodejs.util.inspect.custom")`.
 */
export type NodeCustomInspectFunction = (
  depth: number,
  options: InspectOptionsStylized,
  inspect: (value: unknown, options?: InspectOptions) => any,
) => any;
/**
 * Options compatible with `util.inspect`.
 * @see {@link https://nodejs.org/api/util.html#util_util_inspect_object_options}
 */
export interface InspectOptions {
  showHidden: boolean;
  depth: number;
  colors: boolean;
  customInspect: boolean;
  showProxy: boolean;
  maxArrayLength: number;
  maxStringLength: number;
  breakLength: number;
  compact: boolean;
  sorted: boolean;
  getters: "get" | "set" | boolean;
  numericSeparator: boolean;
}
export interface InspectOptionsStylized extends InspectOptions {
  stylize(text: string, styleType: keyof Styles | "module"): string;
}

/**
 * Options only supported by showify.
 */
const showifyOnlyOptions = [
  "callToJSON",
  "callNodeInspect",
  "callCustomInspect",
  "indent",
  "omittedKeys",
  "quoteStyle",
  "quoteKeys",
  "trailingComma",
  "arrayBracketSpacing",
  "objectCurlySpacing",
  "referencePointer",
  "styles",
  "serializers",
] as const satisfies (keyof ShowOptions)[];

/**
 * Convert {@linkcode SerializerOptions} to Node.js `util.inspect` options.
 * @param opts The options to convert.
 * @returns
 */
function convertToInspectOptions(
  opts: SerializerOptions & {
    breakLength: number;
    referencePointer: boolean;
    c: ReturnType<typeof colorize.buildC>;
  },
): InspectOptionsStylized {
  const { c } = opts;
  return Object.assign(
    {
      stylize: function stylize(text, styleType) {
        if (styleType === "module") return text;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return (c[styleType] || ((text) => text))(text);
      },
      showHidden: opts.showHidden !== "none" && opts.showHidden !== false,
      depth: opts.depth - opts.level,
      colors: opts.colors,
      customInspect: opts.callNodeInspect,
      showProxy: false, // Unsupported in this library, use a dummy value
      maxArrayLength: opts.maxArrayLength,
      maxStringLength: opts.maxStringLength,
      breakLength: opts.breakLength,
      compact: false, // Unsupported in this library, use a dummy value
      sorted: opts.sorted,
      // prettier-ignore
      getters: opts.getters === "all" ? true : opts.getters === "none" ? false : opts.getters,
      numericSeparator: opts.numericSeparator !== "none",
    } satisfies InspectOptionsStylized,
    // showify-only options
    showifyOnlyOptions.reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = opts[key as keyof typeof opts];
      return acc;
    }, {}),
  );
}
/**
 * Convert {@linkcode InspectOptions} to {@linkcode ShowOptions}.
 * @param opts The options to convert.
 * @returns
 */
function convertToShowOptions(opts: InspectOptions): ShowOptions {
  return Object.assign(
    {
      showHidden: opts.showHidden ? "always" : "none",
      depth: opts.depth,
      colors: opts.colors,
      callNodeInspect: opts.customInspect,
      callCustomInspect: opts.customInspect,
      maxArrayLength: opts.maxArrayLength,
      maxStringLength: opts.maxStringLength,
      indent:
        "indent" in opts && typeof opts.indent === "number" ? opts.indent
        : opts.breakLength === Infinity ? 0
        : 2,
      breakLength: opts.breakLength,
      sorted: opts.sorted,
      // prettier-ignore
      getters: opts.getters === true ? "all" : opts.getters === false ? "none" : opts.getters,
      numericSeparator: opts.numericSeparator ? "_" : "none",
    } satisfies ShowOptions,
    // showify-only options
    showifyOnlyOptions.reduce<Record<string, unknown>>((acc, key) => {
      if (key in opts) acc[key] = opts[key as keyof typeof opts];
      return acc;
    }, {}),
  );
}
