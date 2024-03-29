// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-var-requires": "error",
    // noEmpty: ["error", { allowEmptyCatch: true }],
    // "@typescript-eslint/no-explicit-any": "off",
    // "@typescript-eslint/explicit-module-boundary-types": "off",
    // "@typescript-eslint/no-non-null-assertion": "off",
    // "@typescript-eslint/no-empty-function": "off",
    // "@typescript-eslint/no-namespace": "off",
    // "@typescript-eslint/no-empty-interface": "off",
    // "consistent-return": "error",
    // "no-else-return": "error",
    // "no-implicit-coercion": "error",
    // "no-implicit-globals": "error",
    // "no-lonely-if": "error",
    // "no-multi-assign": "error",
    // "no-nested-ternary": "error",
    // "no-unneeded-ternary": "error",
    // "no-useless-return": "error",
    // "no-var": "error",
    // "prefer-const": "error",
    // "prefer-destructuring": "error",
    // "prefer-template": "error",
    // "prefer-arrow-callback": "error",
    // "prefer-spread": "error",
    // "prefer-rest-params": "error",
    // "prefer-numeric-literals": "error",
    // "prefer-object-spread": "error",
    // "prefer-promise-reject-errors": "error",
    // "prefer-regex-literals": "error",
  },
};
