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
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  // https://github.com/nrwl/nx/issues/1439#issuecomment-561268656
  // When using `Run test` directly in WebStorm, change the used config to
  // this file i.e. `./frontend/jest.config.js` and not `<rootDir>/jest.config.js`.
  setupFilesAfterEnv: ['./src/test-setup.ts', '<rootDir>/src/test-setup.ts'],

  // https://github.com/thymikee/jest-preset-angular/issues/293#issuecomment-513544717
  // When using `Run test` directly in WebStorm, the scss couldn't be loaded.
  // - Error: connect ECONNREFUSED 127.0.0.1:80
  // - Error: Uncaught (in promise): Failed to load *.component.scss
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      // stringifyContentPathRegex: '\\.html$',
      // astTransformers: [
      //   'jest-preset-angular/build/InlineFilesTransformer',
      //   'jest-preset-angular/build/StripStylesTransformer',
      // ],
    },
  },
};
