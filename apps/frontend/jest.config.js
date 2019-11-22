module.exports = {
  coverageDirectory: '../../coverage/apps/frontend',
  name: 'frontend',
  preset: '../../jest.config.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: './test-results/jest', outputName: 'apps-frontend.junit.xml' },
    ],
  ],
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
