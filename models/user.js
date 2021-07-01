// 引入mongoose数据库
var mongoose = require('mongoose');

// 创建一个schema
var Schema = mongoose.Schema;

// 连接mongoDB数据库
mongoose.connect('mongodb://localhost:27017/mobilemall', { useNewUrlParser: true, useUnifiedTopology: true });

// 设计集合（表）
var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: String,
    required: true,
    dafault: ''
  },
  avatar: {
    type: String,
    default: 'http://127.0.0.1:8081/public/img/userAvatar/defaultavatar.png'
  },
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    // -1 保密
    // 0 男
    // 1 女
    enum: [-1, 0, 1],
    default: -1
  },
  signature: {
    type: String,
    default: ''
  },
  birthday: {
    type: String,
    dafault: ''
  },
  age: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    default: ''
  },
  hobby: {
    type: String,
    default: ''
  },
  fans: {
    type: Array,
    default: []
  },
  friends: {
    type: Array,
    default: []
  },
  status: {
    type: Number,
    enum: [0, 1],//0为offline,1为online
    default: 0
  },
  frireq: {
    type: Array,
    default: []
  }
})

// 导出集合
module.exports = mongoose.model('User', userSchema);