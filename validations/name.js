const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  update: (data) =>
    Joi.object({
      name: Joi.string().required().allow(""),
    }).validate(data),

  id: (data) =>
    Joi.object({
      id: Joi.string().required(),
    }).validate(data),

  createMany: (data) =>
    Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().allow(""),
        })
      )
      .validate(data),
};
