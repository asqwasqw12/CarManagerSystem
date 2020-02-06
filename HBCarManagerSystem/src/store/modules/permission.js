import { asyncRoutes,constantRoutes } from '@/router'

//如果是不需要权限的路由或者是角色可以通过的路由，返回true,否则返回false
/*const hasPermission = (route,role) => {
  if(route.meta && route.meta.roles ) {
    if (route.meta.roles.includes(role)) {    //如果路由包含该角色，返回true
      return true
    } else{
      return false
    }
  } else{
    return true     //如果是非权限路由，返回true
  }
}*/

//
/*export const filterAsyncRoutes = (routes,role) => {
  const res = []
  routes.forEach(route =>{
    const tmp ={        //复制route
      ...route
    }
    if(hasPermission(tmp,role)){
      if(tmp.children){
        tmp.children = filterAsyncRoutes(tmp.children,role)
      }
      const childSize = tmp.children && tmp.children.length > 0
      if(!tmp.children || childSize){
        res.push(tmp)
      }
    }
  })
  return res
}*/

//如果是不需要权限的路由或者是角色可以通过的路由，返回true,否则返回false
function hasPermission(route,roles){
  if(route.meta && route.meta.roles){
    return roles.some(role => route.meta.roles.indexOf(role) >= 0) //array.indexof()返回元素下标位置，没有返回-1，array.some()数组元素第一个符合条件直接返回true,所有不符合返回false
  }else {
    return true  //如果是非权限路由，返回true
  }
}
/*const hasPermission = (route,role) => {
  if(route.meta && route.meta.roles ) {
    if (route.meta.roles.includes(role)) {    //如果路由包含该角色，返回true
      return true
    } else{
      return false
    }
  } else{
    return true     //如果是非权限路由，返回true
  }
}*/
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

/*permission.state = {
  routes:[],
  addRoutes:[]
}

permission.mutations = {
  setRoute: (state,routes) =>{    //赋值addRoutes[],更新routes[]
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

//将符合用户角色权限的路由表赋值给addRoutes[],更新routes[]
permission.actions = {
  generateRoutes: ({commit,rootGetters}) => {
    return new Promise( (resolve,reject) => {
      let accessRoutes
      accessRoutes = filterAsyncRouter(asyncRoutes,rootGetters.role)
      commit('setRoute',accessRoutes)
      window.console.log(accessRoutes)
      resolve(accessRoutes)
    })
  }
}*/

export default permission
