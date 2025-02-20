// @ts-check

/** @satisfies {import("prettier").Config} */
const config = {
  arrowParens: "always",
  bracketSameLine: true,
  bracketSpacing: true,
  experimentalTernaries: true,
  plugins: ["prettier-plugin-packagejson"],
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
};

module.exports = config;
