require("dotenv").config();
const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");
const userManager = require("../managers/user");

module.exports = async (req, res, next) => {
	const token = req.header(constants.TOKEN_NAME);
	if (!token)
		return res.status(401).send(`Access denied. Invalid token provided.`);

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		const user = await userManager.getBasicInfo(decoded.userId);
		if (user?.type !== "user") {
			return res
				.status(401)
				.send(`Access denied. Access level not authorized.`);
		}

		req.tokenData = decoded;
		next();
	} catch (ex) {
		return res.status(400).send(`Access denied. No token provided.`);
	}
};
