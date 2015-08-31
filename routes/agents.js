var express = require('express');
var router = express.Router();
var twilio = require('twilio');

var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER;

/* GET agents listing. */
router.get('/:who', function(req, res, next) {
  console.log('who', req.params.who);
  // You will need your Account Sid and a SigningKey Sid and Secret
// to generate an Access Token for your SDK endpoint to connect to Twilio.
  console.log('in who server');
  var accountSid = 'xx';
  var signingKeySid = 'yy';
  var signingKeySecret = 'zz';

  var token = new twilio.AccessToken(signingKeySid, accountSid, signingKeySecret);
  token.addEndpointGrant(req.params.who);
  token.enableNTS();
  console.log(token.toJwt());
  res.send({token: token.toJwt()});
});

module.exports = router;
