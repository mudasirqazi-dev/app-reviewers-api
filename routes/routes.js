const express = require("express");
const error = require("../middleware/error");
const users = require("../app/controllers/users");
const apps = require("../app/controllers/apps");
const sms = require("../app/controllers/sms");
const account = require("../app/controllers/userAccount");
const cost = require("../app/controllers/cost");
const cors = require("cors");

module.exports = function (app) {
	app.use(express.json());
	app.use(cors());

	app.use("/api/users", users);
	app.use("/api/apps", apps);
	app.use("/api/sms", sms);
	app.use("/api/account", account);
	app.use("/api/cost", cost);
	app.use(error);
};
