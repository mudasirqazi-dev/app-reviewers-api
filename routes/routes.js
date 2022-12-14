const express = require('express');
const error = require('../middleware/error');
const users = require('../app/controllers/users');
const apps = require('../app/controllers/apps');
const sms = require('../app/controllers/sms');
const account = require('../app/controllers/userAccount');
const cost = require('../app/controllers/cost');
const path = require("path");
const {
	stat
} = require('fs');

module.exports = function (app) {
	app.use(express.json());
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,key ,Accept-Encoding, Accept-Language ,Origin');
		next();
	});
	app.use('/api/users', users);
	app.use('/api/apps', apps);
	app.use('/api/sms', sms);
	app.use('/api/account', account);
	app.use('/api/cost' , cost);
	app.use(error);

}