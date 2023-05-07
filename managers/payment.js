const Model = require("../models/payment");
const mongoose = require("mongoose");

const Manager = {
  getAll: async (keyword, from, to, page, limit) => {
    let query = {
      userName: { $regex: keyword, $options: "i" },
    };

    if (from !== "" && to !== "") {
      query.date = {
        $gte: from,
        $lte: to,
      };
    }

    const skip = page * limit;
    const count = await Model.countDocuments(query);
    let t = await Model.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    return {
      count: count,
      results: t,
    };
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
  getSumById: async (userId) => {
    let t = await Model.find({ userId: userId });
    let sum = t.reduce((acc, obj) => acc + obj.amount, 0);
    return sum ? sum : 0;
  },
};

module.exports = Manager;
