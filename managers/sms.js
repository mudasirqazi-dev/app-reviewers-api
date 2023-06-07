require("dotenv").config();
const api = require("smsedge-api-node-js");

module.exports = {
	sendSms: (data, apiKey) => {
		try {
			return new Promise((resolve, reject) => {
				const fields = {
					from: process.env.APP_NAME,
					to: data.phone,
					text: data.message,
					name: data.username
				};

				const SMSEdgeApi = new api(apiKey);
				SMSEdgeApi.sendSingleSms(fields, cb => {
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
	},

	sendToMultipleNumbers: (data, apiKey) => {
		return new Promise((resolve, reject) => {
			try {
				const SMSEdgeApi = new api(apiKey);
				const FROM = process.env.APP_NAME;
				const message = data.message;
				const success = [];
				for (let i = 0; i < data.numbers.length; i++) {
					let _contact = data.numbers[i];
					let fields = {
						from: FROM,
						to: _contact.phone,
						text: message,
						name: `${_contact.firstname} ${_contact.surname}`
					};
					SMSEdgeApi.sendSingleSms(fields, cb => {
						if (cb.success) {
							success.push(fields);
						}
					});
				}
				resolve(true);
			} catch (ex) {
				reject(ex.message);
			}
		});
	}
};
