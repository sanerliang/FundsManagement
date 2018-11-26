const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    type: {
        type: String
    },
    describe: {
        type: String
    },
    income: {
        type: String,
        required: true
    },
    expend: {
        type: String,
        required: true
    },
    cash: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("profiles", ProfileSchema);