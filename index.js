(function(angular){
  'use strict';

  var moduleName = 'fuminchao.angular-http-shortcircle';
  var serviceName = 'angular-http-shortcircle';

  var shortcircles = [];

  angular
  .module(moduleName, [])
  .config(['$httpProvider', function( $httpProvider ){

    $httpProvider.interceptors.push(['$q', function($q){

      return {
        request: function( reqOption ){

          var deferred = $q.defer();
          var next = function(index){

            if (index < shortcircles.length) {

              var cached = [200, '', {}];

              shortcircles[index](reqOption, {
                status: function(code) {
                  cached[0] = code;
                  return this;
                },
                header: function(key, value) {
                  cached[2][key] = value;
                  return this;
                },
                send: function(body) {
                  cached[1] = body;

                  deferred.resolve(angular.extend({}, reqOption,
                  {
                    method: 'JSONP',
                    //url: 'data:application/javascript;charset=utf-8,JSON_CALLBACK(500,' + encodeURIComponent(JSON.stringify(resp)) + ')'
                    cache: {
                      get: function(){
                        return cached;
                      }
                    }
                  }));
                },
                pass: function() {
                  next(index+1);
                }
              });

            } else {
              deferred.resolve(reqOption);
            }
          };

          next(0);
          return deferred.promise;
        }
      };
    }]);
  }])
  .factory(serviceName, ['$injector', function( $injector ){
    return {
      register: function(fn) {
        shortcircles.push($injector.invoke(fn));
      },
      empty: function() {
        shortcircles.length = 0;
      }
    };
  }]);

})(angular);
