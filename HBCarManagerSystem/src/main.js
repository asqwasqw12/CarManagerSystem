// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router/routers'
import './assets/styles/index.scss'  //全局css
//import '@/assets/styles/bootstrap.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'font-awesome/css/font-awesome.min.css'
import Viewer from 'v-viewer'          //引入图片查看器
import 'viewerjs/dist/viewer.css'
import './assets/icons'
import uploader from 'vue-simple-uploader'
import '@/utils/directives.js';
import store from './store'
import '@/router/index' // permission control
import BaiduMap from 'vue-baidu-map'
import echarts from 'echarts'
import vRegion from 'v-region'


import FileManager from 'laravel-file-manager'
Vue.use(FileManager, {store})

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(echarts)
Vue.use(uploader)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'tYc5nRCwfQq7SH1gtU3Yu5hxbCcblKxk'
})
Vue.use(vRegion)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
