const express = require("express");
const bodyParser = require("body-parser");
const error = require("../middleware/error");
const users = require("../app/controllers/users");
const apps = require("../app/controllers/apps");
const sms = require("../app/controllers/sms");
const account = require("../app/controllers/userAccount");
const cost = require("../app/controllers/cost");
const cors = require("cors");

module.exports = function (app) {
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get("/api/test", (req, res) =>
		res.status(200).send("API is working...")
	);

	app.use("/api/users", users);
	app.use("/api/apps", apps);
	app.use("/api/sms", sms);
	app.use("/api/account", account);
	app.use("/api/cost", cost);
	app.use(error);
};
