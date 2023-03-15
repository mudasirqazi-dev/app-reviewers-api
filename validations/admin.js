const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
	update: data =>
		Joi.object({
			name: Joi.string().min(1).max(100).required()
		}).validate(data),

	login: data =>
		Joi.object({
			email: Joi.string().min(1).max(255).required().email(),
			password: Joi.string().min(3).max(255).required()
		}).validate(data),

	forgotPassword: data =>
		Joi.object({
			email: Joi.string().min(1).max(255).required().email()
		}).validate(data),

	resetPassword: data =>
		Joi.object({
			newPassword: Joi.string().min(3).max(255).required()
		}).validate(data),

	updatePassword: data =>
		Joi.object({
			currentPassword: Joi.string().min(3).max(255).required(),
			newPassword: Joi.string().min(3).max(255).required()
		}).validate(data),

	changePassword: data =>
		Joi.object({
			newPassword: Joi.string().min(3).max(255).required(),
			userId: Joi.objectId().required()
		}).validate(data),

	updateStatus: data =>
		Joi.object({
			status: Joi.boolean().required(),
			userId: Joi.objectId().required()
		}).validate(data),

	userId: data =>
		Joi.object({
			userId: Joi.objectId().required()
		}).validate(data),

	npoId: data =>
		Joi.object({
			npoId: Joi.objectId().required().allow("")
		}).validate(data),

	getAll: data =>
		Joi.object({
			keyword: Joi.string().optional().allow("")
		}).validate(data)
};
