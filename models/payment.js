require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	btc: {
		type: String,
		required: false
	},
	currency: {
		type: String,
		required: true,
		default: "USD"
	},
	details: {
		type: mongoose.Schema.Types.Mixed,
		required: false
	},
	date: { type: Date, required: false, default: Date.now() }
});

const Payment = mongoose.model("Payment", schema);

module.exports = Payment;
