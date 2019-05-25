// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['benchmark', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-benchmark'),
      require('karma-benchmarkjs-reporter'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),

      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },

    junitReporter: {
      // https://circleci.com/docs/2.0/configuration-reference/#store_test_results
      outputDir: 'reports/test-results/benchmark',
      outputFile: 'junit.xml',
      useBrowserName: false,
    },

    autoWatch: true,
    browsers: ['Chrome'],
    colors: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    reporters: ['benchmark'],
    restartOnFileChange: true,
    singleRun: false,
  });
};
