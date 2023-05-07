const Model = require("../models/search");

const Manager = {
  create: async (data) => {
    let t = new Model(data);
    t = await t.save();
    return t ? t : false;
  },

  // getAll: async (keywords, from, to) => {
  //   let query = {
  //     $or: [
  //       { userName: { $regex: keywords, $options: "i" } },
  //       { keyword: { $regex: keywords, $options: "i" } },
  //     ],
  //   };

  //   if (from !== "" && to !== "") {
  //     query.date = {
  //       $gte: from,
  //       $lte: to,
  //     };
  //   }

  //   let t = await Model.find(query).sort({ date: -1 });
  //   return t;
  // },

  getAll: async (keywords, from, to, page, limit) => {
    let query = {
      $or: [
        { userName: { $regex: keywords, $options: "i" } },
        { keyword: { $regex: keywords, $options: "i" } },
      ],
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

  getStrength: async () => await Model.countDocuments({}),

  getStrengthById: async (userId) =>
    await Model.countDocuments({ userId: userId }),
};

module.exports = Manager;
