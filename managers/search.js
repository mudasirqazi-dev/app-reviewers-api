const Model = require("../models/search");

const Manager = {
	create: async data => {
		let t = new Model(data);
		t = await t.save();
		return t ? t : false;
	}
};

module.exports = Manager;
