require("dotenv").config();
const Joi = require("joi");
const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
	userId: {
		type: String
	},
	balance: {
		type: Number,
		default: 0
	},
	transactions: {
		type: Array,
		default: []
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	created_at: {
		type: Date,
		default: Date.now
	},

	updated_at: {
		type: Date
	}
});

const Account = mongoose.model("Account", accountSchema);

function validateAccount(Account) {
	const schema = {
		userId: Joi.string().min(1).max(500).required(),
		balance: Joi.number().required(),
		transactions: Joi.optional()
	};
	return Joi.validate(Account, schema);
}

exports.accountSchema = accountSchema;
exports.Account = Account;
exports.validate = validateAccount;
