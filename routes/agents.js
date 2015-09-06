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
    var token = new twilio.AccessToken(TWILIO_SIGNING_KEY_SID, TWILIO_ACCOUNT_SID, TWILIO_SIGNING_KEY_SECRET);

  token.addEndpointGrant(req.params.who);
  token.enableNTS();
  res.send({token: token.toJwt()});
    
//
//var token = new twilio.AccessToken(signingKeySid, accountSid, signingKeySecret);
//token.addEndpointGrant('bob');
//token.enableNTS();
//console.log(token.toJwt());

});

module.exports = router;
