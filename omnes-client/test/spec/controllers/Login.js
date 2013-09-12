'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('omnesClientApp'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should have a defined questionLabel', function () {
    expect(scope.questionLabel).toBeDefined();
  });
});
