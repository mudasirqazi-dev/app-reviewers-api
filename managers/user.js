const Model = require("../models/user");
const Payment = require("../models/payment");
const uuid = require("uuid").v4;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Constants = require("../utils/constants");
const paymentManager = require("../managers/payment");

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
  getNpos: async (category) => {
    if (category && category.length > 0) {
      return await Model.find({
        type: "npo",
        active: true,
        category: category,
      });
    }

    return await Model.find({
      type: "npo",
      active: true,
    });
  },
  getNposAdmin: async (keyword) => {
    return await Model.find({
      type: "npo",
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });
  },
  getNposSupportedByUserId: async (userId, keyword) => {
    let npos = await Payment.aggregate([
      {
        $match: {
          donarId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: `users`,
          localField: `npoId`,
          foreignField: `_id`,
          as: `npoId`,
        },
      },
    ]).unwind("npoId");
    npos = npos.map((k) => k.npoId);
    return npos;
  },
  getDonarsByNpoId: async (npoId) => {
    let t = await Payment.aggregate([
      {
        $match: { npoId: new ObjectId(npoId) },
      },
      {
        $lookup: {
          from: `users`,
          localField: `donarId`,
          foreignField: `_id`,
          as: `donar`,
        },
      },
    ]).unwind("donar");
    return t;
  },
  getAll: async (keyword) => {
    let users = await Model.aggregate([
      {
        $match: {
          type: "user",
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
          ],
        },
      },
      // {
      // 	$lookup: {
      // 		from: `payments`,
      // 		localField: `_id`,
      // 		foreignField: `userId`,
      // 		as: `payments`
      // 	}
      // }
    ]);
    return users;
  },
  getTotalUsers: async () => {
    let users = await Model.find({});
    console.log(users.length);
    return users.length.toString();
  },
  getTop: async (category) => {
    let users = await Model.aggregate([
      {
        $match: {
          type: "npo",
          category: category,
          active: true,
        },
      },
      {
        $lookup: {
          from: `likes`,
          localField: `_id`,
          foreignField: `npoId`,
          as: `likes`,
        },
      },
      { $limit: Constants.TOP_NPOS_COUNT },
    ]);

    return users;
  },
  getAllDonars: async (keyword) => {
    return await Model.find({
      type: "user",
      active: true,
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });
  },
  getAllDonarsAdmin: async (keyword) => {
    return await Model.find({
      type: "user",
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });
  },
  getTopDonarsByNpoId: async (npoId) => {
    let t = await Payment.aggregate([
      {
        $match: { npoId: new ObjectId(npoId) },
      },
      {
        $lookup: {
          from: `users`,
          localField: `donarId`,
          foreignField: `_id`,
          as: `donar`,
        },
      },
      { $limit: Constants.TOP_DONARS_COUNT },
    ]).unwind("donar");

    return t;
  },
  getById: async (id) => {
    let user = await Model.findById(id);
    let payments = await Payment.find({ userId: id });
    return { user, payments };
  },
  getDetailsById: async (id) => {},

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
  updateUserBasic: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        name: data.name,
        email: data.email,
        passowrd: data.passowrd,
        profession: data.profession,
        dob: data.dob,
        hobby: data.hobby,
        mission: data.mission,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateNpoBasic: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        name: data.name,
        category: data.category,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateNpoDetails: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        details: data.details,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateUserAbout: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        about: data.about,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateNpoAbout: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        about: data.about,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateNpoPaypal: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        paypal: data.paypal,
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
  updatePicture: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        fileUrl: data.fileUrl,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateNotificationsStatus: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        notifications: data.status,
        notificationsToken: data.token,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updateShowDonationsOnProfileStatus: async (id, status) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        showDonationsOnProfile: status,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
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
