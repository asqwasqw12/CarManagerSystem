import router from './router'
import store from './store'

const whiteList = ['/login','/register']

router.beforeEach(async(to,from,next) => {
  window.console.log('route begin judging ...')
  window.console.log(router)
window.console.log('token =' + store.getters.token)

  if(store.getters.token && typeof (store.getters.token) != "undefined" && store.getters.token != 'undefined') {           //如果有token
      window.console.log('has token,goto path is' + to.path)
      if (to.path === '/login' ) {       //如果有token,并且路径是登录，直接去往主页
        window.console.log('jumper home /')
        next('/')
       } else {
        if (store.getters.role === '') {     //如果有token,路径不是登录，用户角色为空，那么获取用户信息，
          window.console.log('role is empty,and get user info...')
          await store.dispatch('getUserInfo')
          window.console.log('get permission routes map.........')
          window.console.log(store.getters.role)
          const addRoutes = await store.dispatch('generateRoutes', store.getters)
          window.console.log('add routes...')
          window.console.log(router)
          window.console.log(addRoutes)
          router.addRoutes(addRoutes)
          //动态添加可访问路由,并将404页面添加到最后
          window.console.log(router)
          window.console.log('refresh pages...')
          window.console.log('to path = ' + to.path)
          window.console.log('准备执行............to语句')
          window.console.log(to.path)
          next({...to, replace: true})
        } else {
          window.console.log('准备执行next()语句')
          next()
          window.console.log('执行next()语句完毕')
        }
      }
  }else{                                  //如果没有token,是白名单的路由直接进入否则进入login
      window.console.log('no token,goto path is' + to.path)
      if(whiteList.indexOf(to.path)>=0){
        window.console.log('page is in white list')
        next()
      }else{
        window.console.log('page not in white list,goto /login')
        next({
          name:'login',
          query:{               //// 将刚刚要去的路由path作为参数，方便登录成功后直接跳转到该路由
            redirect:to.path
          }
        })
      }

    }
})
