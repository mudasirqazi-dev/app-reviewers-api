const Model = require("../models/app");

const Manager = {
	getAll: async keyword => {
		return await Model.find({
			app: { $regex: keyword, $options: "i" }
		}).select({ username: 1 });
	},
	getAllDetails: async keyword => {
		return await Model.find({
			app: { $regex: keyword, $options: "i" }
		});
	}
};

module.exports = Manager;
