const Model = require("../models/search");

const Manager = {
  create: async (data) => {
    let t = new Model(data);
    t = await t.save();
    return t ? t : false;
  },

  //   getAll: async (keywords, from, to) => {
  //     let t = await Model.find({
  //       $or: [
  //         { userName: { $regex: keywords, $options: "i" } },
  //         { keyword: { $regex: keywords, $options: "i" } },
  //       ],
  //     })
  //       .where("date")
  //       .gte(from)
  //       .lte(to);
  //     return t;
  //   },

  getAll: async (keywords, from, to) => {
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

    let t = await Model.find(query);
    return t;
  },
};

module.exports = Manager;
