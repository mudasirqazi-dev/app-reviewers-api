const Model = require("../models/app");

const Manager = {
  getAll: async (keyword) => {
    return await Model.find({
      app: { $regex: keyword, $options: "i" },
    }).select({ username: 1 });
  },
  getAllDetails: async (keyword) => {
    return await Model.find({
      app: { $regex: keyword, $options: "i" },
    });
  },
  getStrength: async () => await Model.countDocuments(),
};

module.exports = Manager;
