const winston = require("winston");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

db = require("./startup/db");
db.open();

require("./startup/logging")();
require("./startup/validation")();

app.get("/", (req, res) => res.status(200).send("API is working..."));
require("./routes/routes")(app);

app.get("*", (req, res) => {
	res.status(400).send("Access Denied");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	winston.info(`Listening on port ${port}...`);
	console.log(`Listening on port ${port}`);
});
