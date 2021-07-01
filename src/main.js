import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import resetMessage from "common/resetMessage"
import renderTime from "@/utils/timeformat"
import WS from '@/utils/websocket'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client';
Vue.prototype.$io = SocketIO('http://127.0.0.1:8082', {
  transports: ['websocket'],
})
Vue.prototype.$ws = WS;
Vue.prototype.$TF = renderTime;
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$message = resetMessage;

const Vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default Vm
