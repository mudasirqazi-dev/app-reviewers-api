require("dotenv").config();
const Joi = require("joi");
const mongoose = require("mongoose");
const appSchema = new mongoose.Schema({});
appSchema.index({ app: "text" });
const Apps = mongoose.model("app", appSchema);

exports.appSchema = appSchema;
exports.Apps = Apps;
// exports.validate = validateAccount;
