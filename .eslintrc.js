'use strict';

module.exports = {
  root: true,

  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',

  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    // tsconfigRootDir: __dirname,
    // project: ['./tsconfig.json'],
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'no-constant-condition': ['error', { checkLoops: false }],
    'prefer-arrow-callback': 'error',

    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/prefer-optional-chain': 'error',

    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/self-closing-comp': 'error',
  },

  overrides: [
    {
      files: '*.tsx',
      rules: {
        // annoying for styled components
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
    {
      files: '*.stories.*',
      rules: {
        // both false positives in storybook templates
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
};
