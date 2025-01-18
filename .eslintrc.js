module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['react-hooks', 'prettier', 'plugin:react-hooks/recommended'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
