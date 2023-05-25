require("dotenv").config();
const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");

module.exports = async (req, res, next) => {
	// let token =
	// 	req.header(constants.TOKEN_NAME) ||
	// 	req.header(constants.TOKEN_NAME_ADMIN);

	const token =
		req.headers[constants.TOKEN_NAME] ||
		req.headers[constants.TOKEN_NAME_ADMIN] ||
		false;
	if (!token)
		return res.status(401).send(`Access denied. Invalid token provided.`);

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.tokenData = decoded;
		next();
	} catch (ex) {
		return res.status(400).send(`Access denied. No token provided.`);
	}
};
