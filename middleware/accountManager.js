const _ = require('lodash');
const auth = require('./auth');
const express = require('express');
const router = express.Router();
const ut = require('./utility');
const {
    Account,
} = require('../app/models/userAccount');
const {
    Cost,
} = require('../app/models/cost');
const axios = require('axios');
class AccountManager {

    async makeNewPurchase() {
        try {
            let data = {
                amount: "10",
                email: "abanch@gmail.com",
                orderId: "123",
                notificationUrl: "http://localhost:3000/api/purchase/notify",
                redirectUrl: "http://localhost:4200"
            }

            return new Promise((resolve, reject) => {
                axios.post('https://btcpay.prefex.cc/apps/Tz5ArEWtWYMkQb5umw6P4ZoF8gS/pos', data)
                    .then((result) => {
                        console.log('result ' + result);
                        resolve(result);
                        // winston.info(result.data); // log
                        // res.send(result.data)
                        return;
                    }).catch((err) => {
                        console.error(err);
                        reject(err);
                        // winston.info(err); // log
                        return;
                    });
                // SMSEdgeApi.sendSingleSms(fields, (cb) => {
                //     // console.log(cb);
                //     if (cb.success) {
                //         resolve(true)
                //     } else {
                //         reject(false)
                //     }
                // });
            });


        } catch (ex) {
            console.log('err: while createing new user account' + ex.message);
            return false;
        }

    }

    async createNewUserAccount(user) {
        try {
            let data = {
                userId: user._id,
                balance: 0,
            }
            let account = new Account(data);
            account.save();
            return true
        } catch (ex) {
            console.log('err: while createing new user account' + ex.message);
            return false;
        }

    }


    async getUserAccount(userId) {
        try {
            let data = {
                userId: user._id,
                balance: 0,
            }
            let account = new Account(data);
            account.save();
            return true
        } catch (ex) {
            console.log('err: while createing new user account' + ex.message);
            return false;
        }

    }


    async deductQueryCost(userId) {
        try {
            let account = await Account.findOne({
                userId: userId
            });
            let costObj = await Cost.find();
            let balance = account.balance - costObj[0].cost;
            Account.updateOne({
                _id: account._id
            }, [{
                $set: {
                    balance: balance,
                    updated_at: new Date()
                },
            }]).then(data => {
                console.log('data' + JSON.stringify(data))
            })

            return true
        } catch (ex) {
            console.log('err: while deducting query cost' + ex.message);
            return false;
        }

    }

}



module.exports = new AccountManager();