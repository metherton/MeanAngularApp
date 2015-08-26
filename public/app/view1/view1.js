'use strict';

// TODO: use johnpapa
angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controllerAs: 'vm',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', View1Ctrl);

function View1Ctrl() {

  var vm = this;
  var previewMedia;


  vm.preview = function() {
    if (!previewMedia) {
      previewMedia = new Twilio.LocalMedia();
      Twilio.getUserMedia().then(
          function (mediaStream) {
            previewMedia.addStream(mediaStream);
            previewMedia.attach('#local-media');
          },
          function (error) {
            console.error('Unable to access local media', error);
            log('Unable to access Camera and Microphone');
          }
      );
    };
  };
  


}