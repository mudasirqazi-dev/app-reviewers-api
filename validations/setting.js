const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  update: (data) =>
    Joi.object({
      cost: Joi.number().required(),
      initialBalance: Joi.number().required(),
    }).validate(data),

  buttons: (data) =>
    Joi.object({
      buttons: Joi.string().required(),
    }).validate(data),

  subscription: (data) =>
    Joi.object({
      subscription: Joi.number().required(),
    }).validate(data),
};
