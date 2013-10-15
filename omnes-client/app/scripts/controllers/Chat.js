'use strict';

angular.module('omnesClientApp')
  .controller('ChatCtrl', function ($scope, $cookies, $http, baseurl) {

    /** Single user message for form use */
    $scope.userMessage = {};

    /** Contains all the chat data (inc user messages) */
    $scope.chatData = {
      messages: []
    }

    $scope.userMessage.username = $cookies.username;

    /** Range in KM */
    $scope.range = 10;
    $scope.maxRange = 300;
    $scope.rangeIncrement = 10;

    /** The refresh rate of the chatbox in miliseconds */
    $scope.refreshRate = 1000;

    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    $scope.error = {};

    /** Enum holding all periods */
    $scope.periods = [
      {name: "Last 24 hours", duration: 86400000},
      {name: "Last Week", duration: 6.048e+8},
      {name: "Last Month", duration: 2.63e+9}
    ];
    $scope.period = $scope.periods[$cookies.period];

    /** Watches the range change and verifies that the range will not be less than 10KM */
    $scope.$watch('range', function(newValue){
      if(newValue == 0){
        $scope.range = 10;
      }
    });

    /**
     * Onload method
     * methods in function are called in the following order:
     * - Findlocation searches for the user location
     *   - has a fallback method called findIpLocation to get the location through the IP
     * - Findlocation will call the loadData method
     *   - findlocation adds a callback to the loadData that will call the reloadData polling method
     */
    $scope.load = function(){
      findLocation($scope.loadData);
    };

    /**
     * Onsubmit method
     */
    $scope.onSubmit = function(){
      $scope.loadingInput = true;
      $http.post(baseurl + '/messages', $scope.userMessage).
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

    $scope.changeTimePeriod = function(period){
      $scope.period = period;
      $cookies.period = $scope.periods.indexOf(period)+'';
    };

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
     * Loads the chat data once
     */
    $scope.loadData = function(callback){
      var lastRequest = new Date().getTime();
      var fromTimeStamp = (new Date().getTime() - $scope.period.duration);
      $http.get(baseurl + '/messages/'+$scope.range+'/'+ $scope.currentLocation[0] +'/'+$scope.currentLocation[1] +'/'+ fromTimeStamp).
        success(function(userMessages){
          if(userMessages.length == 0 && ($scope.range < $scope.maxRange)){
            //no data received, increase the range
            $scope.range += $scope.rangeIncrement;
            $scope.loadData(callback);
          }else{
            $scope.chatData.messages = userMessages;
            $scope.lastSuccess = lastRequest;
            callback();
          }
        }).
        error(function(data, status){
          $scope.chatData.error = 'Unable to fetch the data, please check your internet connection';
        });
    };

    /**
     * Reloads teh data and performs polling
     */
    $scope.reloadData = function(){
      var lastRequest = new Date().getTime();
      var fromTimeStamp = $scope.chatData.messages[$scope.chatData.messages.length - 1].timestamp();
      $http.get(baseurl + '/messages/'+$scope.range+'/'+ $scope.currentLocation[0] +'/'+$scope.currentLocation[1]).
        success(function(userMessages){
          $scope.chatData.messages.push(userMessages);
          $scope.lastSuccess = lastRequest;
          setTimeout($srrcope.reloadData, $scope.refreshRate);
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
          callback($scope.reloadData);

        }, function () {
          loadIpLocation(callback);
        });

      }else{
        loadIpLocation(callback);
      }
    };

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
        callback($scope.reloadData);

      }else{
        $scope.error.location = "Unable to determine the location";
      }
    };


  });