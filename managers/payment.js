const Model = require("../models/payment");
const mongoose = require("mongoose");

const Manager = {
  getAll: async (keyword, from, to) => {
    console.log(keyword, from, to);
    let t = await Model.find({
      userName: { $regex: keyword, $options: "i" },
    })
      .where("date")
      .gte(from)
      .lte(to)
      .sort({ date: -1 });
    return t;
  },
  getByUserId: async (userId, keyword, from, to) => {
    let t = await Model.aggregate([
      {
        $match: {
          $and: [
            { userId: new mongoose.Types.ObjectId(userId) },
            { date: { $gte: new Date(from), $lte: new Date(to) } },
          ],
          $or: [
            { userName: { $regex: keyword, $options: "i" } },
            { btc: { $regex: keyword, $options: "i" } },
          ],
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);
    return t;
  },
  create: async (t) => {
    let pmt = new Model(t);
    pmt = await pmt.save();
    return pmt ? pmt : false;
  },
  getAllTimeSum: async () => {
    let t = await Model.find({});
    let sum = t.reduce((acc, obj) => acc + obj.amount, 0);
    return sum ? sum : 0;
  },
};

module.exports = Manager;
