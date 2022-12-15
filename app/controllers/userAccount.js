const _ = require("lodash");
require("dotenv").config();
const { Account, validate } = require("../models/userAccount");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const express = require("express");
const accountManager = require("../../middleware/accountManager");
const router = express.Router();

// route to save new user account
router.post("/save", async (req, res, next) => {
	const account = new Account(req.body);
	const { error } = validate(req.body);
	if (error)
		return res.status(400).json({
			success: false,
			message: "Validation error",
			error: error
		});
	let validateUserAccount = await Account.findOne({
		userId: req.body.userId
	});
	if (validateUserAccount)
		return res.status(400).json({
			success: false,
			message: "Account already exist for this user"
		});
	account.save().then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				message: "Account created!",
				data: result
			});
		} else {
			res.status(200).json({
				success: false,
				message: "Error please try again!"
			});
		}
	});
});

// route to get all accounts
router.get("/all", admin, async (req, res, next) => {
	Account.find({
		isDeleted: false
	}).then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(200).json({
				message: "accounts not found"
			});
		}
	});
});

// route to get account by id
router.get("/byId/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(500).json({
			message: "Invalid request"
		});
	}
	Account.findOne({
		isDeleted: false,
		_id: id
	}).then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				data: result
			});
		} else {
			res.status(200).json({
				success: false,
				message: "Account not found"
			});
		}
	});
});

// route to get account by id
router.get("/byUserId/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(500).json({
			message: "Invalid request"
		});
	}
	Account.findOne({
		isDeleted: false,
		userId: id
	}).then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				data: result
			});
		} else {
			res.status(200).json({
				success: false,
				message: "Account not found"
			});
		}
	});
});

// route to get account by id
router.post("/test", async (req, res, next) => {
	console.log("test hit");
	let data = req.body;
	console.log("body  " + JSON.stringify(data));
	accountManager.verifyPurchase(req.body);
});

// get cost
router.get("/cost", async (req, res, next) => {
	const result = await accountManager.getCost();
	res.status(200).json({
		success: true,
		data: result[0]
	});
});

// update user account balance
router.patch("/update/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(500).json({
			message: "Account not found"
		});
	}
	Account.updateOne(
		{
			_id: id
		},
		[
			{
				$set: {
					balance: req.body.balance,
					updated_at: new Date()
				},
				$push: {
					transactions: req.body.transaction
				}
			}
		]
	).then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				data: result
			});
		} else {
			res.status(500).json({
				success: false,
				message:
					"Could not complete your request please contact with support"
			});
		}
	});
});

module.exports = router;
