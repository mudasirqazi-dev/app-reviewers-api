require("dotenv").config();
const mongoose = require("mongoose");

const schema = new mongoose.Schema({});
const App = mongoose.model("App", schema);

module.exports = App;
