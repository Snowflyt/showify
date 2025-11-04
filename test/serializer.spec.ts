import { describe, expect, it } from "vitest";

import { Node as SerializerNode, serializer, show } from "../src";

const { between, sequence, text } = SerializerNode;

describe("Serializer", () => {
  it("should handle basic custom serializer", () => {
    class CustomClass {
      constructor(public value: number) {}
    }

    const ser = serializer({
      if: (value) => value instanceof CustomClass,
      then: (value) => text(`CustomClass(${value.value})`),
    });

    const obj = new CustomClass(42);
    expect(show(obj, { serializers: [ser] })).toEqual("CustomClass(42)");
  });

  it("should handle serializer with nested objects", () => {
    class NestedClass {
      constructor(public data: { value: number; items: string[] }) {}
    }

    const ser = serializer({
      if: (value) => value instanceof NestedClass,
      then: (value, _options, expand) => sequence([text("NestedClass "), expand(value.data)]),
    });

    const obj = new NestedClass({ value: 42, items: ["a", "b"] });
    expect(show(obj, { serializers: [ser] })).toEqual(
      'NestedClass { value: 42, items: ["a", "b"] }',
    );
  });

  it("should handle multiple serializers in order", () => {
    class ClassA {
      constructor(public value: string) {}
    }
    class ClassB {
      constructor(public value: number) {}
    }

    const serA = serializer({
      if: (value) => value instanceof ClassA,
      then: (value) => text(`A(${value.value})`),
    });

    const serB = serializer({
      if: (value) => value instanceof ClassB,
      then: (value) => text(`B(${value.value})`),
    });

    const objA = new ClassA("hello");
    const objB = new ClassB(42);

    expect(show(objA, { serializers: [serA, serB] })).toEqual("A(hello)");
    expect(show(objB, { serializers: [serA, serB] })).toEqual("B(42)");
  });

  it("should handle serializer with circular references", () => {
    class CircularClass {
      constructor(
        public name: string,
        public ref?: CircularClass,
      ) {}
    }

    const ser = serializer({
      if: (value) => value instanceof CircularClass,
      then: (value, _options, expand) =>
        sequence([
          text(`CircularClass(${value.name})`),
          ...(value.ref ? [text(" -> ")] : []),
          ...(value.ref ? [expand(value.ref)] : []),
        ]),
    });

    const obj1 = new CircularClass("first");
    const obj2 = new CircularClass("second", obj1);
    obj1.ref = obj2;

    expect(show(obj1, { serializers: [ser] })).toEqual(
      "<ref *1> CircularClass(first) -> CircularClass(second) -> [Circular *1]",
    );
  });

  it("should handle serializer with options", () => {
    class OptionsClass {
      constructor(public items: number[]) {}
    }

    const ser = serializer({
      if: (value) => value instanceof OptionsClass,
      then: (value, options, expand) =>
        sequence([
          text("Items"),
          options.sorted ? expand(value.items.slice().sort()) : expand(value.items),
        ]),
    });

    const obj = new OptionsClass([3, 1, 4, 1, 5]);
    expect(show(obj, { serializers: [ser] })).toEqual("Items[3, 1, 4, 1, 5]");
    expect(show(obj, { serializers: [ser], sorted: true })).toEqual("Items[1, 1, 3, 4, 5]");
  });

  it("should handle serializer with custom formatting", () => {
    class FormattedClass {
      constructor(public value: string) {}
    }

    const ser = serializer({
      if: (value) => value instanceof FormattedClass,
      then: (value, _options, expand) => between([expand(value.value)], text("<<"), text(">>")),
    });

    const obj = new FormattedClass("test");
    expect(show(obj, { serializers: [ser] })).toEqual('<<"test">>');
  });

  it("should handle serializer with depth control", () => {
    class DepthClass {
      constructor(public value: any) {}
    }

    const nested = new DepthClass(new DepthClass(new DepthClass({ x: 1 })));

    let ser = serializer({
      if: (value) => value instanceof DepthClass,
      then: (value, _options, expand) => sequence([text("Depth("), expand(value.value), text(")")]),
    });
    expect(show(nested, { serializers: [ser], depth: 1 })).toEqual("Depth(Depth([DepthClass]))");

    ser = serializer({
      if: (value) => value instanceof DepthClass,
      then: (value, _options, expand) =>
        sequence([text("Depth("), expand(value.value, { level: 0, depth: 1 }), text(")")]),
    });

    expect(show(nested, { serializers: [ser], depth: 1 })).toEqual("Depth(Depth(Depth({ x: 1 })))");
  });

  it("should respect provided expand options in custom serializer", () => {
    const ser = serializer({
      if: (value, { omittedKeys }): value is { _tag: string } =>
        "_tag" in value &&
        typeof value._tag === "string" &&
        // Detect if `_tag` is already omitted to avoid infinite recursion
        !omittedKeys.has("_tag"),
      then: (value, { ancestors, c, level }, expand) =>
        sequence([
          text(c.blue(value._tag)),
          text("("),
          expand(value, {
            // Reset `level` to avoid auto incrementing
            level,
            // Omit the `_tag` key when expanding the object
            omittedKeys: new Set(["_tag"]),
            // Avoid auto-adding current value to `ancestors` to avoid circulars
            ancestors: [...ancestors],
          }),
          text(")"),
        ]),
    });

    const obj = { _tag: "Some", value: 42, nested: { foo: { bar: { baz: "qux" } } } };
    expect(show(obj, { serializers: [ser], depth: 2 })).toEqual(
      "Some({ value: 42, nested: { foo: { bar: [Object] } } })",
    );
  });
});
