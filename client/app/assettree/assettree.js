'use strict';

angular.module('bmw1App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('assettree', {
        url: '/assettree',
        templateUrl: 'app/assettree/assettree.html',
        controller: 'AssettreeCtrl'
      });
  });