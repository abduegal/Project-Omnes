'use strict';

angular.module('omnesClientApp')
  .controller('ChatCtrl', function ($scope, $cookies, BackendService, baseurl) {

    //Models:

    /** Single user message for form use */
    $scope.userMessage = {
      username : $cookies.username
    };

    /** Chat data object that contains all the user messsages */
    $scope.chatData = {
      messages: []
    };

    /** Range object that stores the range information in KM*/
    $scope.range = {
      current: 10,
      minRange: 10,
      maxRange: 300,
      rangeIncrement: 10
    };

    /** The refresh rate of the chatbox in miliseconds */
    $scope.refreshRate = 2000;

    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    $scope.error = {};

    /** Enum holding all periods */
    $scope.periods = [
      {name: "Last 24 hours", duration: 86400000},
      {name: "Last Week", duration: 6.048e+8},
      {name: "Last Month", duration: 2.63e+9}
    ];
    $scope.period = $scope.periods[$cookies.period | 0];

    //Watchers:

    /** Watches the range change and verifies that the range will not be less than 10KM */
    $scope.$watch('range.current', function(newValue){
      if(newValue < $scope.range.minRange){
        $scope.range.current = $scope.range.minRange;
        $scope.reloadData();
      }
    });

    //Events:

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
      $scope.userMessage.location = $scope.currentLocation;
      BackendService.submit($scope.userMessage,
        function success(){
          $scope.chatData.messages.push($scope.userMessage);
          $scope.refreshForm();
        },
        function error(status){
          $scope.userMessage.error = 'unable to send the following message with error ('+status +')';
          $scope.chatData.messages.push($scope.userMessage);
          $scope.refreshForm();
        }
      );
    };

    /**
     * Will be called when the user changes the time period slider
     */
    $scope.onChangeTimePeriod = function(period){
      $scope.period = period;
      $cookies.period = $scope.periods.indexOf(period)+'';
      $scope.reloadData();
    };

    /**
     * Form refresh, refreshes the usermessage object
     * and the loadingInput that was responsible for the progressbar
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
      BackendService.loadData($scope.range.current, $scope.currentLocation, $scope.requestTimeStamp(),
      function success(userMessages){
        if($scope.validateLoadData(userMessages, callback)){
          $scope.chatData.messages = userMessages;
          callback();
        }
      },
      function error(data, status){
        $scope.chatData.error = 'Unable to fetch the data, please check your internet connection';
      });
    };

    /**
     * Reloads teh data and performs polling
     */
    $scope.reloadData = function(){
      BackendService.loadData($scope.range.current, $scope.currentLocation, $scope.requestTimeStamp(),
        function success(userMessages){
          $scope.chatData.messages = userMessages;
          setTimeout($scope.reloadData, $scope.refreshRate);
        }
      );
    };

    $scope.requestTimeStamp = function(){
      return (new Date().getTime() - $scope.period.duration);
    };

    $scope.validateLoadData = function(userMessages, callback){
      if(userMessages.length == 0 && ($scope.range.current < $scope.range.maxRange)){
        $scope.range.current += $scope.range.rangeIncrement;
        $scope.loadData(callback);
        $scope.chatData.error = 'No chat messages found, Increasing range';
        return false;
      }
      return true;
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