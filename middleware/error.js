const winston = require('winston');
module.exports = function (err, req, res, next) {
    // console.log('ERR' + err)
    winston.info(err.message, err);

    // error
    // warn
    // info
    // verbose
    // debug 
    // silly

    res.status(500).send('Internal Server Error');
}