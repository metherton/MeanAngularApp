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
  var accountSid = 'AC57a1f7edfa716a2799f8166910fc2e19';
  var signingKeySid = 'SK244ef922733843738133085bcfa7aae4';
  var signingKeySecret = 's1zJeojA47jSe4wShl0Y4HHXL5vMgofV';

  //var token = new twilio.AccessToken(signingKeySid, accountSid, signingKeySecret);
  var token = new twilio.AccessToken(signingKeySid, accountSid);
  token.addEndpointGrant(req.params.who);
  token.enableNTS();
  console.log(token.toJwt(signingKeySecret));
  res.send({token: token.toJwt(signingKeySecret)});
});

module.exports = router;
