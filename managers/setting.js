const Model = require("../models/setting");

const Manager = {
	create: async data => {
		let t = new Model(data);
		t = await t.save();
		return t ? t : false;
	},

	get: async () => {
		const t = await Model.find({});
		return t.length >= 1
			? t[0]
			: {
					cost: 0.1,
					initialBalance: 10,
					buttons: "10; 30; 50",
					subscription: 100
			  };
	},

	delete: async () => await Model.deleteMany({}),

	update: async obj => {
		const record = await Manager.get();
		const t = await Model.findByIdAndUpdate(
			record._id,
			{
				cost: obj.cost,
				initialBalance: obj.initialBalance
			},
			{ new: true }
		);
		return t;
	},

	updateButtons: async obj => {
		const record = await Manager.get();
		const t = await Model.findByIdAndUpdate(
			record._id,
			{
				buttons: obj.buttons
			},
			{ new: true }
		);
		return t;
	},

	updateSubscription: async obj => {
		const record = await Manager.get();
		const t = await Model.findByIdAndUpdate(
			record._id,
			{
				subscription: obj.subscription
			},
			{ new: true }
		);
		return t;
	}
};

module.exports = Manager;
