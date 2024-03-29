const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const userManager = require("../managers/user");
const paymentManager = require("../managers/payment");
const searchManager = require("../managers/search");
const appManager = require("../managers/app");
const moment = require("moment");
const statsManager = require("../managers/stats");

router.get(`/`, admin, async (req, res) => {
  try {
    const payments = await paymentManager.getAllTimeSum();
    const users = await userManager.getStrength();
    const apps = await appManager.getStrength();
    const searches = await searchManager.getStrength();
    return res.status(200).send({ payments, users, apps, searches });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post(`/sales`, admin, async (req, res) => {
  try {
    const month = req.body.month || moment().month();
    const year = req.body.year || moment().year();
    const interval = req.body.interval || "daily";

    let t = await statsManager.getSales(month, year, interval);

    return res.status(200).send(t);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post(`/searches`, admin, async (req, res) => {
  try {
    const month = req.body.month || moment().month();
    const year = req.body.year || moment().year();
    const interval = req.body.interval || "daily";

    let t = await statsManager.getSearches(month, year, interval);

    return res.status(200).send(t);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post(`/user`, auth, async (req, res) => {
  try {
    const payments = await paymentManager.getSumById(req.tokenData?.userId);
    const searches = await searchManager.getStrengthById(req.tokenData?.userId);
    return res.status(200).send({ payments, searches });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post(`/user/payments`, auth, async (req, res) => {
  try {
    const userId = req.tokenData.userId || "";
    const month = req.body.month || moment().month();
    const year = req.body.year || moment().year();
    const interval = req.body.interval || "daily";
    let t = await statsManager.getUserPayments(userId, month, year, interval);

    return res.status(200).send(t);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post(`/user/searches`, auth, async (req, res) => {
  try {
    const userId = req.tokenData.userId || "";
    const month = req.body.month || moment().month();
    const year = req.body.year || moment().year();
    const interval = req.body.interval || "daily";

    let t = await statsManager.getUserSearches(userId, month, year, interval);
    return res.status(200).send(t);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
