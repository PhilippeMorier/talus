// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),

      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-mocha-reporter'),

      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },

    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../projects/editor/reports/coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },
    junitReporter: {
      // https://circleci.com/docs/2.0/configuration-reference/#store_test_results
      outputDir: 'reports/test-results/jasmine',
      outputFile: 'junit.xml',
      useBrowserName: false,
    },

    autoWatch: true,
    browsers: ['Chrome'],
    colors: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    reporters: ['mocha', 'kjhtml'],
    restartOnFileChange: true,
    singleRun: false,
  });
};
