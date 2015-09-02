'use strict';

// TODO: use johnpapa
angular.module('myApp.view1', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controllerAs: 'vm',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', View1Ctrl)
    .factory('tokenResource', tokenResourceFn);

function tokenResourceFn($resource) {
  return $resource('http://localhost:3000/agents/:who', {who: '@who'});
}

function View1Ctrl($http, twilioConversation, tokenResource) {

  var vm = this;
  var previewMedia;
  var activeConversation;
  var endpoint;
  var accessToken = '';
  var response;

  var userName = prompt('Please enter your name - alice, bob or charlie.', 'alice');

  function successHandler(response) {
    accessToken = response.token;
    console.log('access token', accessToken);
    endpoint = new Twilio.Endpoint(accessToken);
    endpoint.listen().then(
        endpointConnected,
        function (error) {
          log('Could not connect to Twilio: ' + error.message);
        }
    );

  }

  tokenResource.get({who: userName}, successHandler);


  //$http.get({url: 'http://localhost:3000/agents', params: [{who: userName}]}).then(successHandler, function(errResponse) {
  //  console.error('Error while fetching notes');
  //});

  //$http.get({url: '/agents', params: [{who: userName}]}).then(successHandler, function(errResponse) {
  //  console.error('Error while fetching notes');
  //});


// check for WebRTC
  if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    alert('WebRTC is not available in your browser.');
  }


// successfully connected!
  function endpointConnected() {
    document.getElementById('invite-controls').style.display = 'block';
    log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");

    endpoint.on('invite', function (invite) {
      log('Incoming invite from: ' + invite.from);
      invite.accept().then(conversationStarted);
    });

    vm.sendInvite = function () {
      var inviteTo = document.getElementById('invite-to').value;

      if (activeConversation) {
        // add a participant
        activeConversation.invite(inviteTo);
      } else {
        // create a conversation
        var options = {};
        if (previewMedia) {
          options.localMedia = previewMedia;
        }
        endpoint.createConversation(inviteTo, options).then(
            conversationStarted,
            function (error) {
              log('Unable to create conversation');
              console.error('Unable to create conversation', error);
            }
        );
      }
    };

  }

// conversation is live
  function conversationStarted(conversation) {
    log("In an active Conversation");
    activeConversation = conversation;
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
      activeConversation = null;
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