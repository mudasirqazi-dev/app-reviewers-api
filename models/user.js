require("dotenv").config();
const mongoose = require("mongoose");
const { isEmail } = require("validator");

// function getPoints(value) {
// 	if (typeof value !== "undefined") {
// 		return parseFloat(value.toString());
// 	}
// 	return value;
// }

const schema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			validate: isEmail
		},
		password: { type: String, required: true, minlength: 3 },
		type: { type: String, required: true, default: "user" }, // user, admin
		tempPassword: { type: String, required: false },
		active: { type: Boolean, required: true, default: false },
		blocked: { type: Boolean, required: false, default: false },
		joined: { type: Date, required: false, default: Date.now() },
		points: {
			type: Number,
			required: false,
			default: 0
			// get: getPoints
		}
	}
	// { toJSON: { getters: true } }
);

const User = mongoose.model("User", schema);

module.exports = User;
