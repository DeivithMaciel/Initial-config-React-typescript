import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default [

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      globals: globals.browser,
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/react-in-jsx-scope': 'off',
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
    },
  },
]
