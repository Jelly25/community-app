var jwt = require('jsonwebtoken');
var jwtSecret = 'jelly_yly0613';

// 验证token
module.exports = function (token) {
  return new Promise((resolve, reject) => {
    var info = jwt.verify(token.split(' ')[1], jwtSecret);
    resolve(info);
  })
}