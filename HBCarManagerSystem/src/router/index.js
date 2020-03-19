import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {batchDelete, findMenuTree, findNavTree, save} from "@/api/system/menu"
import {exportUserExcelFile, findByName, findPage, findPermissions, updatePassword} from "@/api/system/user";
import { getIFramePath, getIFrameUrl } from '@/utils/iframe'
NProgress.configure({ showSpinner: false })// NProgress Configuration
import  asyncRoutes  from './asyncRoutes'
const whiteList = ['/login','/register']// no redirect whitelist

router.beforeEach((to, from, next) => {
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
      if (store.getters.name === '') { // 判断当前用户是否已拉取完user_info信息
        console.log("根据token获取用户信息。。。")
        store.dispatch('getInfo').then(res => { // 拉取user_info
          // 动态路由，拉取菜单
          console.log("获取动态菜单1...")
          addDynamicMenuAndRoutes(store.getters.name, to, from)
          next()
        }).catch((err) => {
          console.log(err)
          store.dispatch('resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        })
        // 登录时未拉取 菜单，在此处拉取
      } else {
        console.log("获取动态菜单2...")
        addDynamicMenuAndRoutes(store.getters.name, to, from)
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

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName, to, from) {
  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path)
  if(store.state.user.loadMenus ) {
    console.log('动态菜单和路由已经存在.')
    return
  }
  findNavTree({'userName':userName})
    .then(res => {
      // 添加动态路由
      //let dynamicRoutes = addDynamicRoutes(res.data)
      let dynamicRoutes = filterMenu(res.data)
      console.log('dynamicRoutes:'+dynamicRoutes)
      // 处理静态组件绑定路由

     // router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
     // router.addRoutes(router.options.routes)
     // router.addRoutes(dynamicRoutes)
      router.addRoutes(asyncRoutes)
      console.log(router)
      // 保存加载状态
      store.commit('SET_LOAD_MENUS', true)
      // 保存菜单树
      store.commit('setNavTree', res.data)
    }).catch( err => {
    this.$notify({
      title:'提示',
      message:err || 'token过期，请重新登录',
      position:'center',
      type:'error'
    })
    next(`/login?redirect=${to.path}`)
  }).then(res => {
    findPermissions({'name':userName}).then(res => {
      // 保存用户权限标识集合
      store.commit('setPerms', res.data)
    })
  })
    .catch(function(res) {
    })
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path
  let length = store.getters.iframeUrls.length
  for(let i=0; i<length; i++) {
    let iframe = store.getters.iframeUrls[i]
    if(path != null && path.endsWith(iframe.path)) {
      url = iframe.url
      store.commit('setIFrameUrl', url)
      break
    }
  }
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function addDynamicRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].id
        }
      }
      let path = getIFramePath(menuList[i].url)
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route['path'] = path
        route['component'] = resolve => require([`@/views/IFrame/IFrame`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = getIFrameUrl(menuList[i].url)
        let iFrameUrl = {'path':path, 'url':url}
        store.commit('addIFrameUrl', iFrameUrl)
      } else {
        try {
          // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
          // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
          //let array = menuList[i].url.split('/')
          //let url = ''
          //for(let i=0; i<array.length; i++) {
            //url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
          //}
          //url = url.substring(0, url.length - 1)
          route['component'] = resolve => require([`@/views/${menuList[i].url}`], resolve)
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
    console.log('动态路由加载...')
    console.log(routes)
    console.log('动态路由加载完成.')
  }
  return routes
}

export function filterMenu(menuList) {
  const res = []
  menuList.forEach(menu => {
    const tmp = {
      path: menu.url,
      name: menu.name,
      meta: {
        icon: menu.icon,
        index: menu.id,
        title:menu.name
      },
      component:'layout'
    }
    if(menu.parentId != 0) {
      let path = getIFramePath(menu.url)
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        tmp.path = path
        tmp.component = resolve => require([`@/views/IFrame/IFrame`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = getIFrameUrl(menu.url)
        let iFrameUrl = {'path': path, 'url': url}
        store.commit('addIFrameUrl', iFrameUrl)
      } else {
        try {
          tmp.component = resolve => require([`@/views/IFrame/IFrame`], resolve)
        }catch(e){}
      }
    }
      if (menu.children) {
        tmp.children = filterMenu(menu.children)
      }
      res.push(tmp)
    })
  return res
}

