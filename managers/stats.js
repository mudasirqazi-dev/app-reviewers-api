const PaymentModel = require("../models/payment");
const SearchModel = require("../models/search");
const moment = require("moment");

const Manager = {
	getSales: async (month, year, interval) => {
		if (interval === "daily")
			return await PaymentModel.aggregate([
				{
					$match: {
						date: {
							$gte: new Date(
								moment()
									.month(month)
									.year(year)
									.startOf("month")
							),
							$lte: new Date(
								moment().month(month).year(year).endOf("month")
							)
						}
					}
				},
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y-%m-%d", date: "$date" }
						},
						total: {
							$sum: "$amount"
						}
					}
				}
			]);

		if (interval === "monthly")
			return await PaymentModel.aggregate([
				{
					$match: {
						date: {
							$gte: new Date(moment().year(year).startOf("year")),
							$lte: new Date(moment().year(year).endOf("year"))
						}
					}
				},
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y-%m", date: "$date" }
						},
						total: {
							$sum: "$amount"
						}
					}
				}
			]);

		if (interval === "yearly")
			return await PaymentModel.aggregate([
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y", date: "$date" }
						},
						total: {
							$sum: "$amount"
						}
					}
				}
			]);
	},

	getSearches: async (month, year, interval) => {
		if (interval === "daily")
			return await SearchModel.aggregate([
				{
					$match: {
						date: {
							$gte: new Date(
								moment()
									.month(month)
									.year(year)
									.startOf("month")
							),
							$lte: new Date(
								moment().month(month).year(year).endOf("month")
							)
						}
					}
				},
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y-%m-%d", date: "$date" }
						},
						total: {
							$sum: 1
						}
					}
				}
			]);

		if (interval === "monthly")
			return await SearchModel.aggregate([
				{
					$match: {
						date: {
							$gte: new Date(moment().year(year).startOf("year")),
							$lte: new Date(moment().year(year).endOf("year"))
						}
					}
				},
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y-%m", date: "$date" }
						},
						total: {
							$sum: 1
						}
					}
				}
			]);

		if (interval === "yearly")
			return await SearchModel.aggregate([
				{
					$group: {
						_id: {
							$dateToString: { format: "%Y", date: "$date" }
						},
						total: {
							$sum: 1
						}
					}
				}
			]);
	}
};

module.exports = Manager;
