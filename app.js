// 导入express框架
const express = require('express');
// 导入path核心模块
const path = require('path');
// 导入websocket
// const server = require('./socket/socket');
const server = require('./socket/socket.io')
var connectHistoryApiFallback = require('connect-history-api-fallback')
// 导入jwt验证token
const jwt = require('jsonwebtoken');
// 导入body-parser
const bodyParser = require('body-parser');
// 导入首页路由
const homepageRouter = require('./routes/homepage');
// 导入用户路由
const userRouter = require('./routes/user');
// 导入聊天路由
const chat = require('./routes/chat')
// 导入社区路由
const communityRouter = require('./routes/comment');
// 导入上传文件路由
const multer = require('./routes/multer');
// 导入邮箱验证路由
const nodemailer = require('./routes/verify');

// 创建服务
const app = express();

// 设置跨域
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Token");
  next()
});

// token验证
app.all('*', (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, 'jelly_yly0613', (error, data) => {
    if (error && req.path != '/profile/login' && req.path != '/emailverify' && req.path != '/profile/register' && req.path != '/homepage/slide' && req.path.indexOf('/public/img') === -1 && req.path === "") {
      return res.json({
        err_code: 1,
        msg: 'token无效'
      })
    }
    next();
  })
})

// 开放public目录
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', connectHistoryApiFallback())
app.use(express.static('./dist'))
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html')
})
// 配置body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 使用首页路由
app.use(homepageRouter);
// 使用用户路由
app.use(userRouter);
// 使用社区路由
app.use(communityRouter);
// 使用上传路由
app.use(multer);
// 使用聊天路由
app.use(chat);
// 使用验证路由
app.use(nodemailer);

// 配置全局错误中间件
app.use((err, req, res, next) => {
  res.json({
    err_code: 500,
    msg: 'server error',
    data: err
  })
})

// 监听8081端口
app.listen(8081, () => {
  console.log('server is running...');
});
