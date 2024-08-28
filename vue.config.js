const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: `http://${process.env.VUE_APP_PUNTATORE || '192.168.145.10'}:3000`,
        changeOrigin: true
      }
    }
  }
})