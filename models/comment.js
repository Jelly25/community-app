// 引入mongoose数据库
var mongoose = require('mongoose');

// 创建一个schema
var Schema = mongoose.Schema;

// 连接mongoDB数据库
mongoose.connect('mongodb://localhost:27017/mobilemall', { useNewUrlParser: true, useUnifiedTopology: true });

// 设计集合（表）
var commentSchema = new Schema({
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
  updatetime: {
    type: String,
    required: true
  },
  publishcon: {
    type: String,
    required: true
  },
  prefer: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: []
  }
})

// 导出集合
module.exports = mongoose.model('Comment', commentSchema);