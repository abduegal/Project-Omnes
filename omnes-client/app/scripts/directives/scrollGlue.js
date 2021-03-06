/**
 * JS Library with MIT License from: https://github.com/Luegg/angularjs-scroll-glue/
 */
(function(angular, undefined){
  'use strict';

  function fakeNgModel(initValue){
    return {
      $setViewValue: function(value){
        this.$viewValue = value;
      },
      $viewValue: initValue
    };
  }

  var oldLength = 0;

  angular.module('luegg.directives', [])
    .directive('scrollGlue', function(){
      return {
        priority: 1,
        require: ['?ngModel'],
        restrict: 'A',
        link: function(scope, $el, attrs, ctrls){
          var el = $el[0],
            ngModel = ctrls[0] || fakeNgModel(true);

          function scrollToBottom(){
            el.scrollTop = el.scrollHeight;
          }

          function shouldActivateAutoScroll(){
            return el.scrollTop + el.clientHeight <= el.scrollHeight;
          }

          scope.$watch(function(event){
            if(ngModel.$viewValue && event.chatData.messages.length > oldLength){
              oldLength = event.chatData.messages.length;
              scrollToBottom();
            }
          });

          $el.bind('scroll', function(){
            scope.$apply(ngModel.$setViewValue.bind(ngModel, shouldActivateAutoScroll()));
          });
        }
      };
    });
}(angular));