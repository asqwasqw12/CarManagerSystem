
const getters = {
  roles:state => state.user.roles,
  token:state => state.user.token,
  name:state => state.user.name,
  loadMenus: state => state.user.loadMenus,
  addRoutes: state => state.permission.addRoutes,
  permission_routes: state => state.permission.routes,
  sidebar:state => state.app.sidebar,     //侧边栏
  device:state => state.app.device,        //使用的设备
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}

export default getters
