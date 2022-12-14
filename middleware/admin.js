const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(function (req, res, next) {
  let token = req.header('Authorization');
  let tok = (req.params.access_token) || (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.header['Authorization'];
  if (!token && tok)
    token = tok
  try {
    const decoded = jwt.verify(token, process.env.JwtPrivate_Key);
    if (decoded.role == 'superAdmin') {
      req.user = decoded;
    } else {
      return
    }

    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
});

module.exports = router;
