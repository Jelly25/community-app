// 引入store，用于管理socket推送来的消息
import store from '../store'

// 封装websocket对象
const WS = {
  $ws: null, // webscoket实例
  wsUrl: 'ws://127.0.0.1:8082', // websocket链接地址
  timeout: 30000, // 心跳重连时间
  timeoutObj: null, // 定时器
  lockReconnect: false, // 避免重复重连
  reconnectTimes: 0, // 重连次数

  // 初始化webSocket
  createWS: function () {
    if ('WebSocket' in window) {
      this.$ws = new WebSocket(wsURl)
      this.$ws.onopen = this.wsOpen
      this.$ws.onmessage = this.wsMessage
      this.$ws.onerror = this.wsError
      this.$ws.onclose = this.wsClose
    } else {
      alert('Current browser Not support websocket')
    }
  },

  // webSocket 打开
  wsOpen: function () {
    WS.$ws.send('Hello WebSockets!')
    store.commit('SET_WS_CONNECT', true)
    console.log('== websocket open ==')
    // 开始心跳
    heartBeat.start()
  },

  // websocket 接收到服务器消息
  wsMessage: function (msg) {
    console.log('== websocket message ==', msg)
    // 每次接收到服务端消息后 重置websocket心跳
    WS.reset()
    store.commit('SET_WS_MSG', msg.data)
  },

  // websocket 发生错误
  wsError: function (err) {
    console.log('== websocket error ==', err)
    // 发生错误重连socket
    if (WS.reconnectTimes < 10) {
      WS.reconnect()
    }
  },

  // websocket 关闭连接
  wsClose: function (event) {
    console.log('== websocket close ==', event)
    if (WS.$ws && WS.$ws.readyState === 1) {
      WS.$ws.close()
      store.commit('SET_WS_CONNECT', false)
    }
    const token = localStorage.getItem('token')
    if (token) {
      if (WS.reconnectTimes < 10) { // 设置重连次数为10次
        WS.reconnect()
      }
    }
  },

  // socket开始心跳
  wsStartHeart: function () {
    WS.timeoutObj && clearTimeout(WS.timeoutObj)
    WS.timeoutObj = setTimeout(function () {
      // 判断websocket当前状态
      if (WS.$ws.readyState === 1) {
        WS.$ws.send('HeartBeat')
      }
    }, WS.timeout)
  },

  // socket 重置心跳
  wsRset: function () {
    clearTimeout(WS.timeoutObj)
    WS.wsStartHeart()
  },

  // socket 重连
  wsReconnect: function () {
    console.log('Reconnection Socket')
    if (wsConnection.lockReconnect) return
    WS.reconnectTimes++
    WS.lockReconnect = true
    setTimeout(function () { // 没连接上会一直重连，设置延迟避免请求过多
      WS.createWS()
      WS.lockReconnect = false
    }, 6000)
  }
}

export default WS