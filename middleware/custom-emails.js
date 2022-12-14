const _ = require('lodash');
const auth = require('./auth');
const express = require('express');
const router = express.Router();
const ut = require('./utility');
const Email = require('./email');
const Encrypt = require('./Encrypt&Decrypt');
var replaceall = require("replaceall");
var uuid = require('uuid');
const {
    User,
    validate
} = require('../app/models/user');
class EmailManager {

    async verifyEmail(data) {
        try {
            let id = data._id.toString();
            let user_id = await Encrypt.encrypt(id);
            let url = `${process.env.email_verify}token=${user_id}`
            let html = await ut.readTemplate(`verify`);
            html = replaceall(`{{url}}`, url, html);
            Email.sendEmail({
                to: data.email,
                subject: 'Review App - Verify Your Account 🔑',
                text: 'Verify Your Account',
                html: html
            }).then(result => {})
            return true
        } catch (ex) {
            console.log('ex message' + ex.message);
            return false;

            // return res.status(500).send(ex.message);
        }

    }



    //forgot password email
    async forgotPassword(data) {
        try {
            let html = await ut.readTemplate(`forgot-password`);
            html = replaceall(`{{forgotLink}}`, data.link, html);
            Email.sendEmail({
                to: data.email,
                subject: 'Review App - Reset Your Password',
                text: 'Reset Your Password',
                html: html
            }).then(result => {
                return true
            })
        } catch (ex) {
            console.log('ex ' + ex.message)
            // return res.status(500).send(ex.message);
        }
    }


}



module.exports = new EmailManager();