module.exports = {
  // With new jest version 25, `No tests found, exiting with code 0` occurred with old pattern.
  // Therefore, use default from https://jestjs.io/docs/en/configuration#testmatch-arraystring
  testMatch: ['**/+(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  moduleNameMapper: {
    '@babylonjs': 'babylonjs',
  },
};
