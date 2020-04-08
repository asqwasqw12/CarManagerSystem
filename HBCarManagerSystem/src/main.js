// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router/routers'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/icons'

import store from './store'
import '@/router/index' // permission control
import BaiduMap from 'vue-baidu-map'
import echarts from 'echarts'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(echarts)
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'tYc5nRCwfQq7SH1gtU3Yu5hxbCcblKxk'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
