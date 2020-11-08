module.exports = {
  coverageDirectory: '../../coverage/libs/vdb',
  displayName: 'vdb',
  preset: '../../jest.preset.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results/jest',
        outputName: 'libs-vdb.junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
};
