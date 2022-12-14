const _ = require("lodash");
require("dotenv").config();
const { User, validate } = require("../models/user");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const EmailManager = require("../../middleware/custom-emails");
const AccountManager = require("../../middleware/accountManager");
const bcrypt = require("bcrypt");
const express = require("express");
const generator = require("generate-password");
const Encrypt = require("../../middleware/Encrypt&Decrypt");
const router = express.Router();
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// route to save new user
router.post("/save", async (req, res, next) => {
	const user = new User(req.body);
	const { error } = validate(req.body);
	if (error)
		return res.status(400).json({
			success: false,
			message: "Validation error",
			error: error
		});
	let validateEmail = await User.findOne({
		email: req.body.email
	});
	if (validateEmail)
		return res.status(400).json({
			success: false,
			message: "Email already register"
		});
	user.save().then(result => {
		if (result) {
			AccountManager.createNewUserAccount(result);
			EmailManager.verifyEmail(result);
			res.status(200).json({
				success: true,
				message: "Account created!",
				data: result
			});
		} else {
			res.status(200).json({
				success: false,
				message: "Error please try again!"
			});
		}
	});
});

// user login
router.post("/login", async (req, res) => {
	let email = req.body.email.replace(/\s/g, "");
	email = email.toLowerCase();
	const user = await User.findOne({
		email: email
	});
	if (!user)
		return res.status(400).json({
			message: `Invalid Email Or password`
		});
	const validPassword = bcrypt.compareSync(req.body.password, user.password);
	if (!validPassword)
		return res.status(400).json({
			message: `Invalid password`
		});
	if (user.isVerified == false)
		return res.status(400).send({
			success: false,
			message: "please verify your email address"
		});
	if (user.isDeleted == true)
		return res.status(400).send({
			success: false,
			message: "your account is blocked please contact with admin"
		});
	if (user.isBlock == true)
		return res.status(400).send({
			success: false,
			message: "your account is blocked please contact with admin"
		});
	const token = user.generateAuthToken();
	await user
		.updateOne({
			$set: {
				lastLoginDate: Date.now()
			},
			function(error) {
				return error;
			}
		})
		.then(data => {
			if (data) {
				res.status(200).json({
					success: true,
					data: token
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Server could not complete your request"
				});
			}
		});
});

// route to get all users
router.get("/all", admin, async (req, res, next) => {
	User.find({
		isDeleted: false
	}).then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(200).json({
				message: "users not found"
			});
		}
	});
});

// route to get user by id
router.get("/byId/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(200).json({
			message: "User not found"
		});
	}
	User.findOne({
		isDeleted: false,
		_id: id
	}).then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				data: result
			});
		} else {
			res.status(200).json({
				success: false,
				message: "User not found"
			});
		}
	});
});

// update user by id
router.patch("/update/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(200).json({
			message: "Usernot found"
		});
	}
	User.updateOne(
		{
			_id: id
		},
		[
			{
				$set: {
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					contact: req.body.contact
				}
			}
		]
	).then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				data: result
			});
		} else {
			res.status(200).json({
				success: false,
				message: "User not found"
			});
		}
	});
});

// verify user email
router.patch("/email/verify", async (req, res, next) => {
	let token = req.body.token;
	if (!token) {
		res.status(500).json({
			message: "Invalid Request"
		});
	}
	let userId = await Encrypt.decrypt(token);
	let user = await User.findById(userId);
	if (!user)
		return res.status(400).json({
			success: false,
			message: "Invalid Token"
		});
	if (user.isVerified)
		return res.status(400).json({
			success: false,
			message: "Invalid && Expired Token"
		});
	User.updateOne(
		{
			_id: userId
		},
		[
			{
				$set: {
					isVerified: true
				}
			}
		]
	).then(result => {
		if (result) {
			res.status(200).json({
				success: true,
				message: "Account is verified"
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Unable to proceed your request"
			});
		}
	});
});

//send forget password email
router.post("/forgotPassword", async (req, res) => {
	let email = req.body.email;
	const forgotPasswordCode = generator.generate({
		length: 12,
		numbers: true
	});
	const forgotPasswordCodeHash = await bcrypt.hash(
		`${forgotPasswordCode}`,
		10
	);
	let userExist = await User.findOne({
		email: email
	});
	if (userExist && userExist._id) {
		const token = jwt.sign(
			{
				user: {
					forgotPasswordCode,
					email
				}
			},
			process.env.Encription_Secret,
			{
				expiresIn: "20m"
			}
		);
		let verificationLink = `${process.env.forgotPassword}token=${token}`;
		userExist.forgotPasswordCode = forgotPasswordCodeHash;
		await userExist.updateOne({
			$set: {
				forgotPasswordCode: forgotPasswordCodeHash,
				updated_at: Date.now()
			}
		});
		// await userExist.save();
		let data = {
			email: email,
			link: verificationLink
		};
		EmailManager.forgotPassword(data).then(result => {
			res.status(200).json({
				success: true,
				message: "Email sent"
			});
		});
	} else {
		res.status(500).json({
			success: false,
			message: "Email not found"
		});
	}
});

//reset forgot password
router.post("/resetforgotPassword", async (req, res) => {
	let token = req.body.token;
	jwt.verify(
		token,
		process.env.Encription_Secret,
		async function (err, data) {
			if (err || !data) {
				res.status(500).json({
					message: "Unauthorized Access."
				});
			}
			let authUser = data.user;
			let forgotPasswordCode = authUser.forgotPasswordCode;
			let email = authUser.email;
			let newPassword = req.body.password;

			let user = await User.findOne({
				email: email
			});
			if (user && user.forgotPasswordCode) {
				let isMatched = await bcrypt.compare(
					forgotPasswordCode,
					user.forgotPasswordCode
				);
				if (isMatched) {
					user.forgotPasswordCode = null;
					newPassword = bcrypt.hashSync(newPassword, saltRounds);
					await user.updateOne({
						$set: {
							password: newPassword,
							forgotPasswordCode: null,
							updated_at: Date.now()
						}
					});
					return res.status(200).json({
						success: true,
						message: "Password has been updated successfully."
					});
				} else {
					return res.status(400).json({
						success: false,
						message: `Error: something wrong please try later`
					});
				}
			} else {
				return res.status(400).json({
					success: false,
					message: `Invalid request.`
				});
			}
		}
	);
});

// update user profile
router.put("/update/profile/:id", auth, async (req, res, next) => {
	let id = req.params.id;
	if (!id) {
		res.status(200).json({
			message: "Usernot found"
		});
	}
	let user = await User.findById(id);
	user.updateOne(req.body).then(data => {
		if (data) {
			res.status(200).json({
				success: true,
				message: "Profile Updated!"
			});
		} else {
			res.status(500).json({
				success: false,
				message: "Error! Profile not updated"
			});
		}
	});
});

//change password
router.put("/changePassword", auth, async (req, res) => {
	const user = await User.findById(req.body.id);
	if (!user)
		return res.status(400).json({
			success: false,
			message: "User not found"
		});
	const validPassword = bcrypt.compareSync(req.body.password, user.password);
	if (!validPassword)
		return res.status(400).json({
			success: false,
			message: "Invalid previous password."
		});
	var newPassword = req.body.newPassword;
	newPassword = bcrypt.hashSync(newPassword, saltRounds);
	await user.updateOne({
		$set: {
			password: newPassword,
			updated_at: Date.now()
		}
	});
	res.status(200).json({
		success: true,
		message: "Password is reset successfully!"
	});
});

//access manage
router.put("/access/manage", auth, async (req, res) => {
	const user = await User.findById(req.body.id);
	console.log("user " + JSON.stringify(user));

	await user.updateOne({
		$set: {
			isBlock: req.body.status,
			updated_at: Date.now()
		}
	});
	res.status(200).json({
		success: true,
		message: "Access update successfully!"
	});
});

//change password
router.post("/changePassword", auth, async (req, res) => {
	const user = await User.findById(req.body.id);
	if (!user)
		return res.status(400).json({
			success: false,
			message: "User not found"
		});
	const validPassword = bcrypt.compareSync(req.body.password, user.password);
	if (!validPassword)
		return res.status(400).json({
			success: false,
			message: "Invalid previous password."
		});
	var newPassword = req.body.newPassword;
	newPassword = bcrypt.hashSync(newPassword, saltRounds);
	await user.updateOne({
		$set: {
			password: newPassword,
			updated_at: Date.now()
		}
	});
	res.status(200).json({
		success: true,
		message: "Password is reset successfully!"
	});
});
module.exports = router;
