const admin = require("../middlewares/admin");
const router = require("express").Router();
const userManager = require("../managers/user");
const paymentManager = require("../managers/payment");
const searchManager = require("../managers/search");

router.get(`/`, admin, async (req, res) => {
  try {
    const payments = await paymentManager.getAllTimeSum();
    const users = await userManager.getStrength("");
    const searches = await searchManager.getStrength("", "", "");

    return res.status(200).send({ payments, users, searches });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
