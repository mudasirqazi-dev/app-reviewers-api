const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const userManager = require("../managers/user");
const paymentManager = require("../managers/payment");
const searchManager = require("../managers/search");
const userValidations = require("../validations/user");
const getErrorDetails = require("../utils/error-details");
const moment = require("moment");

router.post(`/all`, admin, async (req, res) => {
  try {
    const keyword = req.body.keyword || "";
    const from = req.body.from || "";
    const to = req.body.to || "";
    const names = await paymentManager.getAll(keyword, from, to);
    return res.status(200).send(names);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.get(`/`, admin, async (req, res) => {
  try {
    const sum = await paymentManager.getAllTimeSum();
    return res.status(200).send(sum);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

// router.get(`/:userId`, auth, async (req, res) => {
//   try {
//     let userId = req.params.userId;
//     const error = userValidations.userId({ userId }).error;
//     if (error) return res.status(400).send(getErrorDetails(error));

//     const user = await paymentManager.getByUserId({ userId });
//     return res.status(200).send(user);
//   } catch (ex) {
//     return res.status(500).send(ex.message);
//   }
// });

router.post(`/user`, auth, async (req, res) => {
  try {
    let userId = req.body.userId;
    const error = userValidations.userId({ userId }).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const keyword = req.body.keyword || "";
    const from = req.body.from || "";
    const to = req.body.to || "";

    const user = await paymentManager.getByUserId(userId, keyword, from, to);
    return res.status(200).send(user);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (data?.status !== "paid")
      return res.status(400).send(`Payment not completed.`);

    const email = data?.buyerFields?.buyerEmail || false;
    if (!email)
      return res.status(400).send(`Buyer email address not provided.`);

    let user = await userManager.getByEmail(email);
    if (!user)
      return res
        .status(400)
        .send(`User does not exist with this email address.`);

    await paymentManager.create({
      userId: user?._id,
      amount: data?.price,
      currency: data?.currency,
      btc: data?.btcPaid,
      date: moment().format(),
      details: data,
    });
    await userManager.addPoints1(user?._id, user?.points, data?.price);

    return res.sendStatus(200);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
