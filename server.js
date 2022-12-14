const winston = require('winston');
const express = require('express');
const path = require('path');
const app = express();
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'public'));
// app.set('view engine', 'ejs');
// const cron = require("node-cron");
require('./startup/logging')();
// const subscriptionCron = require('./app/crons/subscription');
// const orderCron = require('./app/crons/order');
db = require('./startup/db');
require('./startup/config');
require('./startup/validation')();
require('./routes/routes')(app);
// require('./app/crons/subscription');
// const { jobQueue } = require('./agenda/jobs');
// require('./agenda/index')(app, jobQueue);
app.get('*', (req, res) => {
    res.status(400).send('Access Denied');
});

db.open();

const dev = process.env.DEVMODE || false;



const port = process.env.PORT
app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
    console.log(`Listening on port ${port}`)
});