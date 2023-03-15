const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
	update: data =>
		Joi.object({
			names: Joi.string().required().allow("")
		}).validate(data)
};
