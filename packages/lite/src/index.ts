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
   * The line length that the output should wrap at. If `indent` is `0`, this option is ignored.
   * @default 80
   */
  breakLength?: number;
  /**
   * Whether to show non-enumerable properties, should be `"none"` or `"always"`.
   *
   * For compatibility with Node.js’s `util.inspect`, `true` is also accepted as `"always"`, and
   * `false` is also accepted as `"none"`, but it is recommended to use the string values for
   * clarity.
   * @default "none"
   */
  showHidden?: "none" | "always" | boolean;
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
   * NOTE: This option is not recursive, so it only omits the top-level keys.
   */
  omittedKeys?: Set<string | symbol>;
  /**
   * The quote style to use for strings.
   * @default "double"
   */
  quoteStyle?: "single" | "double";
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
   * An array of `{ if: (value) => boolean, then: (value, options, expand) => Node }` objects to
   * handle custom cases.
   *
   * NOTE: These custom serializers are only invoked for objects, primitives are not passed to them.
   */
  serializers?: readonly Serializer[];
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
  } extends infer R ?
    // Expand the type to human-readable format in TypeScript
    { [K in keyof R]: R[K] }
  : never;

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
 * encounter, including auto line breaking, indentation, circular references (with reference
 * numbers), classes, wrapper objects, `Map`, array empty items, typed arrays, `Date`, `RegExp`,
 * `Error`, `Promise`, and more.
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
 * console.log(show(value, { indent: 2, trailingComma: "auto" }));
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
    (show as unknown as { defaultOptions: Required<ShowOptions> }).defaultOptions;
  const defaultOptions = getDefaultOptions();
  const fullOptions = Object.assign({}, defaultOptions, options);
  const tree = buildTree(value, Object.assign({}, fullOptions, { level: 0, ancestors: [], refs }));
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
  let defaultOptions: Required<ShowOptions>;
}
Object.defineProperty(show, "defaultOptions", {
  get: (): Required<ShowOptions> => ({
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
    quoteStyle: "double",
    quoteKeys: "auto",
    numericSeparator: "none",
    trailingComma: "none",
    arrayBracketSpacing: false,
    objectCurlySpacing: true,
    referencePointer: true,
    maxArrayLength: Infinity,
    maxStringLength: Infinity,
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
  options: Required<ShowOptions> & {
    level: number;
    forceWrap: boolean;
    restLineLength: number;
    refs: Map<object, number>;
  },
): string {
  const { type } = node;
  const { breakLength, forceWrap, indent, level, referencePointer, refs } = options;

  if (type === "circular")
    return referencePointer ? `[Circular *${refs.get(node.ref)!}]` : "[Circular]";

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

    if (!forceWrap) result = stringify(inline, Object.assign({}, options, { indent: 0 }));

    if (forceWrap || (indent && result.length > options.restLineLength))
      result = stringify(
        wrap,
        Object.assign({}, options, { forceWrap: true, restLineLength: restLineLength() }),
      );
  }

  // sequence
  else if (type === "sequence") {
    const { values } = node;

    if (!forceWrap)
      result = values
        .map((value) => stringify(value, Object.assign({}, options, { indent: 0 })))
        .join("");

    if (forceWrap || (indent && result.length > options.restLineLength)) {
      result = "";
      for (const value of values)
        result += stringify(
          value,
          Object.assign({}, options, {
            forceWrap: true,
            restLineLength: restLineLength(),
          }),
        );
    }
  }

  // between
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (type === "between") {
    const { close, open, values } = node;

    if (!forceWrap)
      result =
        (open ? stringify(open, Object.assign({}, options, { indent: 0 })) : "") +
        values.map((val) => stringify(val, Object.assign({}, options, { indent: 0 }))).join("") +
        (close ? stringify(close, Object.assign({}, options, { indent: 0 })) : "");

    if (forceWrap || (indent && result.length > options.restLineLength)) {
      result = open ? stringify(open, Object.assign({}, options, { forceWrap: false })) : "";
      for (let i = 0; i < values.length; i++) {
        const value = values[i]!;
        if (i !== 0 || result) result += "\n" + " ".repeat((level + 1) * indent);
        result += stringify(
          value,
          Object.assign({}, options, {
            level: level + 1,
            forceWrap: false,
            restLineLength: restLineLength(),
          }),
        );
      }
      const after =
        close ?
          stringify(
            close,
            Object.assign({}, options, { forceWrap: false, restLineLength: restLineLength() }),
          )
        : "";
      if (after) result += (values.length ? "\n" + " ".repeat(level * indent) : "") + after;
    }
  }
  /* Handle nodes end */

  // Add reference pointer if available
  if (referencePointer && "ref" in node && node.ref) {
    const pointer = refs.get(node.ref);
    if (pointer) return `<ref *${pointer}>` + " " + result;
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
  options: SerializerOptions & {
    refs: Map<object, number>;
    breakLength: number; // Only used for Node.js compatibility
    referencePointer: boolean; // Only used for Node.js compatibility
  },
): Node {
  const {
    ancestors,
    arrayBracketSpacing,
    callCustomInspect,
    callNodeInspect,
    callToJSON,
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
  if (value === undefined) return text("undefined");
  if (value === null) return text("null");
  if (typeof value === "string") {
    const truncated = value.length > maxStringLength;
    const truncatedStr = truncated ? value.slice(0, maxStringLength) : value;
    const ellipsis =
      truncated ?
        `... ${value.length - maxStringLength} more character` +
        (value.length - maxStringLength === 1 ? "" : "s")
      : "";

    const inline = (value: string, ellipsis = "") =>
      text(stringifyString(value, quoteStyle) + ellipsis);

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
  if (typeof value === "symbol") return text(value.toString());
  if (typeof value === "number") return text(stringifyNumber(value, numericSeparator));
  if (typeof value === "bigint") return text(stringifyNumber(value, numericSeparator));
  if (typeof value === "boolean") return text(value.toString());

  /* Helper functions */
  const expand = (v: unknown, opts: Partial<SerializerOptions> = {}) => {
    const fullOptions = Object.assign(
      {},
      options,
      {
        omittedKeys: opts.omittedKeys || new Set(),
        level: options.level + 1,
        ancestors: ancestors.concat([value]),
      },
      opts,
    );
    if (fullOptions.level > fullOptions.depth + 1) throw new MaximumDepthError();
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
            serializers,
            level: options.level + 1,
            ancestors,
          } satisfies SerializerOptions;
          return Object.assign({}, serializer(value, newOptions, expand), { ref: value });
        }

      if (
        callCustomInspect &&
        !omittedKeys.has(CustomInspectSymbol) &&
        !(value instanceof Date) &&
        typeof (value as { [CustomInspectSymbol]?: unknown })[CustomInspectSymbol] === "function"
      )
        return (value as { [CustomInspectSymbol]: CustomInspectFunction })[CustomInspectSymbol](
          options,
          expand,
        );
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
        return expand(
          result,
          // Keep all options as is
          { omittedKeys, level: options.level, ancestors },
        );
      }
      if (
        callToJSON &&
        !omittedKeys.has("toJSON") &&
        !(value instanceof Date) &&
        typeof (value as { toJSON?: unknown }).toJSON === "function"
      )
        return expand(
          (value as { toJSON: () => unknown }).toJSON(),
          // Keep all options as is
          { omittedKeys, level: options.level, ancestors },
        );

      /* Initial setup */
      let bodyStyle: "Array" | "Object" = "Object";
      let prefix: Node | undefined = undefined;
      const extraEntries: Node[] = []; // Before main entries
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
          const type =
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
        prefix = text(str);
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
          prefix = sequence([text(openStr), expand(data, { depth: Infinity }), text("]")]);
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
        }
        removeEmptyBody = true;
      }

      /* Build base entries */
      const formatKey = (key: string | symbol): string =>
        typeof key === "symbol" ? key.toString()
          // Always quote keys if `quoteKeys` is set to `"always"`
        : quoteKeys === "always" ? stringifyString(key, quoteStyle)
          // For string keys that are valid identifiers, we should show them as is
        : /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key
          // For other string keys, we should wrap them with quotes
        : stringifyString(key, quoteStyle);

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
      // Preserve Error.cause
      if (
        value instanceof Error &&
        allKeys.indexOf("cause") !== -1 &&
        otherKeys.indexOf("cause") === -1
      )
        otherKeys.push("cause");

      // Array element
      const arrayEntries: Node[] = arrayItemKeys.map((key) =>
        expand(value[key as keyof typeof value]),
      );
      if (hiddenArrayItemsCount)
        arrayEntries.push(
          text(`... ${hiddenArrayItemsCount} more item${hiddenArrayItemsCount === 1 ? "" : "s"}`),
        );

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

        if (!shouldExpand) return text(`${keyDisplay}: [${propType}]`);

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
          return text(`${keyDisplay}: [${propType}: <Inspection threw (${errorMessage})>]`);

        // Show objects as `foo: [Getter/Setter] { bar: "baz" }`
        if (isObject(val)) return pair(text(`${keyDisplay}: [${propType}] `), expand(val));

        // Show primitives as `foo: [Getter: "hello"]`
        return sequence([text(`${keyDisplay}: [${propType}: `), expand(val), text("]")]);
      });
      if (sorted)
        // Sort object keys if `sorted` is `true`
        objectEntries.sort((a, b) => {
          const aStr = a.type === "text" ? a.value : a.values[0].value;
          const bStr = b.type === "text" ? b.value : b.values[0].value;
          return (
            aStr < bStr ? -1
            : aStr > bStr ? 1
            : 0
          );
        });

      /* Refine entries */
      // Promise
      if (value instanceof Promise) {
        extraEntries.push(text("<state unknown>"));
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
        extraEntries.push(text("<items unknown>"));
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
          arrayEntries.splice(pointer, 0, text(str));
          pointer += 2;
        }
        // Insert trailing empty item markers if necessary
        let lastKey = integerKeys[integerKeys.length - 1];
        if (lastKey === undefined) lastKey = -1;
        const len = value.length;
        if (lastKey < len - 1) {
          const str = `<${len - lastKey - 1} empty item${len - lastKey - 1 === 1 ? "" : "s"}>`;
          arrayEntries.push(text(str));
        }
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
            prefix
          : sequence([prefix, text(" "), body])
        : body;

      // Add reference pointer to help identify circular structures
      return Object.assign({}, result, { ref: value });
    } catch (err) {
      if (err instanceof MaximumDepthError)
        return text(
          `[${className}${Object.getPrototypeOf(value) === null ? ": null prototype" : ""}]`,
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

const generatorFunctionRegExp = /^\s*(?:function)?\*/;
const asyncFunctionRegExp =
  /^\s*async(?:\s+function(?:\s+[A-Za-z_$][A-Za-z0-9_$]*|\s*\()|\s*\(|\s+[A-Za-z_$][A-Za-z0-9_$]*\s*\(|\s*\[)/;
const asyncGeneratorFunctionRegExp = /^\s*async\s*(?:function\s*)?\*/;

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
function stringifyString(value: string, quoteStyle: "single" | "double"): string {
  if (quoteStyle === "double") return JSON.stringify(value);
  return `'${JSON.stringify(value).slice(1, -1).replace(/'/g, "\\'").replace(/\\"/g, '"')}'`;
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

/**
 * Custom inspect method for {@linkcode show} (`Symbol.for("showify.inspect.custom")`).
 */
export type CustomInspectFunction = (
  options: SerializerOptions,
  expand: (value: unknown, options?: Partial<SerializerOptions>) => Node,
) => Node;

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
  stylize(
    text: string,
    styleType:
      | "string"
      | "symbol"
      | "number"
      | "bigint"
      | "boolean"
      | "null"
      | "undefined"
      | "date"
      | "regexp"
      | "special"
      | "module",
  ): string;
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
  "serializers",
] as const satisfies (keyof ShowOptions)[];

/**
 * Convert {@linkcode SerializerOptions} to Node.js `util.inspect` options.
 * @param opts The options to convert.
 * @returns
 */
function convertToInspectOptions(
  opts: SerializerOptions & { breakLength: number; referencePointer: boolean },
): InspectOptionsStylized {
  return Object.assign(
    {
      stylize: function stylize(text, _styleType) {
        return text;
      },
      showHidden: opts.showHidden !== "none" && opts.showHidden !== false,
      depth: opts.depth - opts.level,
      colors: false, // Unsupported in this library, use a dummy value
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
      callNodeInspect: opts.customInspect,
      callCustomInspect: opts.customInspect,
      maxArrayLength: opts.maxArrayLength,
      maxStringLength: opts.maxStringLength,
      indent: opts.breakLength === Infinity ? 0 : 2,
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
