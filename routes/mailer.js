var express = require("express");
var router = express.Router();

var { transporter } = require("../mailer/mailer-config");

router.post("/send-mail", async function(req, res, next){
    try{
      const {to, subject, content} = req.body;
  
      const mailOptions = {
        from: "abc <email address>",
        to: to,
        subject: subject,
        html: content
      };
      await sendMail.transporter.sendMail(mailOptions);
      res.json({ status: 1, message: "Gửi mail thành công"});
    }catch(err){
      res.json({ status: 0, message: "Gửi mail thất bại"});
    }
  });
  
  module.exports = router;