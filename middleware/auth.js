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
    req.user = decoded;
    next();
  }
  catch (ex) {
    let decodedToken = jwt.decode(token);
    res.status(401).send('Unauthorized Request');
  }
});





module.exports = router;
