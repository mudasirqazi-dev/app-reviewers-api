require("dotenv").config();
const api = require("smsedge-api-node-js");
const SMSEdgeApi = new api(process.env.SMS_EDGE_API_KEY);

module.exports = {
	sendSms: data => {
		try {
			return new Promise((resolve, reject) => {
				const fields = {
					from: process.env.APP_NAME,
					to: data.phone,
					text: data.message,
					name: data.username
				};

				SMSEdgeApi.sendSingleSms(fields, cb => {
					console.log(cb);
					if (cb.success) {
						resolve(true);
					} else {
						reject(false);
					}
				});
			});
		} catch (ex) {
			reject(ex.message);
		}
	}
};
