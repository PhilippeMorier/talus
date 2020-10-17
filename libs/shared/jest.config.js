module.exports = {
  name: 'shared',
  preset: '../../jest.config.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results/jest',
        outputName: 'libs-shared.junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/shared',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};