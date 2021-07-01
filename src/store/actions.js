export default {
  // 异步更新用户数据
  asyncupdateUserData(context, payload) {
    let userdata = JSON.parse(window.localStorage.getItem(userdata));
    context.commit('updateUserData', payload);
  },
  // 异步退出登录
  asyncresetUserData(context) {
    context.commit('resetUserData');
  },
  // 异步请求邮箱注册验证码
  asyncgetregisterVerifyCode(context, payload) {
    context.commit('getregisterVerifyCode', payload);
  },
  // 异步更新社区内容
  asyncupdateMoments(context, payload) {
    context.commit('updateMoments', payload);
  },
  // 异步更新评论
  asyncupdateCommentsList(context, payload) {
    context.commit('updateCommentsList', payload);
  },
  // 异步传输token
  asyncgetToken(context, payload) {
    context.commit('getToken', payload);
  },

}
