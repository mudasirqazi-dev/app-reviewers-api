const Model = require("../models/name");
const nameManager = require("../managers/name");

const Manager = {
  getAll: async (keyword) => {
    let names = await Model.aggregate([
      {
        $match: {
          name: { $regex: keyword, $options: "i" },
        },
      },
    ]);
    return names;
  },

  create: async (data) => {
    const alreadyExists = await Model.findOne({
      name: { $regex: data.name, $options: "i" },
    });
    if (alreadyExists) {
      throw new Error("An app with the provided name already exists.");
    }
    let t = new Model(data);
    t = await t.save();
    return t ? t : false;
  },

  createMany: async (arr) => {
    const data = await Model.insertMany(arr);
    return data ? data : false;
  },

  update: async (id, data) => {
    const alreadyExists = await Model.findOne({
      name: { $regex: data.name, $options: "i" },
    });
    if (alreadyExists) {
      throw new Error("An app with the provided name already exists.");
    }
    const t = await Model.findByIdAndUpdate(
      id,
      {
        name: data.name,
      },
      { new: true }
    );
    return t;
  },

  deleteById: async (id) => {
    let t = await Model.findByIdAndDelete(id);
    return t ? true : false;
  },
};

module.exports = Manager;
