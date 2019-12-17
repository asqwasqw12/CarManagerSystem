import router from './router'
import store from './store'

const whiteList = ['/login']

router.beforeEach()(async(to,from,next) => {
  window.console.log('route begin judging ...')

  if(store.getters.token) {           //如果有token
    window.console.log('has token,goto path is' + to.path)
    if (to.path === '/login') {       //如果有token,并且路径是登录，直接去往主页
      window.console.log('jumper home /')
      next('/')
    } else if (store.getters.role.length === 0) {     //如果有token,路径不是登录，用户角色为空，那么获取用户信息，
      window.console.log('role is empty,and get user info...')
      await store.dispatch('getUserInfo')

      window.console.log('get permission routes map...')
      const addRoutes = await store.dispatch('generateRoutes',store.getters.role)

      window.console.log('add routes...')
      router.addRoutes(addRoutes)   //动态添加可访问路由
      window.console.log('refresh pages...')
      next({...to, replace: true})  //
    } else {
      window.console.log('role is ' + store.getters.role)
      next()
    }
  }else{                                  //如果没有token,是白名单的路由直接进入否则进入login
      window.console.log('no token,goto path is' + to.path)
      if(whiteList.indexof(to.path)>=0){
        window.console.log('page is in white list')
        next()
      }else{
        window.console.log('page not in white list,goto /login')
        next({
          name:'login',
          query:{
            redirect:to.path
          }
        })
      }

    }
})
