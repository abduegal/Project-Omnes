'use strict';

angular.module('omnesClientApp')
  .controller('ChatCtrl', function ($scope, $cookies, $http) {

    $scope.user = {

    };

    $scope.chatData = {
      messages: []
    }

    $scope.user.username = $cookies.username;

    $scope.range = 110;

    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    $scope.error = {

    };

    function findLocation(callback){
      if ($scope.geolocationAvailable) {

        navigator.geolocation.getCurrentPosition(function (position) {

          $scope.currentLocation = [
            position.coords.longitude,
            position.coords.latitude
          ];

          $scope.$apply();
          callback();
        }, function () {
          loadIpLocation(callback);
        });
      }else{
        loadIpLocation(callback);
      }
    }

    function loadIpLocation(callback){
      if(google.loader.ClientLocation){
        $scope.currentLocation = [
          google.loader.ClientLocation.latitude,
          google.loader.ClientLocation.longitude
        ];
        $scope.$apply();
        callback();
      }else{
        $scope.error.location = "Unable to determine the location";
      }
    }

    $scope.load = function(){
      findLocation($scope.loadData);
    };

    $scope.onSubmit = function(){
      //submit the message
      $scope.loadingInput = true;
      $scope.user.location = $scope.currentLocation;
      $scope.user.timestamp = new Date().getTime();
      console.log($scope.user);
      $http.post('http://omnes.abduegal.cloudbees.net/messages', $scope.user).
        success(function(){
          $scope.chatData.messages.push($scope.user);
          $scope.refreshForm();
        }).
        error(function(data, status){
          $scope.user.error = 'unable to send the following message with error ('+status +')';
          $scope.chatData.messages.push($scope.user);
          $scope.refreshForm();
      });
    };

    $scope.refreshForm = function(){
      $scope.user = {
        username : $cookies.username
      };
      $scope.loadingInput = false;
    };

    $scope.loadData = function(){
      $http.get('http://omnes.abduegal.cloudbees.net/messages/'+$scope.range+'/'+ $scope.currentLocation[0] +'/'+$scope.currentLocation[1]).
        success(function(data){
          for(var a in data){
            data[a].timestamp = parseFloat(data[a].timestamp);
          }
          $scope.chatData.messages = data;
          $("#pollingScreen").scrollTop(100000000000000000);
          setTimeout($scope.loadData, 1000);
        }).
        error(function(data, status){
          $scope.chatData.error = 'Unable to fetch the data, please check your internet connection';
        });
    };
  });
