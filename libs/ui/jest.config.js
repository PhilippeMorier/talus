module.exports = {
  coverageDirectory: '../../coverage/libs/ui',
  displayName: 'ui',
  preset: '../../jest.preset.js',
  // https://github.com/nrwl/nx/issues/837#issuecomment-501188633
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results/jest',
        outputName: 'libs-ui.junit.xml',
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
  // this file i.e. `./ui/jest.config.js` and not `<Project Root>/jest.config.js`.
  // Otherwise, following error might occur:
  // - Cannot find module '@talus/ui'
  // - Zone is needed for the async() test helper but could not be found.
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  // https://github.com/thymikee/jest-preset-angular/issues/293#issuecomment-513544717
  // When using `Run test` directly in WebStorm, the scss couldn't be loaded.
  // - Error: connect ECONNREFUSED 127.0.0.1:80
  // - Error: Uncaught (in promise): Failed to load *.component.scss
  globals: {
    'ts-jest': {
      diagnostics: false, // https://github.com/nrwl/nx/issues/1439#issuecomment-593684534
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
};
