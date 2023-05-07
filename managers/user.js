const Model = require("../models/user");
const Payment = require("../models/payment");
const uuid = require("uuid").v4;
const mongoose = require("mongoose");

const Manager = {
  deleteAllAdmins: async () => {
    await Model.deleteMany({ type: "admin" });
    return true;
  },
  updateName: async (id, newName) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        name: newName,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  getAll: async (keyword, page, limit) => {
    let query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
      type: "user",
    };

    const skip = page * limit;
    const count = await Model.countDocuments(query);
    let t = await Model.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    return {
      count: count,
      results: t,
    };
  },

  getStrength: async () => await Model.countDocuments({ type: "user" }),
  getById: async (id) => {
    let user = await Model.findById(id);
    let payments = await Payment.find({ userId: id }).sort({ date: -1 });
    return { user, payments };
  },
  getByEmail: async (email) => {
    const t = await Model.findOne({ email: email });
    return t ? t : false;
  },
  getBasicInfo: async (id) => {
    const t = await Model.findById(id);
    return t ? t : false;
  },
  getBasicInfoToRefreshSession: async (id) => await Model.findById(id),
  create: async (t) => {
    let user = new Model(t);
    user = await user.save();
    return user ? user : false;
  },
  updatePassword: async (id, obj) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        password: obj.password,
      },
      {
        new: true,
      }
    );
    return t ? t : false;
  },
  updateBlockedStatus: async (id, newStatus) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        blocked: newStatus,
      },
      {
        new: true,
      }
    );
    return t ? t : false;
  },
  updateActiveStatus: async (id, newStatus) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        active: newStatus,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  setTempPassword: async (email) => {
    const tempPassword = uuid();
    await Model.findOneAndUpdate(
      { email: email },
      {
        tempPassword: tempPassword,
      },
      {
        new: true,
      }
    );

    return tempPassword;
  },
  getByTempPassword: async (token) => {
    return await Model.findOne({ tempPassword: token });
  },
  delete: async (id) => {
    let t = await Model.findByIdAndDelete(id);
    return t ? true : false;
  },
  addPoints1: async (id, currentPoints, points) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        points: parseFloat(currentPoints) + parseFloat(points),
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  addPoints: async (id, points) => {
    let user = await Model.findById(id);
    let t = await Model.findByIdAndUpdate(
      id,
      {
        points: parseFloat(user.points) + parseFloat(points),
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  subtractPoints: async (id, points) => {
    let user = await Model.findById(id);
    let t = await Model.findByIdAndUpdate(
      id,
      {
        points: parseFloat(user.points) - parseFloat(points),
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
};

module.exports = Manager;
