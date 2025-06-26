const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
    email: {type: String,required: true,unique: true},
    otp: {type: String,required: true},
    createdAt: {type: Date,default: Date.now, expires: '10m' // OTP will expire after 5 minutes
    }
});
const Otp = new mongoose.model("Otp", otpSchema);

module.exports = Otp;