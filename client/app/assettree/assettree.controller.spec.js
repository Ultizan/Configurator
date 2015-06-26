'use strict';

describe('Controller: AssettreeCtrl', function () {

  // load the controller's module
  beforeEach(module('bmw1App'));
  beforeEach(module('angularTreeview'));

  var AssettreeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    
    scope = $rootScope.$new();
    AssettreeCtrl = $controller('AssettreeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
