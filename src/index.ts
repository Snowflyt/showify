/**
 * Options for {@link show}.
 */
export interface ShowOptions {
  /**
   * The maximum depth to show.
   * @default Infinity
   */
  depth?: number;
  /**
   * The number of spaces to use for indentation.
   * @default 2
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
   * @default "none"
   */
  getters?: "none" | "get" | "set" | "all";
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
   * @default "none"
   */
  numericSeparator?: "none" | (string & {});
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
   * @default { string: "green", symbol: "green", number: "yellow", bigint: "yellow", boolean: "yellow", null: "bold", undefined: "gray", date: "magenta", regexp: "red", special: "cyan" }
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
  readonly string: colorize.Color;
  readonly symbol: colorize.Color;
  readonly number: colorize.Color;
  readonly bigint: colorize.Color;
  readonly boolean: colorize.Color;
  readonly null: colorize.Color;
  readonly undefined: colorize.Color;
  readonly date: colorize.Color;
  readonly regexp: colorize.Color;
  readonly special: colorize.Color;
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
 */
export function show(value: unknown, options: ShowOptions = {}): string {
  const refs = new Map<object, number>();
  const getDefaultOptions = () =>
    (show as unknown as { defaultOptions: RequiredShowOptions }).defaultOptions;
  const defaultOptions = getDefaultOptions();
  const fullOptions = {
    ...defaultOptions,
    ...options,
    styles: { ...defaultOptions.styles, ...options.styles },
  };
  const tree = buildTree(value, {
    ...fullOptions,
    level: 0,
    ancestors: [],
    refs,
    c: colorize.buildC(fullOptions.colors, fullOptions.styles),
  });
  return stringify(tree, {
    ...fullOptions,
    level: 0,
    forceWrap: false,
    restLineLength: fullOptions.breakLength,
    refs,
  });
}
export declare namespace show {
  let defaultOptions: RequiredShowOptions;
}
Object.defineProperty(show, "defaultOptions", {
  get: (): RequiredShowOptions => ({
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
      regexp: "red",
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
  const { breakLength, colors, forceWrap, indent, level, referencePointer, refs, styles } = options;

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

    if (!forceWrap) result = stringify(inline, { ...options, indent: 0 });

    if (forceWrap || (indent && cleanANSI(result).length > options.restLineLength))
      result = stringify(wrap, { ...options, forceWrap: true, restLineLength: restLineLength() });
  }

  // sequence
  else if (type === "sequence") {
    const { values } = node;

    if (!forceWrap)
      result = values.map((value) => stringify(value, { ...options, indent: 0 })).join("");

    if (forceWrap || (indent && cleanANSI(result).length > options.restLineLength)) {
      result = "";
      for (const value of values)
        result += stringify(value, {
          ...options,
          forceWrap: true,
          restLineLength: restLineLength(),
        });
    }
  }

  // between
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (type === "between") {
    const { close, open, values } = node;

    if (!forceWrap)
      result =
        (open ? stringify(open, { ...options, indent: 0 }) : "") +
        values.map((val) => stringify(val, { ...options, indent: 0 })).join("") +
        (close ? stringify(close, { ...options, indent: 0 }) : "");

    if (forceWrap || (indent && cleanANSI(result).length > options.restLineLength)) {
      result = open ? stringify(open, { ...options, forceWrap: false }) : "";
      for (let i = 0; i < values.length; i++) {
        const value = values[i]!;
        if (i !== 0 || result) result += "\n" + " ".repeat((level + 1) * indent);
        result += stringify(value, {
          ...options,
          level: level + 1,
          forceWrap: false,
          restLineLength: restLineLength(),
        });
      }
      const after =
        close ?
          stringify(close, { ...options, forceWrap: false, restLineLength: restLineLength() })
        : "";
      if (after) result += (values.length ? "\n" + " ".repeat(level * indent) : "") + after;
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
  },
): Node {
  const {
    ancestors,
    arrayBracketSpacing,
    c,
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
      i !== parts.length - 1 ? { ...node, value: node.value + " +" } : node,
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
    const fullOptions = {
      ...options,
      omittedKeys: opts.omittedKeys || new Set(),
      level: options.level + 1,
      ancestors: [...ancestors, value],
      ...opts,
      styles: { ...options.styles, ...opts.styles },
    };
    if (fullOptions.level > fullOptions.depth + 1) throw new MaximumDepthError();
    if (
      fullOptions.colors !== colors ||
      Object.keys(fullOptions.styles).some(
        (key) => fullOptions.styles[key as keyof Styles] !== options.styles[key as keyof Styles],
      )
    )
      fullOptions.c = colorize.buildC(fullOptions.colors, fullOptions.styles);
    return buildTree(v, fullOptions);
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
          return { ...serializer(value, newOptions, expand), ref: value };
        }

      /* Initial setup */
      let bodyStyle: "Array" | "Object" = "Object";
      let prefix: Node | undefined = undefined;
      let prefixColor: keyof typeof c | null = null;
      let removeEmptyBody = false;
      let tmp: unknown;

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
          let str = value.stack;
          // The rule of `Symbol.toStringTag` for `Error`s is different from other
          // objects, so we should handle it here.
          const toStringTag = getToStringTag(value, showHidden);
          if (toStringTag)
            str = str.replace(
              // Escape special characters in the class name
              // Copied from: https://stackoverflow.com/a/3561711/21418758
              new RegExp(`^${className.replace(/[/\-\\^$*+?.()|[\]{}]/, "\\$&")}(?=:|$|\n)`, "m"),
              `${className} [${toStringTag}]`,
            );
          prefix = text(isValidErrorStack(value.stack) ? str : `[${str}]`);
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
            value instanceof Cached.GeneratorFunction ? "GeneratorFunction"
            : value instanceof Cached.AsyncFunction ? "AsyncFunction"
            : value instanceof Cached.AsyncGeneratorFunction ? "AsyncGeneratorFunction"
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
                Object.getPrototypeOf(prototype) ===
                  Cached.GeneratorFunction.prototype.prototype) ||
              (type === "AsyncGeneratorFunction" &&
                ownKeys.length === 0 &&
                Object.getPrototypeOf(prototype) ===
                  Cached.AsyncGeneratorFunction.prototype.prototype)
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
        if (showHidden === "exclude-meta") omittedKeys.add("length");
      }

      // Wrapper objects for primitives
      else if ((tmp = getWrapperClass(value))) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        const type = (tmp as Function).name;
        const openStr = `[${type}` + (className !== type ? ` (${className})` : "") + ": ";
        // For strings, it might be a long multiline string that should be broken into lines,
        // so we should expand the value here
        if (type === "String") {
          const data = (value as unknown as { valueOf(): string }).valueOf();
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
          Object.getOwnPropertyDescriptor(value, key)!.enumerable
        )
          otherKeys.push(key);
      }

      // Array element
      const entries: Node[] = arrayItemKeys.map((key) => expand(value[key as keyof typeof value]));
      if (hiddenArrayItemsCount)
        entries.push(
          text(
            c.gray(
              `... ${hiddenArrayItemsCount} more item${hiddenArrayItemsCount === 1 ? "" : "s"}`,
            ),
          ),
        );

      // Object key/value pair
      const objectEntries = otherKeys.map((key) => {
        const desc = Object.getOwnPropertyDescriptor(value, key)!;

        let keyDisplay =
          // Symbol keys should be wrapped with `[]`
          typeof key === "symbol" ? `[${c.symbol(key.toString())}]`
            // Always quote keys if `quoteKeys` is set to `"always"`
          : quoteKeys === "always" ? c.string(stringifyString(key, quoteStyle))
            // For string keys that are valid identifiers, we should show them as is
          : isIdentifier(key) ? key
            // For other string keys, we should wrap them with quotes
          : c.string(stringifyString(key, quoteStyle));
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
          (getters === "all" && !!desc.get) ||
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
          const aStr = String(cleanANSI(a.type === "text" ? a.value : a.values[0].value));
          const bStr = String(cleanANSI(b.type === "text" ? b.value : b.values[0].value));
          return (
            aStr < bStr ? -1
            : aStr > bStr ? 1
            : 0
          );
        });
      Array.prototype.push.apply(entries, objectEntries);

      /* Refine entries */
      // Promise
      if (value instanceof Promise) {
        entries.splice(0, 0, text(c.special("<state unknown>")));
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
          entries.push(sequence([expand(key), text(" => "), expand(val)]));
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
        for (const val of setItems) entries.push(expand(val));
      }

      // WeakMap and WeakSet
      else if (value instanceof WeakMap || value instanceof WeakSet) {
        entries.splice(0, 0, text(c.special("<items unknown>")));
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
          entries.splice(pointer, 0, text(c.gray(str)));
          pointer += 2;
        }
      }

      // ArrayBuffer
      else if (value instanceof ArrayBuffer) {
        // Uint8Contents
        let contents = "<";
        for (const byte of new Uint8Array(value)) {
          if (contents !== "<") contents += " ";
          let part = byte.toString(16);
          if (part.length === 1) part = "0" + part;
          contents += part;
        }
        contents += ">";
        entries.splice(0, 0, text(c.special("[Uint8Contents]") + ": " + contents));
        // byteLength
        entries.splice(1, 0, text("byteLength: " + c.number(value.byteLength)));
      }

      // DataView
      else if (value instanceof DataView) {
        // byteLength
        entries.splice(0, 0, text("byteLength: " + c.number(value.byteLength)));
        // byteOffset
        entries.splice(1, 0, text("byteOffset: " + c.number(value.byteOffset)));
        // buffer
        entries.splice(2, 0, pair(text("buffer: "), expand(value.buffer)));
      }

      /* Build body */
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
            prefix = { ...prefix, value: `${prefix.value} [${toStringTag}]` };
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
            prefixColor ? colorizeNode(prefix, c, prefixColor)
            : prefix
          : sequence([prefix, text(" "), body])
        : body;

      // Add reference pointer to help identify circular structures
      return { ...result, ref: value };
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
  return {
    type: "between",
    values,
    ...(open !== undefined ? { open } : {}),
    ...(close !== undefined ? { close } : {}),
  };
}

/**********************
 * Internal utilities *
 **********************/
/**
 * Get a global value. This function works in all environments, including Node.js and
 * browsers.
 * @param name The name of the global value.
 * @param defaultValue The default value if the global value is not defined.
 * @returns
 */
function getGlobalValue<T>(name: string, defaultValue: T): T {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return ${name}`)();
  } catch {
    return defaultValue;
  }
}
/**
 * Cached objects to be used by {@link show}.
 */
const Cached = {
  /* eslint-disable @typescript-eslint/no-unsafe-function-type */
  BigInt: getGlobalValue<Function>("BigInt", function () {}),

  GeneratorFunction: function* () {}.constructor as GeneratorFunctionConstructor,
  AsyncFunction: getGlobalValue<Function>("async function () {}.constructor", function () {}),
  AsyncGeneratorFunction: getGlobalValue<Function>(
    "async function* () {}.constructor",
    function () {},
  ),
  /* eslint-enable @typescript-eslint/no-unsafe-function-type */
};

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
    | "yellow",
): string {
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
  if (node.type === "text") return { ...node, value: c[color](node.value) };

  /* sequence */
  if (!node.values.length) return node;

  const values = [...node.values];
  const first = values[0]!;
  const last = values[values.length - 1]!;

  const [open, close] = c[color]("|").split("|", 2) as [string, string];

  // Open color
  if (first.type === "text") values[0] = { ...first, value: open + first.value };
  else values.splice(0, 0, text(open));

  // Close color
  if (last.type === "text") values[values.length - 1] = { ...last, value: last.value + close };
  else values.push(text(close));

  return { ...node, values };
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

/**
 * Get the class name of an object.
 * @param value The value to get the class name of.
 * @returns
 */
function getClassName(value: object): string {
  if (isLikelyPrototype(value)) {
    const proto = Object.getPrototypeOf(value);
    return (proto.constructor && proto.constructor.name) || "Object";
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (value.constructor && value.constructor.name) || "Object";
}

/**
 * Get the `Symbol.toStringTag` property of an object if satisfies the following conditions:
 *
 * - It is a string.
 * - It is not an empty string.
 * - It is not already displayed by `showHidden`.
 * - It is not equal to the class name.
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
        toStringTag !== getClassName(value)
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
  if (value instanceof Cached.BigInt) return Cached.BigInt;
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
  if (quoteStyle === "single") return `'${unescaped.replace(/'/g, "\\'")}'`;
  if (quoteStyle === "backtick") return `\`${unescaped.replace(/`/g, "\\`")}\``;
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
function stringifyNumber(value: number | bigint, sep: "none" | (string & {})): string {
  if (sep === "none")
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return (Object.is(value, -0) ? "-0" : value) + (typeof value === "bigint" ? "n" : "");
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const parts = (Object.is(value, -0) ? "-0" : "" + value).split(".");
  return (
    // TODO: Refactor this slow regex to a faster implementation
    // eslint-disable-next-line sonarjs/slow-regex
    parts[0]!.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + sep) +
    (parts[1] ? "." + parts[1].replace(/(\d{3})/g, "$1" + sep) : "") +
    (typeof value === "bigint" ? "n" : "")
  );
}

/**
 * Check if a name is a valid JavaScript identifier.
 * @returns
 */
function isIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
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
 * Check if an error stack is valid.
 * @param stack The stack to check.
 * @returns
 */
function isValidErrorStack(stack: string): boolean {
  const lines = stack.split("\n");
  if (lines.length < 2) return false;
  return lines.slice(1).some((line) => line.startsWith("    at"));
}

/**
 * Check if a value is an object (including functions and arrays).
 * @param value The value to check.
 * @returns
 */
function isObject(value: unknown): value is object {
  return value !== null && (typeof value === "object" || typeof value === "function");
}

/**
 * Check if a value is likely the `prototype` of a class.
 * @param value The value to check.
 * @returns
 */
function isLikelyPrototype(value: object): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return value === (value.constructor && value.constructor.prototype);
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
