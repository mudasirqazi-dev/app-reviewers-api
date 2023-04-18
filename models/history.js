require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	cost: {
		type: Number,
		required: true
	},
	keyword: {
		type: String,
		required: true
	},
	count: {
		type: Number,
		required: true,
		default: 0
	},
	results: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: ""
	},
	date: { type: Date, required: false, default: Date.now() }
});

const History = mongoose.model("History", schema);

module.exports = History;
