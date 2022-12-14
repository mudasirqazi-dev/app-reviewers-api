const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.details[0].message });
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(200).send({ success: false, message: 'Invalid email or password.' });
  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(200).send({ success: false, message: 'Invalid  password.' });
  const token = user.generateAuthToken();
  res.send(token);
});


router.post('/admin', async (req, res) => {
  let email = req.body.email.replace(/\s/g, '');
  email = email.toLowerCase();
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.details[0].message });
    return;
  }
  const user = await User.findOne({ email: email, role: 'superAdmin' });
  if (!user) return res.json({ success: false, message: 'Invalid User!' });
  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) return res.status(200).send({ success: false, message: 'Invalid  password.' });
  if (user.isDeleted == true) return res.json({ success: false, message: 'your account is blocked please contact with admin' });
  const token = user.generateAuthToken();
  await user.updateOne(
    {
      $set: {
        "lastLoginDate": Date.now(),
      }, function(error) {
        return error
      }
    }).then(data => {
      res.status(200).json({ success: true, data: token });
    })
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
