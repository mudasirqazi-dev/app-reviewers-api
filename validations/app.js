const Joi = require("joi");

module.exports = {
	search: data =>
		Joi.object({
			keyword: Joi.string().required()
		}).validate(data),

	details: data =>
		Joi.object({
			keyword: Joi.string().required(),
			totalCost: Joi.number().required()
		}).validate(data)
};
