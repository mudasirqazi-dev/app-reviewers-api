require('dotenv').config();
const Joi = require('joi');
const mongoose = require('mongoose');
const costSchema = new mongoose.Schema({

    userId: {
        type: String,
    },
    cost: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
    }
});

const Cost = mongoose.model('cost', costSchema);

function validateCost(Cost) {
    const schema = {
        userId: Joi.string().min(1).max(500).required(),
        cost: Joi.number().required()
    };
    return Joi.validate(Cost, schema);
}


exports.costSchema = costSchema;
exports.Cost = Cost;
exports.validate = validateCost;