const Model = require("../models/history");

const Manager = {
  create: async (data) => {
    let t = new Model(data);
    t = await t.save();
    return t ? t : false;
  },

  getByUserId: async (userId, keyword, from, to) => {
    let query = {
      keyword: { $regex: keyword, $options: "i" },
      userId: userId,
    };

    if (from !== "" && to !== "") {
      query.date = {
        $gte: from,
        $lte: to,
      };
    }

    let t = await Model.find(query).sort({ date: -1 });
    return t;
  },
};

module.exports = Manager;
