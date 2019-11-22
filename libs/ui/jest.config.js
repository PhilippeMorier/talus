module.exports = {
  coverageDirectory: '../../coverage/libs/ui',
  name: 'ui',
  preset: '../../jest.config.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: ['default', ['jest-junit', { outputDirectory: './coverage/libs/ui' }]],
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
