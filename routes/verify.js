// 引入express框架
const express = require('express');
// 引入nodemailer邮箱验证
const nodemailer = require('nodemailer');

// 创建路由
const router = express.Router();

// 1.邮箱注册验证码
router.post('/emailverify', (req, res, next) => {
  let { email } = req.body;
  // 生成6位数的验证码
  let code = Math.random().toString(36).substr(4, 6);
  // 创建邮件传输
  let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 25,
    secureConnection: true,
    auth: {
      user: "18812165923@163.com",
      pass: 'YMDKIOUANCAGSUHY'
    }
  });
  // 邮件信息
  let mailOptions = {
    from: '"微社" <18812165923@163.com>',
    to: email,
    subject: '邮箱验证通知',
    text: '您正在通过邮箱注册微社账号,验证码是' + code + ',验证码在10分钟内有效,请妥善保管！'
  };
  // 发送邮件
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      next();
    }
    res.json({
      err_code: 0,
      msg: '发送成功',
      data: {
        verifycode: code
      }
    })
  })

})

// 导出路由对象
module.exports = router;