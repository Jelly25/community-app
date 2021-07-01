import axios from 'axios';
import vm from '../main'

function requestSpreads(requestArr) {
  if (Object.prototype.toString.call(requestArr) === '[object Array]') {
    return axios.all(
      requestArr.map(res => res.catch(e => {
        vm.$message.warning({ message: `${e}`, offset: 1 })
      }))
    ).then(
      axios.spread(function (...res) {
        return Promise.resolve(res)
      })
    )
  } else {
    const error = new Error('参数错误！')
    try {
      throw error
    } catch (e) {
      vm.$message.warning({ message: `${e}`, offset: 1 })
    }
  }
}

// 并发请求函数
export function requestAll(requestArr) {
  return new Promise((resolve, reject) => {
    requestSpreads(requestArr).then(res => {
      return resolve(res)
    })
  })
}