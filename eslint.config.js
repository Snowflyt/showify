// @ts-check

import eslint from "@eslint/js";
import importX from "eslint-plugin-import-x";
import jsdoc from "eslint-plugin-jsdoc";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import sonarjs from "eslint-plugin-sonarjs";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  jsdoc.configs["flat/recommended-typescript-error"],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  prettierRecommended,
  sonarjs.configs.recommended,
  {
    plugins: {
      jsdoc,
      "sort-destructure-keys": sortDestructureKeys,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        project: [
          "tsconfig.json",
          "tsconfig.test.json",
          "packages/*/tsconfig.json",
          "packages/*/tsconfig.test.json",
          "tsconfig.eslint.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser },
    },
    rules: {
      "@typescript-eslint/restrict-plus-operands": [
        "error",
        { allowAny: true, allowNumberAndString: true },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowAny: true, allowBoolean: true, allowNullish: true, allowNumber: true },
      ],
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-type-definitions": "off", // TS treats types and interfaces differently, this may break some advanced type gymnastics
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: false },
      ],
      "@typescript-eslint/dot-notation": ["error", { allowIndexSignaturePropertyAccess: true }],
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-vars": "off", // Already covered by `tsconfig.json`
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off", // This library targets ES2015, so optional chaining is not available
      "@typescript-eslint/unified-signatures": "off",
      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import-x/no-named-as-default-member": "off",
      "import-x/no-unresolved": "off",
      "import-x/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
          "newlines-between": "always",
        },
      ],
      "jsdoc/check-param-names": "off",
      "jsdoc/check-tag-names": "off",
      "jsdoc/check-values": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/tag-lines": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
          message:
            "Do not use spread arguments in `Array#push`, " +
            "as it might cause stack overflow if you spread a large array. " +
            "Instead, use `Array#concat` or `Array.prototype.push.apply`.",
        },
      ],
      "no-undef": "off", // Already checked by TypeScript
      "object-shorthand": "error",
      "sonarjs/class-name": ["error", { format: "^_?[A-Z][a-zA-Z0-9]*$" }],
      "sonarjs/code-eval": "off", // Already covered by `@typescript-eslint/no-implied-eval`
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/deprecation": "off", // Already covered by `@typescript-eslint/no-deprecated`
      "sonarjs/different-types-comparison": "off", // Already checked by TypeScript
      "sonarjs/no-alphabetical-sort": "off",
      "sonarjs/no-control-regex": "off", // Already covered by `no-control-regex`
      "sonarjs/no-ignored-exceptions": "off",
      "sonarjs/no-nested-assignment": "off",
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/no-selector-parameter": "off",
      "sonarjs/no-useless-intersection": "off", // Already checked by TypeScript
      "sonarjs/no-unused-vars": "off", // Already checked by TypeScript
      "sonarjs/reduce-initial-value": "off",
      "sonarjs/redundant-type-aliases": "off", // Already covered by `@typescript-eslint/no-restricted-type-imports`
      "sonarjs/regex-complexity": "off",
      "sonarjs/todo-tag": "off",
      "sonarjs/void-use": "off",
      "sort-destructure-keys/sort-destructure-keys": "error",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      "sonarjs/no-primitive-wrappers": "off",
    },
  },
);
