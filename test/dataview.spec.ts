import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("DataView", () => {
  it("should show empty data view", () => {
    const buffer = new ArrayBuffer(0);
    const view = new DataView(buffer);

    expect(show(view)).toEqual(
      "DataView { byteLength: 0, byteOffset: 0, buffer: ArrayBuffer { [Uint8Contents]: <>, byteLength: 0 } }",
    );
    expect(inspect(view)).toEqual(util.inspect(view));
    expect(inspect(view, { colors: true })).toEqual(util.inspect(view, { colors: true }));
  });

  it("should show data view with offset", () => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer, 1, 2);

    expect(show(view)).toEqual(
      "DataView { byteLength: 2, byteOffset: 1, buffer: ArrayBuffer { [Uint8Contents]: <00 00 00 00>, byteLength: 4 } }",
    );
    expect(inspect(view)).toEqual(util.inspect(view));
    expect(inspect(view, { colors: true })).toEqual(util.inspect(view, { colors: true }));
  });

  it("should show data view with values", () => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setInt32(0, 0x12345678);

    expect(show(view)).toEqual(
      "DataView { byteLength: 4, byteOffset: 0, buffer: ArrayBuffer { [Uint8Contents]: <12 34 56 78>, byteLength: 4 } }",
    );
    expect(inspect(view)).toEqual(util.inspect(view));
    expect(inspect(view, { colors: true })).toEqual(util.inspect(view, { colors: true }));
  });

  it("should show data view with `Symbol.toStringTag`", () => {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setInt16(0, 0xabcd);
    Object.defineProperty(view, Symbol.toStringTag, { value: "MyTag" });

    expect(show(view)).toEqual(
      "DataView [MyTag] { byteLength: 2, byteOffset: 0, buffer: ArrayBuffer { [Uint8Contents]: <ab cd>, byteLength: 2 } }",
    );
    expect(inspect(view)).toEqual(util.inspect(view));
    expect(inspect(view, { colors: true })).toEqual(util.inspect(view, { colors: true }));
  });
});
