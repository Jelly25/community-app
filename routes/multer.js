// 引入express框架
const express = require('express');
// 引入multer文件上传
const multer = require('multer');
// 引入fs核心模块
const fs = require('fs');
// 引入path核心模块
const path = require('path');

// 创建路由
const router = express.Router();

// 1.上传头像
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/userAvatar/')
    //文件保存路径
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + '-' + file.originalname)
    //存储文件名
  }
})
let upload = multer({ storage: storage });
router.post('/uploadavatar', upload.single('file'), (req, res, next) => {
  res.status(200).json({
    err_code: 0,
    msg: '上传成功',
    data: req.file
  })
})

// 导出路由对象
module.exports = router;