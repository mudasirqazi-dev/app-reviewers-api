require('dotenv').config();
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const saltRounds = 10;
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    contact: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
    lastLoginDate: {
        type: Date,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    forgotPasswordCode: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = Jwt.sign({
        _id: this._id,
        role: this.role,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    }, process.env.JwtPrivate_Key, {
        expiresIn: '2h'
    });
    return token;
}



userSchema.methods.generateForgetLink = function () {
    const token = Jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        role: this.role
    }, process.env.JwtPrivate_Key, {
        expiresIn: '2h'
    });
    return token;
}

//hash user password before saving into database
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        firstName: Joi.string().min(1).max(500).required(),
        lastName: Joi.string().min(1).max(500).required(),
        email: Joi.string().email().min(1).max(500).required(),
        password: Joi.string().min(1).max(200).required(),
        contact: Joi.string().min(1).max(200).required(),
    };
    return Joi.validate(user, schema);
}


exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;