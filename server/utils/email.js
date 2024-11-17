const nodemailer = require("nodemailer");

const MAIL_DETAILS = {
  service: "<MailService>",
  auth: {
    user: "<ToEmail>",
    pass: "Password",
  },
}
const transporter = nodemailer.createTransport(MAIL_DETAILS);

module.exports = {
  sendOTP: function(otp, userEmail) {
    const mailOptions = {
      from: "noreply@bookbuddy.com",
      to: userEmail,
      subject: "OTP for password reset",
      text: "Plain text content",
      html: `Here is the OTP for password reset: <b>${otp}</b>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};
