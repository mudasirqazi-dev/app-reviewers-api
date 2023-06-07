const Joi = require("joi");

module.exports = {
	update: data =>
		Joi.object({
			userId: Joi.string().required(),
			name: Joi.string().required()
		}).validate(data),

	updateKey: data =>
		Joi.object({
			key: Joi.string().required()
		}).validate(data),

	updateKeywords: data =>
		Joi.object({
			searchKeywords: Joi.string().allow("")
		}).validate(data),

	signup: data =>
		Joi.object({
			name: Joi.string().min(1).max(100).required(),
			email: Joi.string().max(255).required().email(),
			password: Joi.string().min(3).max(255).required(),
			joined: Joi.string().required(),
			type: Joi.string().required()
		}).validate(data),

	activate: data =>
		Joi.object({
			token: Joi.string().required()
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
			token: Joi.string().required(),
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
			userId: Joi.string().required()
		}).validate(data),

	userId: data =>
		Joi.object({
			userId: Joi.string().required()
		}).validate(data),

	getAll: data =>
		Joi.object({
			keyword: Joi.string().optional().allow("")
		}).validate(data),

	changeStatus: data =>
		Joi.object({
			userId: Joi.string().required(),
			newStatus: Joi.boolean().required()
		}).validate(data),

	addPoints: data =>
		Joi.object({
			userId: Joi.string().required(),
			points: Joi.number().required()
		}).validate(data)
};
