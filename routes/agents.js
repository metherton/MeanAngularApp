var express = require('express');
var router = express.Router();
var twilio = require('twilio');

var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER,
    TWILIO_SIGNING_KEY_SID = process.env.TWILIO_SIGNING_KEY_SID,
    TWILIO_SIGNING_KEY_SECRET = process.env.TWILIO_SIGNING_KEY_SECRET;

/* GET agents listing. */
router.get('/:who', function(req, res, next) {
  console.log('who', req.params.who);
  // You will need your Account Sid and a SigningKey Sid and Secret
// to generate an Access Token for your SDK endpoint to connect to Twilio.
  console.log('in who server');
  var accountSid = 'x';
  var signingKeySid = 'y';
  var signingKeySecret = 'z';

  //var token = new twilio.AccessToken(signingKeySid, accountSid, signingKeySecret);
  //var token = new twilio.AccessToken(TWILIO_SIGNING_KEY_SID, TWILIO_ACCOUNT_SID, TWILIO_SIGNING_KEY_SECRET);

    //martine
    //var token = new twilio.AccessToken('SKf24a9109d0762f078f7b5deaa141bbae', 'AC57a1f7edfa716a2799f8166910fc2e19', 'CC6vM3m9340VInX8df2jrZYdJ3D2pqKp');
    var token = new twilio.AccessToken(TWILIO_SIGNING_KEY_SID, TWILIO_ACCOUNT_SID, TWILIO_SIGNING_KEY_SECRET);

  token.addEndpointGrant(req.params.who);
  token.enableNTS();
  res.send({token: token.toJwt()});


//var accountSid = 'AC57a1f7edfa716a2799f8166910fc2e19';
//var signingKeySid = 'SK3d043b705d51122d65f2bf7a35f1fa01';
//var signingKeySecret = 'm6IlLsEW7r5DJNPnzD9zV485tgzRg3xM';
//
//var token = new twilio.AccessToken(signingKeySid, accountSid, signingKeySecret);
//token.addEndpointGrant('bob');
//token.enableNTS();
//console.log(token.toJwt());

});

module.exports = router;
