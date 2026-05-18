import neostandard from 'neostandard'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  ...neostandard({
    noStyle: true,
    globals: ['browser', 'Astro'],
  }),
  ...eslintPluginAstro.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    rules: {
      indent: ['warn', 'tab'],
      'no-unused-vars': 'warn',
      'no-multiple-empty-lines': 'off',
      'no-tabs': 'off',
      quotes: ['warn', 'single'],
      'jsx-quotes': ['warn', 'prefer-single'],
      'eol-last': 'off',
      'react/jsx-boolean-value': 'off',
      'react/self-closing-comp': 'off',
    },
  },
  {
    files: ['src/__tests__/**'],
    languageOptions: {
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'astro/no-set-html-directive': 'error',
    },
  },
]
