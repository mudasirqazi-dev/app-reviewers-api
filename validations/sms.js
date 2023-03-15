const Joi = require("joi");

module.exports = {
	send: data =>
		Joi.object({
			phone: Joi.string().required(),
			username: Joi.string().required(),
			message: Joi.string().required()
		}).validate(data)
};
