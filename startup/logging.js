require('express-async-errors');
require('winston-mongodb');
require('dotenv').config();
const winston = require('winston');

module.exports = function () {
  const connectionString = process.env.DB_DEVELOPMENT;
  winston.add(new winston.transports.MongoDB({
    db: connectionString,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }));

}