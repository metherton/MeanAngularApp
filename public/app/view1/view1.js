'use strict';

// TODO: use johnpapa
angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/viewF.html',
    controller: 'ViewFCtrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);
