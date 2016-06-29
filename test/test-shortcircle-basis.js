'use strict';

describe('$http shortcircles', function() {

  var moduleName = 'fuminchao.angular-http-shortcircle';
  var serviceName = 'angular-http-shortcircle';
  var $http, $httpBackend;

  var $shortcircle;

  beforeEach(module(moduleName));

  beforeEach(inject(function ($injector) {

    $shortcircle = $injector.get(serviceName);

    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/^.*$/).respond(function(method, url, data, headers, params) {
      return [200, 123, {}];
    });
  }));

  afterEach(function () {
    $shortcircle.empty();
  });

  it('mock pass', function(done) {
    $shortcircle.register(function(){
      return function(reqOption, res){
        res.pass();
      };
    });

    $http.get('/xxxxxxxx').then(function(resp) {
      expect(resp.data).toBe(123);
      expect(resp.status).toBe(200);
      done();
    });

    $httpBackend.flush();
  });

  it('mock body', function(done) {

    var mocked = new Date().getTime() + '-' + Math.floor( Math.random() * 100000 );
    $shortcircle.register(function(){
      return function(reqOption, res){
        res.send(mocked);
      };
    });

    $http.get('/xxxxxxxx').then(function(resp) {
      expect(resp.data).toBe(mocked);
      expect(resp.status).toBe(200);
      done();
    });

    $httpBackend.flush();
  });

  it('mock status body', function(done) {

    var mocked = new Date().getTime() + '-' + Math.floor( Math.random() * 100000 );
    $shortcircle.register(function(){
      return function(reqOption, res){
        res.status(201).send(mocked);
      };
    });

    $http.get('/xxxxxxxx').then(function(resp) {
      expect(resp.data).toBe(mocked);
      expect(resp.status).toBe(201);
      done();
    });

    $httpBackend.flush();
  });

  it('mock http error', function(done) {

    var mocked = new Date().getTime() + '-' + Math.floor( Math.random() * 100000 );
    $shortcircle.register(function(){
      return function(reqOption, res){
        res.status(500).send(mocked);
      };
    });

    $http.get('/xxxxxxxx')
    .then(function(){
      fail('should be failed');
    })
    .catch(function(resp) {
      expect(resp.data).toBe(mocked);
      expect(resp.status).toBe(500);
      done();
    });

    $httpBackend.flush();
  });
});
