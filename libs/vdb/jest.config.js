module.exports = {
  coverageDirectory: '../../coverage/libs/vdb',
  name: 'vdb',
  preset: '../../jest.config.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './test-results/jest', outputName: 'libs-vdb.junit.xml' }],
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
};
