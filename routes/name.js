const nameValidations = require("../validations/name");
const getErrorDetails = require("../utils/error-details");
const admin = require("../middlewares/admin");
const router = require("express").Router();
const nameManager = require("../managers/name");

router.post(`/all`, admin, async (req, res) => {
  try {
    const keyword = req.body.keyword || "";
    const names = await nameManager.getAll(keyword);
    return res.status(200).send(names);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/", admin, async (req, res) => {
  try {
    const error = nameValidations.update(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const result = await nameManager.create(req.body);
    return res.status(200).send(result);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/many", admin, async (req, res) => {
  try {
    const error = nameValidations.createMany(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const newItems = [];
    const body = req.body;
    const names = await nameManager.getAll("");
    for (let i = 0; i < body.length; i++) {
      let current = body[i];
      let idx = names.findIndex(
        (k) => k.name.toLowerCase() === current.name.toLowerCase()
      );
      if (idx === -1) {
        let idx2 = newItems.findIndex(
          (f) => f.name.toLowerCase() === current.name.toLowerCase()
        );
        if (idx2 === -1) {
          newItems.push(current);
        }
      }
    }
    const result = await nameManager.createMany(newItems);
    return res.status(200).send({ saved: result.length });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.put("/:id", admin, async (req, res) => {
  try {
    const error = nameValidations.update(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const result = await nameManager.update(req.params.id, req.body);
    return res.status(200).send(result);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const error = nameValidations.id(req.params).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const result = await nameManager.deleteById(req.params.id);
    return res.status(200).send(result);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
