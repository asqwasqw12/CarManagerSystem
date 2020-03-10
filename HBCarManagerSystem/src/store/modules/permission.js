import { asyncRoutes,constantRoutes } from '@/router'

//如果是不需要权限的路由或者是角色可以通过的路由，返回true,否则返回false
function hasPermission(route,roles){
  if(route.meta && route.meta.roles){
    return roles.some(role => route.meta.roles.indexOf(role) >= 0) //array.indexof()返回元素下标位置，没有返回-1，array.some()数组元素第一个符合条件直接返回true,所有不符合返回false
  }else {
    return true  //如果是非权限路由，返回true
  }
}

//递归过滤路由表，返回符合用户角色权限的路由表
function filterAsyncRouter(asyncRouterMap,roles){
  const accessedRouter = asyncRouterMap.filter(route => {
    if (hasPermission(route, roles)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouter
}

const permission = {
  state:{
    routes:[],
    addRoutes:[]
  },
  mutations:{
    setRoute: (state,routes) =>{    //赋值addRoutes[],更新routes[]
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions:{
    generateRoutes: ({commit},rootGetters) => {
      return new Promise( (resolve,reject) => {
        let accessRoutes
        accessRoutes = filterAsyncRouter(asyncRoutes,rootGetters.role)
        commit('setRoute',accessRoutes)
        window.console.log(accessRoutes)
        resolve(accessRoutes)
      })
    }
  }
}


export default permission
