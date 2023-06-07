const Joi = require("joi");

module.exports = {
	send: data =>
		Joi.object({
			numbers: Joi.array().items(Joi.any()).min(1).required(),
			message: Joi.string().required()
		}).validate(data)
};
