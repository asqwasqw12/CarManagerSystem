import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const constantRoutes = require('./constantRoutes').default
export const asyncRoutes = require('./asyncRoutes').default

const createRouter = () => new Router({
mode:'history',
  routes:constantRoutes
})
const router = createRouter()
const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher  //新的路由器替换老的路由器
}

export { resetRouter }
export  default router
