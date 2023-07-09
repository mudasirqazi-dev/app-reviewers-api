const Joi = require("joi");

module.exports = {
	search: data =>
		Joi.object({
			keyword: Joi.array().items(Joi.string()).min(1).required(),
			userName: Joi.string().required(),
			addSearchRecord: Joi.boolean().required()
		}).validate(data),

	details: data =>
		Joi.object({
			keyword: Joi.array().items(Joi.string()).min(1).required(),
			selectedUsers: Joi.array()
		}).validate(data)
};
