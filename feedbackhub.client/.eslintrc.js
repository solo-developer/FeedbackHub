module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
    ],
    rules: {
      'import/no-unused-modules': [1, { unusedExports: true }],
      'no-unused-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  