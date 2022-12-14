require('dotenv').config();
const _ = require('lodash');
const auth = require('./auth');
const express = require('express');
const router = express.Router();
const ut = require('./utility');
const api = require('smsedge-api-node-js');
const SMSEdgeApi = new api(process.env.smsApikey) // api_key is required, For example: K_xGA286GbLxGf7zWM;
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from('E0nBWlWOkQpiykyQdYlY7EdEdlB0CdHd7CiylRW0GiH', 'ar2MFhX'))
class SmsManager {

    async sendSingleSms(data) {
        try {

            // const fields = {
            //     from: data.from,
            //     to: data.to,
            //     text: data.text,
            //     name: data.name,
            //     // email: 'abanchaudry@gmail.com',
            //     // country_id: '1', // List of countries on getCountries() function.
            //     // referenc,
            //     // shorten_url: true, // By default false.
            //     // list_id: 1,
            //     // transactional: true,
            //     // preferred_route_id: '1', // List of routes on getRoutes() function.
            //     // delay: '10' // Delay by seconds
            // }
            // return new Promise((resolve, reject) => {
            //     SMSEdgeApi.sendSingleSms(fields, (cb) => {
            //         // console.log(cb);
            //         if (cb.success) {
            //             resolve(true)
            //         } else {
            //             reject(false)
            //         }
            //     });
            // });

        } catch (ex) {
            console.log('err: while sending new sms' + ex.message);
            return false;
        }

    }





}



module.exports = new SmsManager();