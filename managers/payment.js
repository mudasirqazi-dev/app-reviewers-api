const Model = require("../models/payment");
const constants = require("../utils/constants");
const mongoose = require("mongoose");
const moment = require("moment");

const Manager = {
  getAll: async (keyword, from, to) => {
    let t = await Model.find({ userName: { $regex: keyword, $options: "i" } })
      .where("date")
      .gte(from)
      .lte(to);
    return t;
  },
  create: async (t) => {
    let pmt = new Model(t);
    pmt = await pmt.save();
    return pmt ? pmt : false;
  },
  getAllTimeSum: async () => {
    let t = await Model.find({});
    let sum = t.reduce((acc, obj) => acc + parseFloat(obj.amount), 0) || 0;
    return sum.toString();
  },
  getSumByDateRange: async (from, to) => {
    let t = await Model.find({}).where("date").gte(from).lte(to);
    let sum = t.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    return sum;
  },
  getTotal: async (donarId, from, to) => {
    const mine = await Model.aggregate([
      {
        $match: {
          $and: [
            { donarId: new mongoose.Types.ObjectId(donarId) },
            { date: { $gte: new Date(from), $lte: new Date(to) } },
          ],
        },
      },
    ]);

    const referal = await Model.aggregate([
      {
        $match: {
          $and: [
            { refUserId: donarId },
            { date: { $gte: new Date(from), $lte: new Date(to) } },
          ],
        },
      },
    ]);

    let sumMine =
      mine.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    let sumReferal =
      referal.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    return { sumMine, sumReferal };
  },
  getGrandTotal: async (donarId) => {
    const mine = await Model.aggregate([
      {
        $match: { donarId: new mongoose.Types.ObjectId(donarId) },
      },
    ]);
    const r1 = await Model.aggregate([
      {
        $match: { refUserId: donarId },
      },
    ]);

    let sumMine =
      mine.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    let sumReferal =
      r1.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    return { sumMine, sumReferal };
  },
  getProjectTotal: async (projectId, from, to) => {
    const t = await Model.find({ projectId: projectId })
      .where("date")
      .gte(from)
      .lte(to);
    let sum = t.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    return sum;
  },
  getProjectAllTimeTotal: async (projectId) => {
    const t = await Model.find({ projectId: projectId });
    let sum = t.reduce((acc, obj) => acc + parseFloat(obj.total), 0) || 0;
    return sum;
  },
  getReferredByUserId: async (donarId) => {
    const referal = await Model.aggregate([
      {
        $match: { refUserId: donarId },
      },
      {
        $lookup: {
          from: "users",
          localField: "donarId",
          foreignField: "_id",
          as: "donarId",
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          amount: 1,
          "donarId.name": 1,
          "donarId.fileUrl": 1,
          "projectId.title": 1,
        },
      },
      {
        $unwind: {
          path: "$donarId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$projectId",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return referal;
  },
  getByUserId: async (donarId) => {
    let t = await Model.aggregate([
      {
        $match: { donarId: new mongoose.Types.ObjectId(donarId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "donarId",
          foreignField: "_id",
          as: "donarId",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "npoId",
          foreignField: "_id",
          as: "npoId",
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: {
          path: "$donarId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$npoId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$projectId",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return t;
  },
  getPaymentCountByUserId: async (donarId) => {
    let t = await Model.find({ donarId: donarId }).populate("donarId");
    return t.length;
  },
  getByNpoId: async (npoId) => {
    let t = await Model.find({ npoId: npoId })
      .populate("donarId")
      .populate("npoId")
      .populate("projectId")
      .sort({
        date: -1,
      });
    return t;
  },
  changeStatusToWithdrawn: async (npoId) => {
    let t = await Model.find({ npoId: npoId, status: "available" });
    let _ids = t.map((k) => k._id);
    let result = await Model.updateMany(
      { _id: { $in: _ids } },
      { status: "withdrawn" },
      { multi: true }
    );
    return result;
  },
  getAvailableFundsByNpoId: async (npoId) => {
    let t = await Model.find({ npoId: npoId, status: "available" });
    let sum = t.reduce((acc, obj) => acc + parseFloat(obj.amount), 0) || 0;
    return sum;
  },
  getWithdrawnFundsByNpoId: async (npoId) => {
    let t = await Model.find({ npoId: npoId, status: "withdrawn" });
    let sum = t.reduce((acc, obj) => acc + parseFloat(obj.amount), 0) || 0;
    return sum;
  },
  getPaginatedByNpoId: async (npoId, page) => {
    const limit = constants.PAGINATION_PAGE_SIZE;
    let t = await Model.aggregate([
      {
        $match: { npoId: new mongoose.Types.ObjectId(npoId) },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: {
          path: "$projectId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $skip: limit * page,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          date: 1,
          amount: 1,
          status: 1,
          "projectId.title": 1,
        },
      },
    ]);

    return t;
  },
  getPaginatedByDonarId: async (donarId, page) => {
    const limit = constants.PAGINATION_PAGE_SIZE;
    let t = await Model.aggregate([
      {
        $match: { donarId: new mongoose.Types.ObjectId(donarId) },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: {
          path: "$projectId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $skip: limit * page,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          date: 1,
          total: 1,
          type: 1,
          "projectId.title": 1,
        },
      },
    ]);

    return t;
  },
};

module.exports = Manager;
