module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn', 'never']
  }
}
