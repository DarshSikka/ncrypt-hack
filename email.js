const nodemailer = require("nodemailer");
require("dotenv").config();
const send = async ({to, html, subject}) => {
  const transport = nodemailer.createTransport({
    service: "mailgun",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
    await transport.sendMail({
    name: "mailgun.com",
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html,
  });
};
module.exports = send;