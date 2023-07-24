module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      'transform-inline-environment-variables',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './components',
            '@context': './context',
            '@graphql': './graphql',
            '@hooks': './hooks',
            '@utils': './utils',
            '@type': './type'
          }
        }
      ]
    ]
  }
}
