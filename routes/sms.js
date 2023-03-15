const smsValidations = require("../validations/sms");
const getErrorDetails = require("../utils/error-details");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const smsManager = require("../managers/sms");

router.post("/", auth, async (req, res) => {
	try {
		const error = smsValidations.send(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const result = await smsManager.sendSms(req.body);
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
