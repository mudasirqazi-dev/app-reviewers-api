require('dotenv').config();
const crypto = require('crypto');

module.exports = {
  encrypt (text){
    var cipher = crypto.createCipher('aes-256-cbc', process.env.Encription_Secret)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },
  decrypt: function(text){
    try {

    var decipher = crypto.createDecipher('aes-256-cbc', process.env.Encription_Secret)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    dec
    }
    catch (ex) {
      dec = "invalid Refferal"
    }
    return dec
  }

}


