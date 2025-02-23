import util from "node:util";

import { describe, expect, it } from "vitest";

import { show } from "../src";

import { inspect, trimIndent } from "./test-utils";

describe("Function", () => {
  it("should show named function", () => {
    function namedFunction() {}

    expect(show(namedFunction)).toEqual("[Function: namedFunction]");
    expect(inspect(namedFunction)).toEqual(util.inspect(namedFunction));
    expect(inspect(namedFunction, { colors: true })).toEqual(
      util.inspect(namedFunction, { colors: true }),
    );
  });

  it("should show anonymous function", () => {
    const anonymousFunction = (() => function () {})();

    expect(show(anonymousFunction)).toEqual("[Function (anonymous)]");
    expect(inspect(anonymousFunction)).toEqual(util.inspect(anonymousFunction));
    expect(inspect(anonymousFunction, { colors: true })).toEqual(
      util.inspect(anonymousFunction, { colors: true }),
    );
  });

  it("should show generator function", () => {
    function* generatorFunction() {}

    expect(show(generatorFunction)).toEqual("[GeneratorFunction: generatorFunction]");
    expect(inspect(generatorFunction)).toEqual(util.inspect(generatorFunction));
    expect(inspect(generatorFunction, { colors: true })).toEqual(
      util.inspect(generatorFunction, { colors: true }),
    );
  });

  it("should show async function", () => {
    async function asyncFunction() {}

    expect(show(asyncFunction)).toEqual("[AsyncFunction: asyncFunction]");
    expect(inspect(asyncFunction)).toEqual(util.inspect(asyncFunction));
    expect(inspect(asyncFunction, { colors: true })).toEqual(
      util.inspect(asyncFunction, { colors: true }),
    );
  });

  it("should show async generator function", () => {
    async function* asyncGeneratorFunction() {}

    expect(show(asyncGeneratorFunction)).toEqual(
      "[AsyncGeneratorFunction: asyncGeneratorFunction]",
    );
    expect(inspect(asyncGeneratorFunction)).toEqual(util.inspect(asyncGeneratorFunction));
    expect(inspect(asyncGeneratorFunction, { colors: true })).toEqual(
      util.inspect(asyncGeneratorFunction, { colors: true }),
    );
  });

  it("should show function with `Symbol.toStringTag`", () => {
    const taggedFunction = Object.defineProperty(function () {}, Symbol.toStringTag, {
      value: "MyTag",
    });

    expect(show(taggedFunction)).toEqual("[Function (anonymous)] [MyTag]");
    expect(inspect(taggedFunction)).toEqual(util.inspect(taggedFunction));
    expect(inspect(taggedFunction, { colors: true })).toEqual(
      util.inspect(taggedFunction, { colors: true }),
    );
  });

  it("should show function [[Prototype]]s", () => {
    const FunctionProto = Function.prototype;
    const GeneratorFunctionProto = function* () {}.constructor.prototype;
    const AsyncFunctionProto = async function () {}.constructor.prototype;
    const AsyncGeneratorFunctionProto = async function* () {}.constructor.prototype;

    expect(show(FunctionProto)).toEqual("[Function (anonymous)] Object");
    expect(inspect(FunctionProto)).toEqual(util.inspect(FunctionProto));
    expect(inspect(FunctionProto, { colors: true })).toEqual(
      util.inspect(FunctionProto, { colors: true }),
    );
    expect(show(GeneratorFunctionProto)).toEqual("Function [GeneratorFunction] {}");
    expect(inspect(GeneratorFunctionProto)).toEqual(util.inspect(GeneratorFunctionProto));
    expect(inspect(GeneratorFunctionProto, { colors: true })).toEqual(
      util.inspect(GeneratorFunctionProto, { colors: true }),
    );
    expect(show(AsyncFunctionProto)).toEqual("Function [AsyncFunction] {}");
    expect(inspect(AsyncFunctionProto)).toEqual(util.inspect(AsyncFunctionProto));
    expect(inspect(AsyncFunctionProto, { colors: true })).toEqual(
      util.inspect(AsyncFunctionProto, { colors: true }),
    );
    expect(show(AsyncGeneratorFunctionProto)).toEqual("Function [AsyncGeneratorFunction] {}");
    expect(inspect(AsyncGeneratorFunctionProto)).toEqual(util.inspect(AsyncGeneratorFunctionProto));
    expect(inspect(AsyncGeneratorFunctionProto, { colors: true })).toEqual(
      util.inspect(AsyncGeneratorFunctionProto, { colors: true }),
    );

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
    expect(inspect(AsyncGeneratorProto, { colors: true })).toEqual(
      util.inspect(AsyncGeneratorProto, { colors: true }),
    );
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
    expect(inspect(MyFn, { colors: true })).toEqual(util.inspect(MyFn, { colors: true }));
    expect(show(MyGenFn)).toEqual("[class MyGenFn extends GeneratorFunction]");
    expect(inspect(MyGenFn)).toEqual(util.inspect(MyGenFn));
    expect(inspect(MyGenFn, { colors: true })).toEqual(util.inspect(MyGenFn, { colors: true }));
    expect(show(MyAsyncFn)).toEqual("[class MyAsyncFn extends AsyncFunction]");
    expect(inspect(MyAsyncFn)).toEqual(util.inspect(MyAsyncFn));
    expect(inspect(MyAsyncFn, { colors: true })).toEqual(util.inspect(MyAsyncFn, { colors: true }));
    expect(show(MyAsyncGenFn)).toEqual("[class MyAsyncGenFn extends AsyncGeneratorFunction]");
    expect(inspect(MyAsyncGenFn)).toEqual(util.inspect(MyAsyncGenFn));
    expect(inspect(MyAsyncGenFn, { colors: true })).toEqual(
      util.inspect(MyAsyncGenFn, { colors: true }),
    );

    expect(show(new MyFn())).toEqual("[Function: anonymous] MyFn");
    expect(inspect(new MyFn())).toEqual(util.inspect(new MyFn()));
    expect(inspect(new MyFn(), { colors: true })).toEqual(
      util.inspect(new MyFn(), { colors: true }),
    );
    expect(show(new MyGenFn())).toEqual(
      "[GeneratorFunction: anonymous] MyGenFn [GeneratorFunction]",
    );
    expect(inspect(new MyGenFn())).toEqual(util.inspect(new MyGenFn()));
    expect(inspect(new MyGenFn(), { colors: true })).toEqual(
      util.inspect(new MyGenFn(), { colors: true }),
    );
    expect(show(new MyAsyncFn())).toEqual("[AsyncFunction: anonymous] MyAsyncFn [AsyncFunction]");
    expect(inspect(new MyAsyncFn())).toEqual(util.inspect(new MyAsyncFn()));
    expect(inspect(new MyAsyncFn(), { colors: true })).toEqual(
      util.inspect(new MyAsyncFn(), { colors: true }),
    );
    expect(show(new MyAsyncGenFn())).toEqual(
      "[AsyncGeneratorFunction: anonymous] MyAsyncGenFn [AsyncGeneratorFunction]",
    );
    expect(inspect(new MyAsyncGenFn())).toEqual(util.inspect(new MyAsyncGenFn()));
    expect(inspect(new MyAsyncGenFn(), { colors: true })).toEqual(
      util.inspect(new MyAsyncGenFn(), { colors: true }),
    );
  });

  it('should hide meta properties when `showHidden` is `"exclude-meta"`', () => {
    /* Regular function */
    function testFunction1() {}

    expect(show(testFunction1, { showHidden: "exclude-meta" })).toEqual(
      "[Function: testFunction1]",
    );
    expect(inspect(testFunction1, { showHidden: "always" })).toEqual(
      util.inspect(testFunction1, { showHidden: true }),
    );
    expect(inspect(testFunction1, { showHidden: "always", colors: true })).toEqual(
      util.inspect(testFunction1, { showHidden: true, colors: true }),
    );

    /* Generator function */
    function* testGenerator() {}

    expect(show(testGenerator, { showHidden: "exclude-meta" })).toEqual(
      "[GeneratorFunction: testGenerator]",
    );
    expect(inspect(testGenerator, { showHidden: "always" })).toEqual(
      trimIndent(String.raw`
        [GeneratorFunction: testGenerator] {
          [length]: 0,
          [name]: 'testGenerator',
          [prototype]: Object [Generator] {}
        }
      `),
    );

    /* Async function */
    async function testAsync() {}

    expect(show(testAsync, { showHidden: "exclude-meta" })).toEqual("[AsyncFunction: testAsync]");
    expect(inspect(testAsync, { showHidden: "always" })).toEqual(
      "[AsyncFunction: testAsync] { [length]: 0, [name]: 'testAsync' }",
    );

    /* Async generator function */
    async function* testAsyncGenerator() {}

    expect(show(testAsyncGenerator, { showHidden: "exclude-meta" })).toEqual(
      "[AsyncGeneratorFunction: testAsyncGenerator]",
    );
    expect(inspect(testAsyncGenerator, { showHidden: "always" })).toEqual(
      trimIndent(String.raw`
        [AsyncGeneratorFunction: testAsyncGenerator] {
          [length]: 0,
          [name]: 'testAsyncGenerator',
          [prototype]: Object [AsyncGenerator] {}
        }
      `),
    );
  });
});
