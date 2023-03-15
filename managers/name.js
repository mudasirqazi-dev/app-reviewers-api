const Model = require("../models/name");

const Manager = {
	create: async data => {
		let t = new Model(data);
		t = await t.save();
		return t ? t : false;
	},

	get: async () => {
		const t = await Model.find({});
		return t.length >= 1 ? t[0] : { names: "" };
	},

	delete: async () => await Model.deleteMany({}),

	update: async obj => {
		const record = await Manager.get();
		const t = await Model.findByIdAndUpdate(
			record._id,
			{
				names: obj.names
			},
			{ new: true }
		);
		return t;
	}
};

module.exports = Manager;
