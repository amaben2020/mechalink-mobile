module.exports = {
  extends: [
    'expo',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['react-hooks', 'prettier'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']], // Adjust './src' if your files are in a different folder
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: true,
      node: true,
    },
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'react-hooks/rules-of-hooks': 'error', // Enforces the Rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Warns about missing dependencies in useEffect
  },
};
