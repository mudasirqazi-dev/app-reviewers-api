require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	names: { type: String, required: false, default: "" }
});

const Name = mongoose.model("Name", schema);

module.exports = Name;
