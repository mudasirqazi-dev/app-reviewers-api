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
	results: {
		type: Number,
		required: false,
		default: 0
	},
	date: { type: Date, required: false, default: Date.now() }
});

const Search = mongoose.model("Search", schema);

module.exports = Search;