'use strict';

angular.module('omnesClientApp')
  .controller('LoginCtrl', function ($scope, $location, $cookies) {

    $scope.questionLabel = 'Enter your username';

    /**
     * Username Form submit
     */
    $scope.onSubmit = function(){
      $cookies.username = $scope.username;
      $location.path('chat');
    };

  });
