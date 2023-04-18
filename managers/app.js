const Model = require("../models/app");

const Manager = {
	getAll: async keyword => {
		return await Model.find({
			app: { $regex: keyword, $options: "i" }
		}).select({ username: 1, app: 1 });
	},
	getAllDetails: async keyword => {
		return await Model.find({
			app: { $regex: keyword, $options: "i" }
		});
	},
	getAllDetails2: async (keyword, users) => {
		return await Model.find({
			app: { $regex: keyword, $options: "i" },
			username: { $in: users }
		});
	},
	getStrength: async () => await Model.countDocuments()
};

module.exports = Manager;
