!function(a){"use strict";function b(a){return{$setViewValue:function(a){this.$viewValue=a},$viewValue:a}}var c=0;a.module("luegg.directives",[]).directive("scrollGlue",function(){return{priority:1,require:["?ngModel"],restrict:"A",link:function(a,d,e,f){function g(){i.scrollTop=i.scrollHeight}function h(){return i.scrollTop+i.clientHeight<=i.scrollHeight}var i=d[0],j=f[0]||b(!0);a.$watch(function(a){j.$viewValue&&a.chatData.messages.length>c&&(c=a.chatData.messages.length,g())}),d.bind("scroll",function(){a.$apply(j.$setViewValue.bind(j,h()))})}}})}(angular),angular.module("omnesClientApp",["ngCookies","luegg.directives"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/Login.html",controller:"LoginCtrl"}).when("/chat",{templateUrl:"views/Chat.html",controller:"ChatCtrl"}).otherwise({redirectTo:"/"})}]).value("baseurl","http://omnes.abduegal.cloudbees.net"),angular.module("omnesClientApp").factory("BackendService",["$http","baseurl",function(a,b){var c=function(c,d,e){a.post(b+"/messages",c).success(d).error(e)},d=function(c,d,e,f,g){a.get(b+"/messages/"+c+"/"+d[0]+"/"+d[1]+"/"+e).success(f).error(g)};return{submit:c,loadData:d}}]),angular.module("omnesClientApp").controller("NavbarCtrl",["$scope",function(){}]),angular.module("omnesClientApp").controller("LoginCtrl",["$scope","$location","$cookies",function(a,b,c){a.questionLabel="Enter your username",a.username=c.username,a.onSubmit=function(){c.username=a.username,b.path("chat")}}]),angular.module("omnesClientApp").controller("ChatCtrl",["$scope","$cookies","BackendService","baseurl",function(a,b,c){function d(b){a.geolocationAvailable?navigator.geolocation.getCurrentPosition(function(c){a.currentLocation=[c.coords.longitude,c.coords.latitude],a.$apply(),b(a.reloadData)},function(){e(b)}):e(b)}function e(b){google.loader.ClientLocation?(a.currentLocation=[google.loader.ClientLocation.latitude,google.loader.ClientLocation.longitude],a.$apply(),b(a.reloadData)):a.error.location="Unable to determine the location"}a.userMessage={username:b.username},a.chatData={messages:[]},a.range={current:10,minRange:10,maxRange:300,rangeIncrement:10},a.refreshRate=2e3,a.geolocationAvailable=navigator.geolocation?!0:!1,a.error={},a.periods=[{name:"Last 24 hours",duration:864e5},{name:"Last Week",duration:6048e5},{name:"Last Month",duration:263e7}],a.period=a.periods[0|b.period],a.$watch("range.current",function(b){b<a.range.minRange&&(a.range.current=a.range.minRange,a.reloadData())}),a.load=function(){d(a.loadData)},a.onSubmit=function(){a.loadingInput=!0,a.userMessage.location=a.currentLocation,c.submit(a.userMessage,function(){a.chatData.messages.push(a.userMessage),a.refreshForm()},function(b){a.userMessage.error="unable to send the following message with error ("+b+")",a.chatData.messages.push(a.userMessage),a.refreshForm()})},a.onChangeTimePeriod=function(c){a.period=c,b.period=a.periods.indexOf(c)+"",a.reloadData()},a.refreshForm=function(){a.userMessage={username:b.username,location:a.currentLocation},a.loadingInput=!1},a.loadData=function(b){c.loadData(a.range.current,a.currentLocation,a.requestTimeStamp(),function(c){a.validateLoadData(c,b)&&(a.chatData.messages=c,b())},function(){a.chatData.error="Unable to fetch the data, please check your internet connection"})},a.reloadData=function(){c.loadData(a.range.current,a.currentLocation,a.requestTimeStamp(),function(b){a.chatData.messages=b,setTimeout(a.reloadData,a.refreshRate)})},a.requestTimeStamp=function(){return(new Date).getTime()-a.period.duration},a.validateLoadData=function(b,c){return 0==b.length&&a.range.current<a.range.maxRange?(a.range.current+=a.range.rangeIncrement,a.loadData(c),a.chatData.error="No chat messages found, Increasing range",!1):!0},a.getHex=function(a){for(var b="",c=0;3>c;c++){var d=" "|1.5*a.charCodeAt(c);b+=""+d.toString(16)}return b}}]);