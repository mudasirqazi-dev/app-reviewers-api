const auth = require("../middlewares/auth");
const router = require("express").Router();
const historyManager = require("../managers/history");

router.post(`/`, auth, async (req, res) => {
  try {
    const userId = req.tokenData.userId;
    const keyword = req.body.keyword;
    const results = await historyManager.getByUserId(keyword, userId);
    return res.status(200).send(results);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post(`/user`, auth, async (req, res) => {
  try {
    const userId = req.tokenData.userId || "";
    const keyword = req.body.keyword || "";
    const from = req.body.from || "";
    const to = req.body.to || "";
    const names = await historyManager.getByUserId(userId, keyword, from, to);
    return res.status(200).send(names);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
