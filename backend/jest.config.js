// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // let babel handle modern JS/TS
  },
  testMatch: ['**/tests_/**/*.test.js'],
  forceExit: true,
};
