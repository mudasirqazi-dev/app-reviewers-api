require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true, default: "" },
});

const Name = mongoose.model("Name", schema);

module.exports = Name;
