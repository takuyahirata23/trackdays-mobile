module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './components',
            '@context': './context',
            '@constants': './constants',
            '@graphql': './graphql',
            '@hooks': './hooks',
            '@rest': './rest',
            '@utils': './utils',
            '@type': './type',
            '@functions': './functions'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  }
}
