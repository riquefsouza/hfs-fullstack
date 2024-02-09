// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        //require('karma-coverage'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      jasmineHtmlReporter: {
        suppressAll: true // removes the duplicated traces
      },
      /*
      coverageReporter: {
        dir: require('path').join(__dirname, '../coverage'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'text-summary' },
          { type: 'cobertura' }
        ]
      },
      */
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, '../__coverage_karma'),
        reports: ['html', 'lcovonly', 'text-summary'],
        combineBrowserReports: true,
        fixWebpackSourcePaths: true,
        skipFilesWithNoCoverage: true,
        'report-config': {
          html: {
            subdir: 'html'
          }
        }        
      },     
      reporters: ['coverage-istanbul', 'progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      //browsers: ['Chrome'],
      singleRun: false,
      restartOnFileChange: true
    });
  };
