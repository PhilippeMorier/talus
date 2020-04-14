module.exports = {
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
