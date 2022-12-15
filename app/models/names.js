require("dotenv").config();
const mongoose = require("mongoose");

const namesSchema = new mongoose.Schema({
	names: {
		type: String
	}
});

const Name = mongoose.model("Name", namesSchema);

exports.namesSchema = namesSchema;
exports.Name = Name;
