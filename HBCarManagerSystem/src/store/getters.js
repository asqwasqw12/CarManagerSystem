
const getters = {

  roles:state => state.user.roles,
  token:state => state.user.token,
  name:state => state.user.name,
  userInfo:state => state.user.userInfo, //用户基本信息
  perms: state => state.user.perms,      //用户权限标识集合
  navTree:state => state.user.navTree,   //导航菜单树
  loadMenus: state => state.user.loadMenus,
  addRoutes: state => state.permission.addRoutes,
  permission_routes: state => state.permission.routes,
  sidebar:state => state.app.sidebar,     //侧边栏
  device:state => state.app.device,        //使用的设备
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  sqlApi: state => state.app.sqlApi,
  swaggerApi: state => state.app.swaggerApi,
  updateAvatarApi:state => state.app.updateAvatarApi,
  uploadFileApi:state => state.app.uploadFileApi

}

export default getters
