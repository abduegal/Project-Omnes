'use strict';

angular.module('omnesClientApp')
  .controller('ChatCtrl', function ($scope, $cookies, $http) {

    /**
     * Single user message for form use
     */
    $scope.userMessage = {};

    /**
     * Contains all the chat data (inc user messages)
     */
    $scope.chatData = {
      messages: []
    }

    $scope.userMessage.username = $cookies.username;

    /**
     * Range in KM
     */
    $scope.range = 10;

    /**
     * The refresh rate of the chatbox in miliseconds
     */
    $scope.refreshRate = 1000;

    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    $scope.error = {};

    /**
     * Watches the range change and verifies that the range will not be less than 10KM
     */
    $scope.$watch('range', function(newValue){
      if(newValue == 0){
        $scope.range = 10;
      }
    });

    /**
     * Onload method
     */
    $scope.load = function(){
      findLocation($scope.loadData);
    };

    /**
     * Onsubmit method
     */
    $scope.onSubmit = function(){
      $scope.loadingInput = true;
      $scope.userMessage.timestamp = new Date().getTime();
      $http.post('http://omnes.abduegal.cloudbees.net/messages', $scope.userMessage).
        success(function(){
          $scope.chatData.messages.push($scope.userMessage);
          $scope.refreshForm();
        }).
        error(function(data, status){
          $scope.userMessage.error = 'unable to send the following message with error ('+status +')';
          $scope.chatData.messages.push($scope.userMessage);
          $scope.refreshForm();
        });
    };

    /**
     * Finds the location and runs the callback once the location was found
     * It will attempt to find the location through GPS and it will load the location through IP
     * when the GPS is not available
     * @param callback
     */
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

    /**
     * Fallback for the findLocation method.
     * @param callback
     */
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

    /**
     * Form refresh, refreshes the usermessage object
     * and the loadingIput that was responsible for the progressbar
     */
    $scope.refreshForm = function(){
      $scope.userMessage = {
        username : $cookies.username,
        location : $scope.currentLocation
      };
      $scope.loadingInput = false;
    };

    /**
     * Polling method:
     * Refreshes the form every [1] second
     */
    $scope.loadData = function(){
      $http.get('http://omnes.abduegal.cloudbees.net/messages/'+$scope.range+'/'+ $scope.currentLocation[0] +'/'+$scope.currentLocation[1]).
        success(function(userMessages){
          for(var index in userMessages){
            userMessages[index].timestamp = parseFloat(userMessages[index].timestamp);
          }
          $scope.chatData.messages = userMessages;
          setTimeout($scope.loadData, 1000);
        }).
        error(function(data, status){
          $scope.chatData.error = 'Unable to fetch the data, please check your internet connection';
        });
    };

  });
