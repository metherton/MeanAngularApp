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

function View1Ctrl($http, twilioConversation) {

  var vm = this;
  var previewMedia;
  var activeConversation;

  //var twilio = t.getTwillio();

// choose between one of our three pre-generated Access Tokens
  var accessTokens = {'alice': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzLTE0NDA3MDQwMTAiLCJpc3MiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzIiwic3ViIjoiQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOSIsIm5iZiI6MTQ0MDcwNDAxMCwiZXhwIjoxNDQwNzkwNDEwLCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTlcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6YWxpY2VAQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOS5lbmRwb2ludC50d2lsaW8uY29tIiwiYWN0IjpbImxpc3RlbiIsImludml0ZSJdfV19.U-rn9saT016EZu8RZtvv5F8dkHTqaox-stestnZxJqg',
    'bob': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzLTE0NDA3MDQwNjAiLCJpc3MiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzIiwic3ViIjoiQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOSIsIm5iZiI6MTQ0MDcwNDA2MCwiZXhwIjoxNDQwNzkwNDYwLCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTlcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6Ym9iQEFDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTkuZW5kcG9pbnQudHdpbGlvLmNvbSIsImFjdCI6WyJsaXN0ZW4iLCJpbnZpdGUiXX1dfQ.sG32ooEu4a2AO5XCMcHY1PvktoAjZM_WBYs8-J8ai90',
    'charlie': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzLTE0NDA3MDQxMjYiLCJpc3MiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzIiwic3ViIjoiQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOSIsIm5iZiI6MTQ0MDcwNDEyNiwiZXhwIjoxNDQwNzkwNTI2LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTlcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6Y2hhcmxpZUBBQzU3YTFmN2VkZmE3MTZhMjc5OWY4MTY2OTEwZmMyZTE5LmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.sLoBMB7nPfFWOcp8BRhP8GZxDf83f0RF4uv-0rnltao'};
  //var userName = prompt('Please enter your name - alice, bob or charlie.', 'alice');
  var userName = 'alice';

  var accessToken = '';
  $http.get({url: 'http://localhost:3000/agents', params: [{who: userName}]}).then(function(response) {
    accessToken = response.token;
  }, function(errResponse) {
    console.error('Error while fetching notes');
  });

//  var accessToken = accessTokens[userName];

  console.log('access token', accessToken);

 // var accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzLTE0NDA3MDA2MzUiLCJpc3MiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzIiwic3ViIjoiQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOSIsIm5iZiI6MTQ0MDcwMDYzNSwiZXhwIjoxNDQwNzg3MDM1LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTlcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzU3YTFmN2VkZmE3MTZhMjc5OWY4MTY2OTEwZmMyZTE5LmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.libAEus6nmPDwsWIO4QMmonZC1aTc7uIwtTjVcGWCH0';

    //var endpoint = new Twilio.Endpoint(accessToken);
  var endpoint = twilioConversation.Endpoint('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzLTE0NDEwNTcyODciLCJpc3MiOiJTSzE2YjlmNjk4MTlmYWY5NzJmYmM1NjVlMjZjZGZjODgzIiwic3ViIjoiQUM1N2ExZjdlZGZhNzE2YTI3OTlmODE2NjkxMGZjMmUxOSIsIm5iZiI6MTQ0MTA1NzI4NywiZXhwIjoxNDQxMTQzNjg3LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDNTdhMWY3ZWRmYTcxNmEyNzk5ZjgxNjY5MTBmYzJlMTlcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzU3YTFmN2VkZmE3MTZhMjc5OWY4MTY2OTEwZmMyZTE5LmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.E5fL_u7357dDmyZ2eb0Pf_8z0X7KxfNYzcWzhvBvkKw');

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