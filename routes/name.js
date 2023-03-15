const nameValidations = require("../validations/name");
const getErrorDetails = require("../utils/error-details");
const admin = require("../middlewares/admin");
const router = require("express").Router();
const nameManager = require("../managers/name");

router.get("/", admin, async (req, res) => {
	try {
		const result = await nameManager.get();
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/", admin, async (req, res) => {
	try {
		const error = nameValidations.update(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const result = await nameManager.update(req.body);
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
