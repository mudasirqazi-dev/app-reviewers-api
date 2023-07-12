const appValidations = require("../validations/app");
const getErrorDetails = require("../utils/error-details");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const appManager = require("../managers/app");
const searchManager = require("../managers/search");
const userManager = require("../managers/user");
const historyManager = require("../managers/history");
const settingManager = require("../managers/setting");
const moment = require("moment");

const getContact = (user) => {
  let keys = Object.keys(user);
  let key = "phone_0";
  let result = startsWith(keys, key);
  let index = keys?.findIndex((data) => data == result);
  let value = Object.values(user)[index];
  let content = value.split(";");
  return content[0];
};

const getContacts = (user) => {
  let numbers = [];
  let keys = Object.keys(user);
  let key = "phone_";
  let matchingKeys = startsWith(keys, key);
  for (let i = 0; i < matchingKeys.length; i++) {
    let matchingKey = matchingKeys[i];
    let value = user[matchingKey];
    let values = value.split(";");
    numbers.push({
      phone: values[0],
      firstname: values[1],
      surname: values[2],
    });
  }
  return numbers;
};

const startsWith = (array, key) => {
  const matcher = new RegExp(`^${key}`, "g");
  return array.filter((word) => word.match(matcher));
};

router.post("/", auth, async (req, res) => {
  try {
    const error = appValidations.search(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const keyword = req.body.keyword || [];
    const userId = req.tokenData.userId;
    const list = [];
    for (let i = 0; i < keyword.length; i++) {
      let _keyword = keyword[i];
      const some = await appManager.getAll(_keyword);
      list.push(...some);
    }
    const _list = [];
    for (let i = 0; i < list.length; i++) {
      let t = list[i]._doc;
      let contacts = getContacts(t);
      _list.push({
        username: t.username,
        app: t.app,
        contacts: contacts?.length || 0,
        from: t.from,
        datetime: t.datetime,
      });
    }

    // const history = await historyManager.getByUserId(
    // 	userId,
    // 	keyword.join(";"),
    // 	"",
    // 	""
    // );

    let history = [];
    for (let i = 0; i < keyword.length; i++) {
      let _keyword = keyword[i];
      let _history = await historyManager.getByUserId(userId, _keyword, "", "");
      history.push(..._history);
    }

    // add search record
    const addSearchRecord = req.body.addSearchRecord || true;
    if (addSearchRecord) {
      await searchManager.create({
        userId: userId,
        userName: req.body.userName,
        keyword: keyword.join(";"),
        cost: req.body.totalCost || 0,
        type: "Free",
        results: list?.length || 0,
        date: moment().format(),
      });
    }

    return res.status(200).send({ list: _list, history });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/details", auth, async (req, res) => {
  try {
    const error = appValidations.details(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const selectedUsersOriginal = req.body.selectedUsers;
    const selectedUsers = selectedUsersOriginal.map((k) => k.username);
    const settings = await settingManager.get();
    const cost = settings?.cost;
    const totalCost =
      cost * selectedUsersOriginal.reduce((a, b) => a + b.contacts, 0);

    const user = await userManager.getBasicInfo(req.tokenData.userId);
    if (user?.points < totalCost)
      return res
        .status(400)
        .send(`Insufficient balance. You need atleast ${totalCost} credits.`);

    const keyword = req.body.keyword || [];

    const list = [];
    for (let i = 0; i < keyword.length; i++) {
      let _keyword = keyword[i];
      const some = await appManager.getAllDetails2(_keyword, selectedUsers);
      list.push(...some);
    }

    // deduct points
    await userManager.subtractPoints(req.tokenData.userId, totalCost);

    // add search record
    await searchManager.create({
      userId: req.tokenData.userId,
      userName: user?.name,
      keyword: keyword.join(";"),
      cost: totalCost || 0,
      type: "Paid",
      results: list?.length || 0,
      date: moment().format(),
    });

    const _list = [];
    for (let i = 0; i < list.length; i++) {
      let t = list[i]._doc;
      _list.push({
        username: t.username,
        app: t.app,
        country: t.country,
        contacts: getContacts(t),
        from: t.from,
        datetime: t.datetime,
      });
    }

    // user's search history
    let t = await historyManager.create({
      userId: req.tokenData.userId,
      cost: totalCost,
      keyword: keyword.join(";"),
      count: _list?.length,
      results: _list,
      date: moment().format(),
    });

    return res.status(200).send(_list);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
