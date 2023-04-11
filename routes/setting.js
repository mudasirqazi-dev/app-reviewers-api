const settingValidations = require("../validations/setting");
const getErrorDetails = require("../utils/error-details");
const all = require("../middlewares/all");
const admin = require("../middlewares/admin");
const router = require("express").Router();
const settingManager = require("../managers/setting");

router.get("/", all, async (req, res) => {
	try {
		const result = await settingManager.get();
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/", admin, async (req, res) => {
	try {
		const error = settingValidations.update(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const result = await settingManager.update(req.body);
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/buttons", admin, async (req, res) => {
	try {
		const error = settingValidations.buttons(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const result = await settingManager.updateButtons(req.body);
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/subscription", admin, async (req, res) => {
	try {
		const error = settingValidations.subscription(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const result = await settingManager.updateSubscription(req.body);
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
