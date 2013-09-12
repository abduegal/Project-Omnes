'use strict';

angular.module('omnesClientApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/Login.html',
        controller: 'LoginCtrl'
      })
      .when('/chat', {
        templateUrl: 'views/Chat.html',
        controller: 'ChatCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
