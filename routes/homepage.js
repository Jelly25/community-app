// 导入express框架
const express = require('express');
// 导入multer
const multer = require('multer');
// 导入homepage集合
const Homepage = require('../models/homepage');
// 导入slide集合
const Slidelist = require('../models/slidelist')

// 创建路由
const router = express.Router();

// 1.轮播图
router.get('/homepage/slide', (req, res, next) => {
  Slidelist.find({}, (err, docs) => {
    if (err) {
      next();
    }
    res.json({
      err_code: 0,
      msg: 'success',
      data: docs
    })
  })
})

// 2.首页展示
router.get('/homepage', (req, res, next) => {
  Homepage.find((err, docs) => {
    if (err) {
      next()
    }
    res.status(200).json({
      err_code: 0,
      msg: '请求成功',
      data: docs
    })
  })
})

// 3.发表作品
router.post('/homepage/prod', (req, res, next) => {
  new Homepage(req.body).save((err, docs) => {
    if (err) {
      next(err);
    }
    res.status(200).json({
      err_code: 0,
      msg: '上传成功',
      data: docs
    })
  })
})

// 4.上传图片
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/essayImg/')
    //文件保存路径
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + '-' + file.originalname)
    //存储文件名
  }
})
let upload = multer({ storage: storage });
router.post('/uploadImg', upload.single('file'), (req, res, next) => {
  res.status(200).json({
    err_code: 0,
    msg: '上传成功',
    data: req.file
  })
})

// 5.用户作品数
router.get('/userprodsNum', (req, res, next) => {
  Homepage.find({ userid: req.query.userid }, (err, docs) => {
    if (err) {
      next()
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success',
      data: docs.length
    })
  })
})

// 6.查询用户发表图片作品
router.get('/imgprods', (req, res, next) => {
  Homepage.find({ userid: req.query.userid }, (err, docs) => {
    if (err) {
      next()
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success',
      data: docs
    })
  })
})

// 导出路由
module.exports = router