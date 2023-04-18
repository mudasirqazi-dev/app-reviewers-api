const Joi = require("joi");

module.exports = {
	search: data =>
		Joi.object({
			keyword: Joi.string().required(),
			userName: Joi.string().required()
		}).validate(data),

	details: data =>
		Joi.object({
			keyword: Joi.string().required(),
			selectedUsers: Joi.array()
		}).validate(data)
};
