import { constantRouterMap } from '@/router/routers'
import store from "@/store/index";
import asyncRoutes from "@/router/asyncRoutes";
import layout from '@/layout'
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
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })  //这个路由地址必须加在最后面，如果加在router前面，路由就会直接跳到404页面
        commit('SET_ROUTES', accessedRoutes)
       // commit('SET_ROUTES', asyncRoutes)
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
      component:layout
    }
    if(menu.parentId != 0) {
        try {
          tmp.component = resolve => require([`@/views/${menu.location}`], resolve)
        }catch(e){}
    }
    if (menu.children) {
      tmp.children = filterMenu(menu.children)
    }
    res.push(tmp)
  })
  return res
}
export default permission
