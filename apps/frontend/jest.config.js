module.exports = {
  coverageDirectory: '../../coverage/apps/frontend',
  name: 'frontend',
  preset: '../../jest.config.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results/jest',
        outputName: 'apps-frontend.junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  // https://github.com/nrwl/nx/issues/1439#issuecomment-561268656
  // When using `Run test` directly in WebStorm, change the used config to
  // this file i.e. `./frontend/jest.config.js` and not `<rootDir>/jest.config.js`.
  setupFilesAfterEnv: ['./src/test-setup.ts'],
};
