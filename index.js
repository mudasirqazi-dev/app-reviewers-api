require("./db/connection");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const users = require("./routes/user");
const apps = require("./routes/app");
const sms = require("./routes/sms");
const payments = require("./routes/payment");
const settings = require("./routes/setting");
const names = require("./routes/name");
const smsManager = require("./managers/sms");

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/", (req, res) => res.status(200).send("API is working..."));
app.use("/api/users", users);
app.use("/api/apps", apps);
app.use("/api/sms", sms);
app.use("/api/payments", payments);
app.use("/api/settings", settings);
app.use("/api/names", names);

app.post("/test", async (req, res) => {
	await smsManager.sendSms({
		phone: "+923237820910",
		message: "Test",
		username: "MQ"
	});
	res.sendStatus(200);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
