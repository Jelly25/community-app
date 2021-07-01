export default {
  // 获取定位信息
  getLocationInfo(state, payload) {
    state.locationInfo = payload
  },
  // 更新用户数据
  updateUserData(state, payload) {
    window.localStorage.setItem("userdata", JSON.stringify(payload));
    state.userdata = payload;
    state.isLogin = true;
  },
  // 退出登录
  resetUserData(state) {
    state.userdata = {
      _id: '',
      avatar: 'http://127.0.0.1:8081/public/img/userAvatar/defaultavatar.png',
      nickname: '未登录',
      status: 0,
      signature: '',
      gender: '',
      birthday: '',
      age: '',
      address: '',
      hobby: ''
    };
    state.isLogin = false
  },
  // 获取验证码
  getregisterVerifyCode(state, payload) {
    state.registerVerifyCode = payload;
  },
  // 更新社区内容
  updateMoments(state, payload) {
    state.moments = payload;
  },
  // 更新评论
  updateCommentsList(state, payload) {
    state.commentsList = payload;
  },
  // 传输token
  getToken(state, payload) {
    state.token = payload;
    localStorage.setItem("token", payload);
  },
  // token失效
  delToken(state) {
    state.token = "";
    localStorage.removeItem("token");
    localStorage.removeItem('userdata');
  },
}
