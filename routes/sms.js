const smsValidations = require("../validations/sms");
const getErrorDetails = require("../utils/error-details");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const smsManager = require("../managers/sms");
const userManager = require("../managers/user");

router.post("/", auth, async (req, res) => {
	try {
		const error = smsValidations.send(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.tokenData.userId;
		const user = await userManager.getBasicInfo(userId);
		if (!user?.smsedgeKey || user?.smsedgeKey?.length === 0)
			return res.status(400).send(`Invalid SMSEdge key found.`);

		const result = await smsManager.sendToMultipleNumbers(
			req.body,
			user?.smsedgeKey
		);
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
