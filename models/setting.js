require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	cost: { type: Number, default: 0, required: true },
	initialBalance: { type: Number, default: 0, required: true }
});

const Setting = mongoose.model("Setting", schema);

module.exports = Setting;
