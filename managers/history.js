const Model = require("../models/history");

const Manager = {
	create: async data => {
		let t = new Model(data);
		t = await t.save();
		return t ? t : false;
	},
	getByUserId: async (keyword, userId) => {
		let t = Model.find({ userId: userId, keyword: keyword });
		return t;
	}
};

module.exports = Manager;
