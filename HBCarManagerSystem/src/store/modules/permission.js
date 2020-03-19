import { constantRouterMap } from '@/router/routers'
import {getIFramePath, getIFrameUrl} from "@/utils/iframe";
import store from "@/store/index";

const permission = {
  state: {
    routes: constantRouterMap,
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRouterMap.concat(routes)
    }
  },
  actions: {
    generateRoutes({commit}, navMenuTree) {
      return new Promise(resolve => {
        let accessedRoutes
        accessedRoutes = filterMenu(navMenuTree)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
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
          tmp.component = resolve => require([`@/views/${menu.url}`], resolve)
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
export default permission
