const auth = require("../middlewares/auth");
const router = require("express").Router();
const userManager = require("../managers/user");
const paymentManager = require("../managers/payment");
const moment = require("moment");

router.post("/", async (req, res) => {
	try {
		const data = req.body;
		if (data?.status !== "paid")
			return res.status(400).send(`Payment not completed.`);

		const email = data?.buyerFields?.buyerEmail || false;
		if (!email)
			return res.status(400).send(`Buyer email address not provided.`);

		let user = await userManager.getByEmail(email);
		if (!user)
			return res
				.status(400)
				.send(`User does not exist with this email address.`);

		await paymentManager.create({
			userId: user?._id,
			amount: data?.price,
			currency: data?.currency,
			btc: data?.btcPaid,
			date: moment().format(),
			details: data
		});
		await userManager.addPoints1(user?._id, user?.points, data?.price);

		return res.sendStatus(200);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
