const _ = require("lodash");
require("dotenv").config();
const { Name } = require("../models/names");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const express = require("express");
const router = express.Router();

// route to save new name object
router.post("/save", async (req, res, next) => {
	const name = new Name(req.body);
	name.save().then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				message: "Object created!",
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

router.get("/all", admin, async (req, res, next) => {
	Name.find({}).then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(200).json({
				message: "accounts not found"
			});
		}
	});
});

router.patch("/update/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(500).json({
			message: "Invalid id"
		});
	}
	Name.updateOne(
		{
			_id: id
		},
		[
			{
				$set: {
					names: req.body.names
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
