import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path:'/login',
    name:'login',
    hidden:true,
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login')
  },
  {
    path:'/404',
    name:'404',
    hidden:true,
    component:() => ('@/views/error/404')
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/error/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    hidden:true,
    children: [
      {
        path: 'home',
        component: () => import('@/views/car/car_overview.vue'),
        name: 'overview',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },

{
  path:'/register',
    name:'register',
  hidden:true,
  component: () => import('@/views/register')
},
{
  //path:'/index.html',
  path:'/index.html',
  redirect:'/login',
  hidden:true
}
]

const createRouter = ()=> new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
