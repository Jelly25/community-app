// 导入express框架
const express = require('express');
// 导入jwt生成token
const jwt = require('jsonwebtoken');
// 导入md5加密
const md5 = require('blueimp-md5');
// 导入用户数据集合
const User = require('../models/user');

// 创建路由
const router = express.Router();

// 1.登录请求
router.post('/profile/login', (req, res, next) => {
  let { email, password } = req.body;
  User.findOne({
    email: email,
    password: md5(md5(password))
  }, (err, docs) => {
    if (err) {
      next();
    }
    if (!docs) {
      return res.status(200).json({
        err_code: 2,
        message: '该账号不存在'
      })
    }
    // 生成token
    var token = jwt.sign({
      data: String(docs._id),
    }, 'jelly_yly0613', {
      expiresIn: 60 * 60 * 3
    })
    // 返回数据
    res.json({
      err_code: 0,
      msg: '登录成功',
      data: {
        user: docs,
        token
      }
    })
  })
})

// 2.注册请求
router.post('/profile/register', (req, res, next) => {
  let { email, nickname } = req.body;
  User.findOne({
    $or: [
      { email: email },
      { nickname: nickname }
    ]
  }, (err, docs) => {
    if (err) {
      next();
    }
    if (docs) {
      return res.status(200).json({
        err_code: 2,
        message: '用户名或邮箱已存在'
      })
    }
    // 对密码进行加密
    req.body.password = md5(md5(req.body.password));
    // 添加到数据库
    new User(req.body).save((err, docs) => {
      if (err) {
        next();
      }
      res.status(200).json({
        err_code: 0,
        message: '注册成功',
        user: docs,
      })
    })
  })
})

// 3.修改个人信息
router.post('/profile/account', (req, res, next) => {
  let { id } = req.body;
  let { nickname, signature, gender, birthday, age, address, hobby, avatar, status } = req.body.form;
  User.findByIdAndUpdate(req.body.id, {
    nickname,
    signature,
    gender,
    birthday,
    age,
    address,
    hobby,
    avatar,
    status
  }, { new: true }, (err, docs) => {
    if (err) {
      next();
    }
    res.status(200).json({
      err_code: 0,
      msg: '修改成功',
      data: docs
    })
  })
})

// 4.关注
router.post('/user/follow', (req, res, next) => {
  User.updateOne({ "_id": req.body.id }, { $addToSet: { fans: { fansID: req.body.fansID } } }, (err, docs) => {
    if (err) {
      next();
    }
    if (docs.nModified === 0 && docs.n === 1) {
      res.status(200).json({
        err_code: 2,
        msg: 'already exist'
      })
      return false
    } else if (docs.nModified === 0 && docs.n === 0) {
      res.status(200).json({
        err_code: 3,
        msg: '用户不存在'
      })
      return false
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success'
    })
  })
})

// 5.取消关注
router.post('/user/cancelfollow', (req, res, next) => {
  User.updateOne({ "_id": req.body.id }, { $pull: { fans: { fansID: req.body.fansID } } }, (err, docs) => {
    if (err) {
      next()
    }
    if (docs.nModified === 0 && docs.n === 1) {
      res.status(200).json({
        err_code: 2,
        msg: 'already cancel'
      })
      return false
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success'
    })
  })
})

// 6.查询用户关注列表
router.get('/userfollowLists', (req, res, next) => {
  User.find({ "fans.fansID": req.query.id }, (err, docs) => {
    if (err) {
      next();
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success',
      data: docs
    })
  })
})

// 6.查看资料
router.get('/usermessage', (req, res, next) => {
  let id = req.query.userid;
  User.findById(id, (err, docs) => {
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

// 6.1请求查询
router.get('/friReq', (req, res, next) => {
  User.find({ 'frireq.reqId': req.query._id, '_id': req.query.userid }, { "frireq": { $elemMatch: { "reqId": req.query._id } } }, (err, docs) => {
    if (err) {
      next()
    }
    if (docs.length !== 0) {
      return res.json({
        err_code: 1
      })
    }
    res.json({
      err_code: 0
    })
  })
})

// 6.2.查询好友/请求入库
router.post('/judgeFriend', (req, res, next) => {
  // 好友列表查询
  User.find({ 'friends.friendId': req.body.fromId }, (err, docs) => {
    if (err) {
      next()
    }
    if (JSON.stringify(docs) !== '[]') {
      return res.status(200).json({
        err_code: 2
      })
    }
    // 请求入库
    User.updateOne({ "_id": req.body.toId }, { $addToSet: { frireq: { reqId: req.body.fromId, reqName: req.body.fromName, status: 0, reqMsg: req.body.fromMsg } } }, (err, docs) => {
      if (err) {
        next()
      }
      if (docs.nModified === 0 && docs.n === 1) {
        return res.json({
          err_code: 4,
          msg: '暂未处理您的好友请求,请耐心等待。'
        })
      } else if (docs.nModified === 0 && docs.n === 0) {
        return res.json({
          err_code: 5,
          msg: '拒绝了您的好友请求。'
        })
      }
      res.status(200).json({
        err_code: 0,
        msg: '已发送好友请求。'
      })
    })

  })
})

// 7.查询好友请求列表
router.get('/friendReqList', (req, res, next) => {
  User.find({ '_id': req.query.id }, (err, docs) => {
    if (err) {
      next()
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success',
      data: docs[0].frireq
    })
  })
})

// 8.添加好友
router.get('/addFriend', (req, res, next) => {
  User.updateOne({ "_id": req.query._id }, { $addToSet: { friends: { friendId: req.query.reqId, friendName: req.query.reqName } } }, (err, docs) => {
    if (err) {
      next()
    }
    if (docs.nModified === 0 && docs.n === 1) {
      return res.json({
        err_code: 2,
        msg: '已经存在'
      })
    } else if (docs.nModified === 0 && docs.n === 0) {
      return res.json({
        err_code: 1,
      })
    }
    User.updateOne({ "_id": req.query.reqId }, { $addToSet: { friends: { friendId: req.query._id, friendName: req.query.name } } }, (err, docs) => {
      if (err) {
        next()
      }
      User.updateOne({ "_id": req.query._id }, { $pull: { frireq: { reqId: req.query.reqId } } }, (err, docs) => {
        if (err) {
          next()
        }
        res.status(200).json({
          err_code: 0,
          msg: 'success'
        })
      })
    })
  })
})

// 8.删除好友请求
router.get('/rmFriReq', (req, res, next) => {
  User.updateOne({ "_id": req.query._id }, { $pull: { frireq: { reqId: req.query.reqId } } }, (err, docs) => {
    if (err) {
      next()
    }
    res.status(200).json({
      err_code: 0,
      msg: 'success'
    })
  })
})

// 9.查询好友列表
router.get('/friendList', (req, res, next) => {
  User.find({ 'friends.friendId': req.query.id }, (err, docs) => {
    if (err) {
      next()
    }
    res.json({
      err_code: 0,
      msg: 'success',
      data: docs
    })
  })
})

// 10.查询所有用户
router.get('/getAllUsers', (req, res, next) => {
  User.find({}, (err, docs) => {
    if (err) {
      next()
    }
    let newResults = []
    docs.forEach((ele) => {
      newResults.push({ name: ele.nickname, email: ele.email, id: ele._id })
    })
    res.status(200).json({
      err_code: 0,
      msg: "success",
      data: newResults
    })
  })
})

// 导出路由对象
module.exports = router;