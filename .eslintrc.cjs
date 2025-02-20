// @ts-check

/* eslint-env node */

/** @satisfies {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.test.json", "./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["!.lintstagedrc.js"],
  plugins: ["sort-destructure-keys"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", disallowTypeAnnotations: false },
    ],
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unused-vars": "off", // Already covered by TypeScript
    "import/export": "off",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/namespace": "off",
    "import/no-unresolved": "off",
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
        "newlines-between": "always",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
        message: "Do not use spread arguments in Array#push",
      },
    ],
    "no-undef": "off",
    "object-shorthand": "error",
    "sonarjs/cognitive-complexity": "off",
    "sonarjs/no-duplicate-string": "off",
    "sort-destructure-keys/sort-destructure-keys": "error",
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
  },
  reportUnusedDisableDirectives: true,
};

module.exports = config;
