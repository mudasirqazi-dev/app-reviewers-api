require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  cost: { type: Number, default: 0, required: true },
  initialBalance: { type: Number, default: 0, required: true },
  buttons: { type: String, required: true, default: "10; 30; 50" },
});

const Setting = mongoose.model("Setting", schema);

module.exports = Setting;
