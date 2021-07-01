module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": '@/assets',
        "common": '@/common',
        "components": '@/components',
        "network": '@/network',
        "views": '@/views'
      }
    }
  },
  // devServer: {
  //   proxy: {
  //     '/socket.io': {
  //       target: 'http://127.0.0.1:8083',
  //       ws: true,
  //       changeOrigin: true,
  //       logLevel: 'debug'
  //     },
  //   }
  // }
}