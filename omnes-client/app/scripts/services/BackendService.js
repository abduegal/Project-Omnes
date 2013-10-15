'use strict';

angular.module('omnesClientApp')
  .factory('BackendService', function ($http, baseurl) {

    var submitCall = function(userMessage, successCallback, errorCallback){
      $http.post(baseurl + '/messages', userMessage).success(successCallback).error(errorCallback);
    };

    var loadDataCall = function(range, location, timestamp, successCallback, errorCallback){
      $http.get(baseurl + '/messages/'+ range +'/'+ location[0] +'/'+ location[1] +'/'+ timestamp).
        success(successCallback).error(errorCallback);
    }

    return {
      'submit': submitCall,
      'loadData' : loadDataCall
    };

  });
