module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    files:[
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'index.js',
      'test/**/*.js'
    ],
    singleRun: true
  });
};
