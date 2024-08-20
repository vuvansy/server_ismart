const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    pool:true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "syvv819@gmail.com",
        pass: "mmfpnqkesfncjinq",
    },
});
module.exports = { transporter };

