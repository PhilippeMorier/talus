module.exports = {
  coverageDirectory: '../../coverage/libs/vdb',
  name: 'vdb',
  preset: '../../jest.config.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: ['default', ['jest-junit', { outputDirectory: './coverage/libs/vdb' }]],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
};
