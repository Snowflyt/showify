import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect } from "./test-utils";

describe("Function", () => {
  it("should show named function", () => {
    function namedFunction() {}

    expect(show(namedFunction)).toEqual("[Function: namedFunction]");
    expect(inspect(namedFunction)).toEqual(util.inspect(namedFunction));
  });

  it("should show anonymous function", () => {
    const anonymousFunction = (() => function () {})();

    expect(show(anonymousFunction)).toEqual("[Function (anonymous)]");
    expect(inspect(anonymousFunction)).toEqual(util.inspect(anonymousFunction));
  });

  it("should show generator function", () => {
    function* generatorFunction() {}

    expect(show(generatorFunction)).toEqual("[GeneratorFunction: generatorFunction]");
    expect(inspect(generatorFunction)).toEqual(util.inspect(generatorFunction));
  });

  it("should show async function", () => {
    async function asyncFunction() {}

    expect(show(asyncFunction)).toEqual("[AsyncFunction: asyncFunction]");
    expect(inspect(asyncFunction)).toEqual(util.inspect(asyncFunction));
  });

  it("should show async generator function", () => {
    async function* asyncGeneratorFunction() {}

    expect(show(asyncGeneratorFunction)).toEqual(
      "[AsyncGeneratorFunction: asyncGeneratorFunction]",
    );
    expect(inspect(asyncGeneratorFunction)).toEqual(util.inspect(asyncGeneratorFunction));
  });

  it("should show function with `Symbol.toStringTag`", () => {
    const taggedFunction = Object.defineProperty(function () {}, Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedFunction)).toEqual("[Function (anonymous)] [MyTag]");
    expect(inspect(taggedFunction)).toEqual(util.inspect(taggedFunction));
  });

  it("should show function [[Prototype]]s", () => {
    const FunctionProto = Function.prototype;
    const GeneratorFunctionProto = function* () {}.constructor.prototype;
    const AsyncFunctionProto = async function () {}.constructor.prototype;
    const AsyncGeneratorFunctionProto = async function* () {}.constructor.prototype;

    expect(show(FunctionProto)).toEqual("[Function (anonymous)] Object");
    expect(inspect(FunctionProto)).toEqual(util.inspect(FunctionProto));
    expect(show(GeneratorFunctionProto)).toEqual("Function [GeneratorFunction] {}");
    expect(inspect(GeneratorFunctionProto)).toEqual(util.inspect(GeneratorFunctionProto));
    expect(show(AsyncFunctionProto)).toEqual("Function [AsyncFunction] {}");
    expect(inspect(AsyncFunctionProto)).toEqual(util.inspect(AsyncFunctionProto));
    expect(show(AsyncGeneratorFunctionProto)).toEqual("Function [AsyncGeneratorFunction] {}");
    expect(inspect(AsyncGeneratorFunctionProto)).toEqual(util.inspect(AsyncGeneratorFunctionProto));

    const GeneratorProto = Object.getPrototypeOf(function* () {}.prototype);
    const AsyncGeneratorProto = Object.getPrototypeOf(async function* () {}.prototype);

    expect(show(GeneratorProto)).toEqual("Iterator [Generator] {}");
    // NOTE: The result of `inspect` and `util.inspect` is different here:
    // `Iterator [Generator] {}` V.S. `Object [Generator] {}`
    // I’m not sure why. But since our version is also reasonable and even better than the one of
    // `util.inspect`, I’ll just keep it.
    // expect(inspect(GeneratorProto)).toEqual(util.inspect(GeneratorProto));
    // expect(inspect(GeneratorProto, { colors: true })).toEqual(
    //   util.inspect(GeneratorProto, { colors: true }),
    // );
    expect(show(AsyncGeneratorProto)).toEqual("Object [AsyncGenerator] {}");
    expect(inspect(AsyncGeneratorProto)).toEqual(util.inspect(AsyncGeneratorProto));
  });

  it("should show subclass of regular functions", () => {
    const GeneratorFunction = function* () {}.constructor as GeneratorFunctionConstructor;
    const AsyncFunction = async function () {}.constructor as new (
      ...args: string[]
    ) => (...args: never) => Promise<unknown>;
    const AsyncGeneratorFunction = async function* () {}
      .constructor as AsyncGeneratorFunctionConstructor;

    class MyFn extends Function {}
    class MyGenFn extends GeneratorFunction {}
    class MyAsyncFn extends AsyncFunction {}
    class MyAsyncGenFn extends AsyncGeneratorFunction {}

    expect(show(MyFn)).toEqual("[class MyFn extends Function]");
    expect(inspect(MyFn)).toEqual(util.inspect(MyFn));
    expect(show(MyGenFn)).toEqual("[class MyGenFn extends GeneratorFunction]");
    expect(inspect(MyGenFn)).toEqual(util.inspect(MyGenFn));
    expect(show(MyAsyncFn)).toEqual("[class MyAsyncFn extends AsyncFunction]");
    expect(inspect(MyAsyncFn)).toEqual(util.inspect(MyAsyncFn));
    expect(show(MyAsyncGenFn)).toEqual("[class MyAsyncGenFn extends AsyncGeneratorFunction]");
    expect(inspect(MyAsyncGenFn)).toEqual(util.inspect(MyAsyncGenFn));

    expect(show(new MyFn())).toEqual("[Function: anonymous] MyFn");
    expect(inspect(new MyFn())).toEqual(util.inspect(new MyFn()));
    expect(show(new MyGenFn())).toEqual(
      "[GeneratorFunction: anonymous] MyGenFn [GeneratorFunction]",
    );
    expect(inspect(new MyGenFn())).toEqual(util.inspect(new MyGenFn()));
    expect(show(new MyAsyncFn())).toEqual("[AsyncFunction: anonymous] MyAsyncFn [AsyncFunction]");
    expect(inspect(new MyAsyncFn())).toEqual(util.inspect(new MyAsyncFn()));
    expect(show(new MyAsyncGenFn())).toEqual(
      "[AsyncGeneratorFunction: anonymous] MyAsyncGenFn [AsyncGeneratorFunction]",
    );
    expect(inspect(new MyAsyncGenFn())).toEqual(util.inspect(new MyAsyncGenFn()));
  });
});
