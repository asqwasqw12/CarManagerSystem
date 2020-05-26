import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import asyncRoutes from "@/router/asyncRoutes";
// progress bar style
NProgress.configure({ showSpinner: false })// NProgress Configuration
const whiteList = ['/login','/register']// no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log("开始路由。。。")
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  if (store.getters.token && typeof (store.getters.token) != "undefined" && store.getters.token != 'undefined') {
    // 已登录且要跳转的页面是登录页

    if (to.path === '/login') {
      console.log("跳转到/login页面")
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log("跳转到非login页面")
      console.log("path:"+to.path)
      if (store.getters.navTree.length === 0 ) { // 判断当前用户是否获取菜单信息
        console.log("根据token获取用户信息。。。")
        try{
          await store.dispatch('getInfo')
          await store.dispatch('findNavTree',store.getters.name)
          const accessRoutes = await store.dispatch('generateRoutes',store.getters.navTree)
          store.dispatch('findPermissions',store.getters.name)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
          }catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('resetToken')
          console.log(error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})


