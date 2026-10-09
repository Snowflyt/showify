/*!
 * Copyright (c) 2026 Ge Gao (Snowflyt) and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from "vitest";

import type { SerializerOptions } from "../src";
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

describe.each(["serializer", "custom inspect"])("Reference identity via %s", (entryPoint) => {
  const customInspect = Symbol.for("showify.inspect.custom");

  class Box {
    constructor(public child: unknown) {}

    [customInspect](
      _options: SerializerOptions,
      expand: (value: unknown, options?: Partial<SerializerOptions>) => SerializerNode,
    ) {
      return expand(this.child);
    }
  }

  const options =
    entryPoint === "serializer" ?
      {
        serializers: [
          serializer({
            if: (value) => value instanceof Box,
            then: (value, _options, expand) => expand(value.child),
          }),
        ],
      }
    : {};

  it("should preserve the identity of a directly returned circular node", () => {
    const root: { box?: Box } = {};
    root.box = new Box(root);

    expect(show(root, options)).toEqual("<ref *1> { box: [Circular *1] }");
  });

  it("should preserve the identity of a directly returned child root", () => {
    const child: { self?: unknown } = {};
    child.self = child;
    const box = new Box(child);

    expect(show(box, options)).toEqual("<ref *1> { self: [Circular *1] }");
    expect(show({ left: box, right: box }, options)).toEqual(
      "{ left: <ref *1> { self: [Circular *1] }, right: <ref *1> { self: [Circular *1] } }",
    );
  });

  it("should retain the outer identity when a child points back to it", () => {
    const child: { owner?: Box; self?: unknown } = {};
    const box = new Box(child);
    child.owner = box;

    expect(show(box, options)).toEqual("<ref *1> { owner: [Circular *1] }");

    child.self = child;
    expect(show(box, options)).toEqual(
      "<ref *1> <ref *2> { owner: [Circular *1], self: [Circular *2] }",
    );
  });

  it("should define the pointer when directly expanding itself", () => {
    const box = new Box(undefined);
    box.child = box;

    expect(show(box, options)).toEqual("<ref *1> [Circular *1]");
  });

  it("should expand shared objects without treating them as circular", () => {
    const child = { value: 42 };
    const box = new Box(child);

    expect(show(box, options)).toEqual("{ value: 42 }");
    expect(show({ left: box, right: box, child }, options)).toEqual(
      "{ left: { value: 42 }, right: { value: 42 }, child: { value: 42 } }",
    );
  });

  it("should respect referencePointer when directly returning nodes", () => {
    const root: { box?: Box } = {};
    root.box = new Box(root);
    const child: { self?: unknown } = {};
    child.self = child;

    expect(show(root, { ...options, referencePointer: false })).toEqual("{ box: [Circular] }");
    expect(show(new Box(child), { ...options, referencePointer: false })).toEqual(
      "{ self: [Circular] }",
    );
  });

  it("should avoid duplicate pointers when re-expanding the same object", () => {
    const box = new Box(undefined);
    box.child = box;
    const expandSelf = (
      value: Box,
      { ancestors, level }: SerializerOptions,
      expand: (value: unknown, options?: Partial<SerializerOptions>) => SerializerNode,
    ) =>
      expand(value, {
        ancestors,
        level,
        serializers: [],
        callCustomInspect: false,
        omittedKeys: new Set([customInspect]),
      });

    const selfOptions =
      entryPoint === "serializer" ?
        { serializers: [serializer({ if: (value) => value instanceof Box, then: expandSelf })] }
      : {};
    if (entryPoint === "custom inspect")
      box[customInspect] = (options, expand) => expandSelf(box, options, expand);

    expect(show(box, selfOptions)).toEqual("<ref *1> Box { child: [Circular *1] }");
  });
});
