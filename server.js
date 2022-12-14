const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
db = require("./startup/db");
require("./startup/validation")();
require("./routes/routes")(app);

app.get("*", (req, res) => {
	res.status(400).send("Access Denied");
});

db.open();

const port = process.env.PORT || 3000;
app.listen(port, () => {
	winston.info(`Listening on port ${port}...`);
	console.log(`Listening on port ${port}`);
});
