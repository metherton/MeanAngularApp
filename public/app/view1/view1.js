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

  var accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzLTE0NDA3MDA2MzUiLCJpc3MiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzIiwic3ViIjoiQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOSIsIm5iZiI6MTQ0MDcwMDYzNSwiZXhwIjoxNDQwNzg3MDM1LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTlcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzU3YTFmN2VkZmE3MTZhMjc5OWY4MTY2OTEwZmMyZTE5LmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.libAEus6nmPDwsWIO4QMmonZC1aTc7uIwtTjVcGWCH0';

  var endpoint = new Twilio.Endpoint(accessToken);

// check for WebRTC
  if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    alert('WebRTC is not available in your browser.');
  }

  endpoint.listen().then(
      endpointConnected,
      function (error) {
        log('Could not connect to Twilio: ' + error.message);
      }
  );

// successfully connected!
  function endpointConnected() {
    document.getElementById('invite-controls').style.display = 'block';
    log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");

    endpoint.on('invite', function (invite) {
      log('Incoming invite from: ' + invite.from);
      invite.accept().then(conversationStarted);
    });
  }

// conversation is live
  function conversationStarted(conversation) {
    log("In an active Conversation");
    // draw local video, if not already previewing
    if (!previewMedia) {
      conversation.localMedia.attach('#local-media');
    }
    // when a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
      log("Participant '" + participant.address + "' connected");
      participant.media.attach('#remote-media');
    });
    // when a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
      log("Participant '" + participant.address + "' disconnected");
    });
    // when the conversation ends, stop capturing local video
    conversation.on('ended', function (conversation) {
      log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
      conversation.localMedia.stop();
      conversation.disconnect();
    });
  }


// activity log
  function log(message) {
    document.getElementById('log-content').innerHTML = message;
  }

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