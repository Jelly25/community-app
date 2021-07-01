// 导入express框架
const express = require('express');
// 导入用户数据集合
const User = require('../models/user');

// 创建路由
const router = express.Router();

// 存放聊天记录
router.post('/chatHis', (req, res, next) => {
  let { from, to, time, message } = req.body;
  User.updateOne({ 'friends.friendId': to, '_id': from }, { $push: { "friends.$.chatHis": { "message": message, "time": time, "id": from } } }, { new: true }, (err, docs) => {
    if (err) {
      next()
    }
    User.updateOne({ 'friends.friendId': from, '_id': to }, { $push: { "friends.$.chatHis": { "message": message, "time": time, "id": from } } }, { new: true }, (err, docs) => {
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
})

// 获取聊天记录
router.get('/getChatHis', (req, res, next) => {
  User.find({ 'friends.friendId': req.query.to, '_id': req.query.from }, { "friends": { $elemMatch: { "friendId": req.query.to } } }, (err, docs) => {
    if (err) {
      next()
    }
    if (docs.length === 0) {
      res.json({
        err_code: 1,
        msg: '该用户不存在'
      })
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success',
      data: docs[0].friends[0].chatHis
    })
  })
})

module.exports = router