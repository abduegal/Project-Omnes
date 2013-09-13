'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('omnesClientApp'));

  var LoginCtrl,
    scope,
    cookies

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    cookies = {};
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $cookies: cookies
    });
  }));

  it('should have a defined questionLabel', function () {
    expect(scope.questionLabel).toBeDefined();
  });

  it('should be able to submit a username', function(){
    scope.username = 'test123';
    scope.onSubmit();
    expect(cookies.username).toBe(scope.username);
  });
});
