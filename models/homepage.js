// 引入mongoose数据库
var mongoose = require('mongoose');

// 创建一个schema
var Schema = mongoose.Schema;

// 连接mongoDB数据库
mongoose.connect('mongodb://localhost:27017/mobilemall', { useNewUrlParser: true, useUnifiedTopology: true });

// 设计集合（表）
var homepageSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  useravatar: {
    type: String,
    required: true
  },
  usergender: {
    type: Number,
    required: true
  },
  tag: {
    type: Array,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  imgList: {
    type: Array,
    default: [],
    required: true
  },
  updatetime: {
    type: String,
    default: ''
  }
})

// 导出集合
module.exports = mongoose.model('Homepage', homepageSchema);