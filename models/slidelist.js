// 引入mongoose数据库
var mongoose = require('mongoose');

// 创建一个schema
var Schema = mongoose.Schema;

// 连接mongoDB数据库
mongoose.connect('mongodb://localhost:27017/mobilemall', { useNewUrlParser: true, useUnifiedTopology: true });

// 设计集合（表）
var slideSchema = new Schema({
  path: {
    type: String,
    required: true
  }
})

// 导出集合
module.exports = mongoose.model('Slidelist', slideSchema);
