require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	userName: {
		type: String,
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
	type: {
		type: String,
		required: true,
		default: "Free"
	},
	results: {
		type: Number,
		required: false,
		default: 0
	},
	date: { type: Date, required: false, default: Date.now() }
});

const Search = mongoose.model("Search", schema);

module.exports = Search;
