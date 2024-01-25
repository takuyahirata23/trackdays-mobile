module.exports = {
  preset: 'jest-expo',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ],
  collectCoverage: false,
  roots: ['./'],
  verbose: true,
  setupFilesAfterEnv: ['./jest-setup.ts']
}
