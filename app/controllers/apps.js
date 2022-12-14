const _ = require('lodash');
require('dotenv').config();
const {
    Apps
} = require('../models/apps');
const {
    User
} = require('../models/user');
const {
    Account
} = require('../models/userAccount');
const {
    Cost
} = require('../models/cost');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const express = require('express');
const accountManager = require('../../middleware/accountManager');
const router = express.Router();



// route to get all apps
router.get("/all", async (req, res, next) => {
    Apps.find({
        app: 'Binance'
    }).then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(200).json({
                message: "accounts not found"
            });
        }
    })

});



// route to get app reviews
router.get("/search", auth, async (req, res, next) => {
    let searchText = req.query.searchText;
    let userId = req.query.userId;
    Apps.find({
        $text: {
            $search: searchText
        }

    }).then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(200).json({
                message: "accounts not found"
            });
        }
    })

});



// route to get app users detail
router.get("/search/detail", async (req, res, next) => {
    let userId = req.query.userId;
    let userAccount = await Account.findOne({
        userId: userId
    });
    let costObj = await Cost.find();
    if (userAccount.balance < costObj[0].cost) {
        res.status(200).json({
            success: false,
            message: "Insufficent balance"
        });
    } else {
        await accountManager.deductQueryCost(userId);
        res.status(200).json({
            success: true,
            message: "User can view details"
        });
    }


});


module.exports = router;