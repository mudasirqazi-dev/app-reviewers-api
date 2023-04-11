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
const searches = require("./routes/search");
const settings = require("./routes/setting");
const names = require("./routes/name");
const stats = require("./routes/stats");
const axios = require("axios");

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
app.use("/api/searches", searches);
app.use("/api/settings", settings);
app.use("/api/names", names);
app.use("/api/stats", stats);

const STORE_ID = "BebLP9AMiroZLvbc2T5ScupjmZk19CqTfxoS216e3Vba";
const API_KEY = "HlovnDdERbv7EZ01vlZZMlWQdRDd7oky0hEikiRPL07";
const ACCESS_TOKEN =
	"SGxvdm5EZEVSYnY3RVowMXZsWlpNbFdRZFJEZDdva3kwaEVpa2lSUEwwNw==";

let URL = `https://btcpay.prefex.cc/api/v1/stores/${STORE_ID}/pull-payments`;
// URL = `https://btcpay.prefex.cc/api/v1/${API_KEY}/authorize`;

// app.post("/test", async (req, res) => {
// 	await axios
// 		.get(URL, {
// 			headers: {
// 				// Authorization: `token ${API_KEY}`
// 				Authorization: `Basic ${ACCESS_TOKEN}`
// 			}
// 		})
// 		.then(response => {
// 			console.log(response.data);
// 		});
// 	res.sendStatus(200);
// });

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
