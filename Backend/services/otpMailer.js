const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


const otpMailerBot = async (email, strOTP) => {
    const botOtp = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }})

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${strOTP}`
  }

  const send = await botOtp.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send OTP email");
    } else {
      console.log("Email sent: " + info.response);
}})};

module.exports = otpMailerBot;