// const ignoreLibs = ['@babylonjs/core'];

module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  moduleNameMapper: {
    '@babylonjs': 'babylonjs',
  },
  // transformIgnorePatterns: [`/node_modules/(?!(${ignoreLibs.join('|')})/)`],
};