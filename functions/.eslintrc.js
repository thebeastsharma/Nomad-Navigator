// Use 'export default' for ES Module syntax
/* eslint-env node */

export default {
  root: true,
  env: {
    es6: true,
    node: true, // <-- This tells the linter to expect Node.js globals.
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "max-len": "off", // Disables max line length, which is good for this function
    "require-jsdoc": "off", // Disables requirement for jsdoc comments
  },
  parserOptions: {
    ecmaVersion: 2020, // Allows for modern JS syntax
    sourceType: "module", // <-- This tells the linter to expect 'import' syntax
  },
};

