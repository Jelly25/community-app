// 导入express框架
const express = require('express');
// 引入评论和发布内容数据集合
const Comment = require('../models/comment');

// 创建路由
const router = express.Router();

// 1.用户发布内容
router.post('/community/publish', (req, res, next) => {
  // 将信息保存到数据库
  new Comment(req.body).save((err, docs) => {
    if (err) {
      next();
    }
    // 保存成功，返回响应
    res.status(200).json({
      err_code: 0,
      message: '发布成功',
    })
  })
})

// 2.查询所有发布内容
router.get('/community/publishcon', (req, res, next) => {
  Comment.find({}, (err, docs) => {
    if (err) {
      next();
    }
    res.status(200).json({
      err_code: 0,
      msg: '查询成功',
      data: docs
    })
  })
})

// 3.为文章添加评论
router.post('/community/updateComments', (req, res, next) => {
  let { id, comments } = req.body;
  Comment.findByIdAndUpdate(id, {
    '$push': {
      comments: comments
    }
  }, { new: true }, (err, docs) => {
    if (err) {
      next();
    }
    res.json({
      err_code: 0,
      msg: '发表成功',
      data: docs.comments
    })
  })
})

// 4.根据id查询所有评论
router.get('/community/comments', (req, res, next) => {
  Comment.findById(req.query[0], (err, docs) => {
    if (err) {
      next();
    }
    res.status(200).json({
      err_code: 0,
      msg: '查询成功',
      data: docs.comments
    })
  })
})

// 5.根据id添加喜欢
router.get('/community/prefer', (req, res, next) => {
  let { id, prefer } = req.query;
  Comment.findByIdAndUpdate(id, { prefer: prefer }, { new: true }, (err, docs) => {
    if (err) {
      next();
    }
    res.status(200).json({
      err_code: 0,
      msg: '更新成功',
      data: docs
    })
  })
})

// 6.查询用户被点赞数
router.get('/userpraiseNum', (req, res, next) => {
  Comment.find({ userid: req.query.userid }, (err, docs) => {
    if (err) {
      next()
    }
    let praiseNum = 0;
    docs.forEach(ele => {
      praiseNum += ele.prefer
    })
    res.status(200).json({
      err_code: 0,
      msg: 'success',
      data: praiseNum
    })
  })
})

// 7.查询用户文章作品
router.get('/essayprods', (req, res, next) => {
  Comment.find({ userid: req.query.userid }, (err, docs) => {
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
// 导出路由对象
module.exports = router;