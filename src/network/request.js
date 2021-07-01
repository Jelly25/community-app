import axios from 'axios';
import vm from '../main'

export function request(config) {
  // 创建instance实例
  const instance = axios.create({
    baseURL: 'http://192.168.43.38:8081',
    timeout: 10000
  })

  // 拦截器
  // 1.请求拦截
  instance.interceptors.request.use((config) => {
    config.headers.Token = localStorage.getItem('token') || ''
    return config;
  }, error => {
    return Promise.reject(error);
  })
  // 2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.err_code == 1) {
      vm.$store.commit('delToken');
      vm.$message({
        message: "token失效，请您重新登录",
        type: "warning",
        offset: 1
      });
    }
    return res.data;
  }, error => {
    return Promise.reject(error);
  })

  // 发送请求
  return instance(config)
}




