const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: String,
    otpCode: Number,
    expireIn: Number
},{
    timestamps: true
})

module.exports = mongoose.model("otp",otpSchema);