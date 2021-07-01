import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';
import moduleA from './module/moduleA';

// 使用vuex
Vue.use(Vuex);

// 创建store
const store = new Vuex.Store({
  state: {
    token: '',
    usermessage: '',
    registerVerifyCode: '',
    LocationInfo: '',
    userdata: {
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
    },
    isLogin: false,
    moments: [],
    commentsList: [],
  },
  mutations,
  getters,
  actions,
  modules: {
    moduleA
  }
})

// 导出store
export default store;
