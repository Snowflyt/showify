import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("ArrayBuffer", () => {
  it("should show empty array buffer", () => {
    const buffer = new ArrayBuffer(0);

    expect(show(buffer)).toEqual("ArrayBuffer { [Uint8Contents]: <>, [byteLength]: 0 }");
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should show array buffer with single byte", () => {
    const buffer = new ArrayBuffer(1);
    new Uint8Array(buffer)[0] = 0xff;

    expect(show(buffer)).toEqual("ArrayBuffer { [Uint8Contents]: <ff>, [byteLength]: 1 }");
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should show array buffer with multiple bytes", () => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint8Array(buffer);
    view[0] = 0x12;
    view[1] = 0x34;
    view[2] = 0x56;
    view[3] = 0x78;

    expect(show(buffer)).toEqual("ArrayBuffer { [Uint8Contents]: <12 34 56 78>, [byteLength]: 4 }");
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should show array buffer with `Symbol.toStringTag`", () => {
    const buffer = new ArrayBuffer(2);
    const view = new Uint8Array(buffer);
    view[0] = 0xaa;
    view[1] = 0xbb;
    Object.defineProperty(buffer, Symbol.toStringTag, { value: "MyTag" });

    expect(show(buffer)).toEqual(
      "ArrayBuffer [MyTag] { [Uint8Contents]: <aa bb>, [byteLength]: 2 }",
    );
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should pad single digit hex values with zero", () => {
    const buffer = new ArrayBuffer(3);
    const view = new Uint8Array(buffer);
    view[0] = 0x01;
    view[1] = 0x02;
    view[2] = 0x03;

    expect(show(buffer)).toEqual("ArrayBuffer { [Uint8Contents]: <01 02 03>, [byteLength]: 3 }");
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });
});

describe("SharedArrayBuffer", () => {
  it("should show empty shared array buffer", () => {
    const buffer = new SharedArrayBuffer(0);

    expect(show(buffer)).toEqual("SharedArrayBuffer { [Uint8Contents]: <>, [byteLength]: 0 }");
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should show shared array buffer with single byte", () => {
    const buffer = new SharedArrayBuffer(1);
    new Uint8Array(buffer)[0] = 0xff;

    expect(show(buffer)).toEqual("SharedArrayBuffer { [Uint8Contents]: <ff>, [byteLength]: 1 }");
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should show shared array buffer with multiple bytes", () => {
    const buffer = new SharedArrayBuffer(4);
    const view = new Uint8Array(buffer);
    view[0] = 0x12;
    view[1] = 0x34;
    view[2] = 0x56;
    view[3] = 0x78;

    expect(show(buffer)).toEqual(
      "SharedArrayBuffer { [Uint8Contents]: <12 34 56 78>, [byteLength]: 4 }",
    );
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should show shared array buffer with `Symbol.toStringTag`", () => {
    const buffer = new SharedArrayBuffer(2);
    const view = new Uint8Array(buffer);
    view[0] = 0xaa;
    view[1] = 0xbb;
    Object.defineProperty(buffer, Symbol.toStringTag, { value: "MyTag" });

    expect(show(buffer)).toEqual(
      "SharedArrayBuffer [MyTag] { [Uint8Contents]: <aa bb>, [byteLength]: 2 }",
    );
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });

  it("should pad single digit hex values with zero", () => {
    const buffer = new SharedArrayBuffer(3);
    const view = new Uint8Array(buffer);
    view[0] = 0x01;
    view[1] = 0x02;
    view[2] = 0x03;

    expect(show(buffer)).toEqual(
      "SharedArrayBuffer { [Uint8Contents]: <01 02 03>, [byteLength]: 3 }",
    );
    expect(inspect(buffer)).toEqual(util.inspect(buffer));
    // TODO: Uncomment this until Node.js fixes util.inspect for extra properties coloring
    // expect(inspect(buffer, { colors: true })).toEqual(util.inspect(buffer, { colors: true }));
  });
});
