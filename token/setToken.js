var jwt = require('jsonwebtoken');
var jwtSecret = 'jelly_yly0613';

// 生成token
module.exports = function (email, userid) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({
      email: email,
      _id: userid
    }, jwtSecret, { expiresIn: '60' });
    resolve(token);
  })
}