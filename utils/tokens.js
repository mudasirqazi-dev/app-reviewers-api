const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
	getJwt: async userId => {
		try {
			const data = { userId };
			const token = jwt.sign(data, process.env.JWT_PRIVATE_KEY);
			return token;
		} catch (ex) {
			throw ex;
		}
	}
};
