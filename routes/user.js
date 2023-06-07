const userValidations = require("../validations/user");
const getErrorDetails = require("../utils/error-details");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = require("express").Router();
const userManager = require("../managers/user");
const crypto = require("../utils/crypto");
const utils = require("../utils/utils");
const tokens = require("../utils/tokens");
const replaceall = require("replaceall");
const emailManager = require("../managers/email");
const settingsManager = require("../managers/setting");

router.post("/signup", async (req, res) => {
	try {
		const error = userValidations.signup(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.getByEmail(req.body.email);
		if (user)
			return res
				.status(400)
				.send(
					`Email already exists please choose another email address.`
				);

		const settings = await settingsManager.get();
		const obj = {
			...req.body,
			password: await crypto.hash(req.body.password),
			points: settings?.initialBalance || 0
		};

		user = await userManager.create(obj);

		const link = `${process.env.ACTIVATE_ACCOUNT_URL}?token=${user._id}`;
		let html = await utils.readTemplate(`activate`);
		html = replaceall(`{{appName}}`, process.env.APP_NAME, html);
		html = replaceall(`{{link}}`, link, html);
		await emailManager.sendEmail({
			to: req.body.email,
			subject: "Verify your email address",
			html: html
		});

		return res.status(200).send(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/create", admin, async (req, res) => {
	try {
		const error = userValidations.signup(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.getByEmail(req.body.email);
		if (user)
			return res
				.status(400)
				.send(
					`Email already exists please choose another email address.`
				);

		const settings = await settingsManager.get();
		const obj = {
			...req.body,
			password: await crypto.hash(req.body.password),
			points: settings?.initialBalance || 0
		};

		user = await userManager.create(obj);

		const link = `${process.env.ACTIVATE_ACCOUNT_URL}?token=${user._id}`;
		let html = await utils.readTemplate(`activate`);
		html = replaceall(`{{appName}}`, process.env.APP_NAME, html);
		html = replaceall(`{{link}}`, link, html);
		await emailManager.sendEmail({
			to: req.body.email,
			subject: "Verify your email address",
			html: html
		});

		return res.status(200).send(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/", async (req, res) => {
	try {
		const error = userValidations.signup(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.getByEmail(req.body.email);
		if (user)
			return res
				.status(400)
				.send(
					`Email already exists please choose another email address.`
				);

		const settings = await settingsManager.get();
		const obj = {
			...req.body,
			password: await crypto.hash(req.body.password),
			points: settings?.initialBalance || 0
		};

		user = await userManager.create(obj);

		const link = `${process.env.ACTIVATE_ACCOUNT_URL}?token=${user._id}`;
		let html = await utils.readTemplate(`activate`);
		html = replaceall(`{{appName}}`, process.env.APP_NAME, html);
		html = replaceall(`{{link}}`, link, html);
		await emailManager.sendEmail({
			to: req.body.email,
			subject: "Verify your email address",
			html: html
		});

		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/activate", async (req, res) => {
	try {
		const error = userValidations.activate(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.getById(req.body.token);
		if (!user)
			return res
				.status(400)
				.send(`Invalid account activation token provided.`);

		user = await userManager.updateActiveStatus(req.body.token, true);

		let html = await utils.readTemplate(`welcome`);
		html = utils.replaceAll(html, `{{name}}`, user.name);
		html = utils.replaceAll(html, `{{appName}}`, process.env.APP_NAME);
		emailManager.sendEmail({
			to: user.email,
			subject: `Welcome to ${process.env.APP_NAME}`,
			html: html
		});

		return res.status(200).json(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/login", async (req, res) => {
	try {
		const error = userValidations.login(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const user = await userManager.getByEmail(req.body.email);
		if (!user)
			return res
				.status(400)
				.send(`User does not exists with this email.`);

		const passwordMatches = await crypto.compare(
			req.body.password,
			user.password
		);
		if (!passwordMatches)
			return res.status(400).send(`Password did not match.`);

		if (user.active === false)
			return res
				.status(400)
				.send(`User is not active. Please activate via signup email.`);

		if (user.blocked === true)
			return res.status(400).send(`User is blocked by the Admin.`);

		if (user.type !== "user")
			return res
				.status(400)
				.send(
					`Your access level is not authorized to use this application.`
				);

		const token = await tokens.getJwt(user._id);
		const result = {
			token: token,
			user: user
		};
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/self`, auth, async (req, res) => {
	try {
		const userId = req.tokenData.userId;
		const user = await userManager.getBasicInfoToRefreshSession(userId);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/signin", async (req, res) => {
	try {
		const error = userValidations.login(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const user = await userManager.getByEmail(req.body.email);
		if (!user)
			return res
				.status(400)
				.send(`User does not exists with this email.`);

		const passwordMatches = await crypto.compare(
			req.body.password,
			user.password
		);
		if (!passwordMatches)
			return res.status(400).send(`Password did not match.`);

		if (user.active === false)
			return res
				.status(400)
				.send(`User is not active. Please activate via signup email.`);

		if (user.blocked === true)
			return res.status(400).send(`User is blocked by the Admin.`);

		if (user.type !== "admin")
			return res
				.status(400)
				.send(
					`Your access level is not authorized to use this application.`
				);

		const token = await tokens.getJwt(user._id);
		const result = {
			token: token,
			user: user
		};
		return res.status(200).send(result);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/forgot-password", async (req, res) => {
	try {
		const error = userValidations.forgotPassword(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const user = await userManager.getByEmail(req.body.email);
		if (!user)
			return res
				.status(400)
				.send(`User does not exists with this email.`);

		const temp = await userManager.setTempPassword(req.body.email);
		const link = `${process.env.RESET_PASSWORD_URL}?token=${temp}`;
		let html = await utils.readTemplate(`forgot-password`);
		html = replaceall(`{{appName}}`, process.env.APP_NAME, html);
		html = replaceall(`{{link}}`, link, html);
		await emailManager.sendEmail({
			to: req.body.email,
			subject: "Reset your password",
			html: html
		});

		return res.status(200).send(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/reset-password", async (req, res) => {
	try {
		const error = userValidations.resetPassword(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.getByTempPassword(req.body.token);
		if (!user)
			return res
				.status(400)
				.send(`Invalid password reset token provided.`);

		const obj = { password: await crypto.hash(req.body.newPassword) };

		user = await userManager.updatePassword(user._id, obj);

		let html = await utils.readTemplate(`reset-password`);
		html = replaceall(`{{name}}`, user.name, html);
		html = replaceall(`{{appName}}`, process.env.APP_NAME, html);
		emailManager.sendEmail({
			to: user.email,
			subject: "Password reset",
			html: html
		});

		return res.status(200).send(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/update-password", auth, async (req, res) => {
	try {
		const error = userValidations.updatePassword(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.getById(req.tokenData.userId);
		const passwordMatches = await crypto.compare(
			req.body.currentPassword,
			user.password
		);
		if (!passwordMatches)
			return res.status(400).send(`Wrong current password.`);

		const encryptedPassword = await crypto.hash(req.body.newPassword);
		user = await userManager.updatePassword(req.tokenData.userId, {
			password: encryptedPassword
		});
		return res.status(200).send(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post("/restore-password", admin, async (req, res) => {
	try {
		const error = userValidations.changePassword(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const encryptedPassword = await crypto.hash(req.body.newPassword);
		user = await userManager.updatePassword(req.body.userId, {
			password: encryptedPassword
		});

		let html = await utils.readTemplate(`restore-password`);
		html = replaceall(`{{name}}`, user.name, html);
		html = replaceall(`{{appName}}`, process.env.APP_NAME, html);
		emailManager.sendEmail({
			to: user.email,
			subject: "Password restored",
			html: html
		});

		return res.status(200).send(true);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.get(`/:userId`, admin, async (req, res) => {
	try {
		const error = userValidations.userId(req.params).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.params.userId;
		const user = await userManager.getById(userId);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/all`, async (req, res) => {
	try {
		const keyword = req.body.keyword || "";
		const page = req.body.page || "";
		const limit = req.body.limit || "";
		const users = await userManager.getAll(keyword, page, limit);
		return res.status(200).send(users);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.get(`/totalUsers`, admin, async (req, res) => {
	try {
		const users = await userManager.getTotalUsers();
		return res.status(200).send(users);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.delete(`/:userId`, async (req, res) => {
	try {
		const error = userValidations.userId(req.params).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.params.userId;
		const user = await userManager.delete(userId);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/blocked`, admin, async (req, res) => {
	try {
		const error = userValidations.changeStatus(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.body.userId;
		const newStatus = req.body.newStatus;
		const user = await userManager.updateBlockedStatus(userId, newStatus);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/active`, admin, async (req, res) => {
	try {
		const error = userValidations.changeStatus(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.body.userId;
		const newStatus = req.body.newStatus;
		const user = await userManager.updateActiveStatus(userId, newStatus);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.put("/:userId", async (req, res) => {
	try {
		const error = userValidations.userId(req.params).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		let user = await userManager.updateUserBasic(
			req.params.userId,
			req.body
		);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/points`, admin, async (req, res) => {
	try {
		const error = userValidations.addPoints(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.body.userId;
		const points = req.body.points;
		const user = await userManager.addPoints(userId, points);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/name`, admin, async (req, res) => {
	try {
		const error = userValidations.update(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));
		const userId = req.body.userId;
		const name = req.body.name;
		const user = await userManager.updateName(userId, name);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/update-key`, auth, async (req, res) => {
	try {
		const error = userValidations.updateKey(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.tokenData.userId;
		const key = req.body.key;
		const user = await userManager.updateSmsEdgeKey(userId, key);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

router.post(`/update-keywords`, auth, async (req, res) => {
	try {
		const error = userValidations.updateKeywords(req.body).error;
		if (error) return res.status(400).send(getErrorDetails(error));

		const userId = req.tokenData.userId;
		const searchKeywords = req.body.searchKeywords;
		const user = await userManager.updateSearchKeywords(
			userId,
			searchKeywords
		);
		return res.status(200).send(user);
	} catch (ex) {
		return res.status(500).send(ex.message);
	}
});

module.exports = router;
