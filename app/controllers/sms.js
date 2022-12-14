const _ = require('lodash');
require('dotenv').config();
const SmsManager = require('../../middleware/smsManager');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const express = require('express');
const smsManager = require('../../middleware/smsManager');
const router = express.Router();

// route to send single sms
router.post("/single", async (req, res, next) => {
    let result = await smsManager.sendSingleSms(req.body);
    if (result) {
        res.status(200).json({
            success: true,
            message: "Sms sent"
        });
    } else {
        res.status(500).json({
            message: "couldn't complete your request"
        });
    }

});

// route to crate new list
router.post("/list/create", async (req, res, next) => {
    smsManager.sendSingleSms();
    // let contacts = req.body.contact;
    // console.log('contacts ' + JSON.stringify(contacts));
    // smsManager.createNewList(req.body);
    // Apps.find({
    //     app: 'Binance'
    // }).then(data => {
    //     if (data) {
    //         res.status(200).json(data);
    //     } else {
    //         res.status(200).json({
    //             message: "accounts not found"
    //         });
    //     }
    // })

});







module.exports = router;