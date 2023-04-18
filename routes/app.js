const appValidations = require("../validations/app");
const getErrorDetails = require("../utils/error-details");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const appManager = require("../managers/app");
const searchManager = require("../managers/search");
const userManager = require("../managers/user");
const historyManager = require("../managers/history");
const settingManager = require("../managers/setting");
const moment = require("moment");

const getContact = user => {
	let keys = Object.keys(user);
	let key = "phone_0";
	let result = startsWith(keys, key);
	let index = keys?.findIndex(data => data == result);
	let value = Object.values(user)[index];
	let content = value.split(";");
	return content[0];
};

const startsWith = (array, key) => {
	const matcher = new RegExp(`^${key}`, "g");
	return array.filter(word => word.match(matcher));
};

router.post("/", auth, async (req, res) => {
	try {
		const error = appValidations.search(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const keyword = req.body.keyword || "";
		const list = await appManager.getAll(keyword);
		const history = await historyManager.getByUserId(
			keyword,
			req.tokenData.userId
		);

		// add search record
		await searchManager.create({
			userId: req.tokenData.userId,
			userName: req.body.userName,
			keyword: keyword,
			cost: req.body.totalCost || 0,
			type: "Free",
			results: list?.length || 0,
			date: moment().format()
		});

		return res.status(200).send({ list, history });
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/details", auth, async (req, res) => {
	try {
		const error = appValidations.details(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const selectedUsers = req.body.selectedUsers.map(k => k.username);
		const settings = await settingManager.get();
		const cost = settings?.cost;
		const totalCost = cost * selectedUsers?.length;

		const user = await userManager.getBasicInfo(req.tokenData.userId);
		if (user?.points < totalCost)
			return res
				.status(400)
				.send(
					`Insufficient balance. You need atleast ${totalCost} credits.`
				);

		const keyword = req.body.keyword || "";
		const list = await appManager.getAllDetails2(keyword, selectedUsers);

		// return res.status(200).send(true);

		// deduct points
		await userManager.subtractPoints(req.tokenData.userId, totalCost);

		// add search record
		await searchManager.create({
			userId: req.tokenData.userId,
			userName: user?.name,
			keyword: keyword,
			cost: totalCost || 0,
			type: "Paid",
			results: list?.length || 0,
			date: moment().format()
		});

		const _list = [];
		for (let i = 0; i < list.length; i++) {
			let t = list[i]._doc;
			_list.push({
				username: t.username,
				app: t.app,
				country: t.country,
				phone: getContact(t)
			});
		}

		// user's search history
		let t = await historyManager.create({
			userId: req.tokenData.userId,
			cost: totalCost,
			keyword: keyword,
			count: _list?.length,
			results: _list,
			date: moment().format()
		});

		return res.status(200).send(_list);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
