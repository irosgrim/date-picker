module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],

  parserOptions: {
    ecmaVersion: 2020
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "prefer-spread": 0,
    "vue/no-parsing-error": "warn",
    "vue/no-side-effects-in-computed-properties": "warn"
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ],

  extends: [
    "plugin:vue/essential",
    "@vue/typescript/recommended",
  ]
};
