require('dotenv').config();
var request = require('request');
const winston = require('winston'),
    mongoose = require('mongoose');
const connectionString = process.env.DB_DEVELOPMENT;
const transport = new winston.transports.File({
    filename: 'logfile.log'
});
const logger = winston.createLogger({
    transports: [transport]
});

let connection = null;

class Database {
    open() {
        try {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            };
            mongoose.connect(connectionString, options, (err) => {
                if (err) logger.info('mongoose.connect() failed: ' + err);
            });
            connection = mongoose.connection;
            mongoose.Promise = global.Promise;

            mongoose.connection.on('error', (err) => {
                logger.info('Error connecting to MongoDB: ' + err);
            });

            mongoose.connection.once('open', () => {
                console.log("connected")
            });
        } catch (err) {
            consle.log('error' + err)
        }
    }

    // disconnect from database
    close() {
        connection.close(() => {
            logger.info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    }

}

module.exports = new Database();