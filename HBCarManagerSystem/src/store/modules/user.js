import cookies from 'js-cookie'
import { resetRouter } from "@/router"
import request from '@/utils/request'
const user = {
  state:{
    token:cookies.get('token'),     //使用令牌进行路由，cookies.get()保证刷新页面可以不用重新登录
    name:'',
    role:[]
  },
  mutations:{
    setName: (state,name) => {
      state.name = name
    },
    setRole: (state,role) => {
      state.role = role
    },
    setToken: (state,token) =>{
      state.token = token
    }
  },
  actions:{
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('setToken','')
        commit('setName','')
        commit('setRole',[])
        resolve()
      })
    },
    login: ({commit}, userInfo) => {

      userInfo.userName = userInfo.userName.trim()    //去掉头尾空格
      //const { userName,password } = userInfo
      return new Promise((resolve, reject) => {
        request({
          url: '/api/login',
          method: 'post',
          headers:{
            'Content-Type':'application/json'
          },
          data:userInfo                                    //携带数据发送请求到后台
        }).then(response => {                         //后台响应返回数据
          const data = response.data
          window.console.log(data)
          if (data.info.code === '0') {                              //验证成功
            const body = data.data
            window.console.log("验证成功")
            window.console.log("data = " + body)
            window.console.log("body.token = "+ body.token)
            window.console.log("body.roles = "+body.roles)
            commit('setToken', body.token)             //存储token到vuex
            cookies.set('token', body.token)           //存储token到cookies
            window.console.log('cookies token = ',cookies.get('token'))
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //根据token获取后台用户信息（名字和角色等），并存储到vuex
    getUserInfo: ({commit,state}) => {
      window.console.log(state.token)
      //let token = state.token
      let param = new URLSearchParams();

      param.append('token', state.token);
      return new Promise( (resolve,reject) => {
        request({
          url:'/api/getUserInfo',
          method:'post',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data: param
        }).then(response => {
          const data = response.data
          window.console.log(data)
          const body = data.data
          if(data.info.code !=='0'){
            reject('认证失败，请重新登录')
          }
          commit('setName',body.userName)
          commit('setRole',body.roles)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //根据token信息获取后台信息，将vuex中的token和用户姓名和角色等清空，将coookies的token信息清空
    logout:({ commit,state,dispatch }) => {
      let param = new URLSearchParams()
      param.append('token',state.token)
      return new Promise( (resolve,reject) => {
        request({
          url:'/api/logout',
          method:'post',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data:param
        }).then(response => {
          commit('setToken','')
          commit('setName','')
          commit('setRole',[])
          resetRouter()
          cookies.set('token','')
          dispatch('tagsView/delAllViews')
          resolve(response.data)
        }).catch( error => {
          reject(error)
        })
      })
    }
  }
}

/*user.state = {
  token:cookies.get('token'),
  name:'',
  role:''
},
  user.mutations = {
setName: (state,name) => {
  state.name = name
},
setRole: (state,role) => {
  state.role = role
  },
setToken: (state,token) =>{
  state.token = token
}
  }

  user.actions = {

    //发送用户名和密码到后台验证，成功则将后台响应回来的token信息存储到vuex和cookies
    /!*后台数据格式 res = {
                  string date; //时间
                  int status = 200; //状态码，默认200，表示响应成功
                  T data; //接口返回的数据
                  InfoMsg info; //消息
                          }*!/
    /!*InfoMsg = {
      String code=0;    //默认0，表示正常执行
      String message="操作成功"; //默认等于操作成功
    }*!/
    login: ({commit}, userInfo) => {

      userInfo.userName = userInfo.userName.trim()    //去掉头尾空格
      //const { userName,password } = userInfo
      return new Promise((resolve, reject) => {
        request({
          url: '/eshop/login',
          method: 'post',
          userInfo                                    //携带数据发送请求到后台
        }).then(response => {                         //后台响应返回数据
          const data = response.data
          window.console.log(data)
          if (data.info.code === '0') {                              //验证成功
            const body = data.data
            commit('setToken', body.token)             //存储token到vuex
            cookies.set('token', body.token)           //存储token到cookies
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //根据token获取后台用户信息（名字和角色等），并存储到vuex
  getUserInfo: ({commit,state}) => {
    return new Promise( (resolve,reject) => {
      request({
        url:'/eshop/getUserInfo',
        method:'get',
        token:state.token
      }).then(response => {
        const data = response.data
        window.console.log(data)
        const body = data.data
        if(data.info.code ==='1'){
          reject(data)
        }
        commit('setName',body.name)
        commit('setRole',body.role)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
    //根据token信息获取后台信息，将vuex中的token和用户姓名和角色等清空，将coookies的token信息清空
logout:({ commit,state }) => {
    return new Promise( (resolve,reject) => {
      request({
        url:'/api/logout',
        method:get,
        token:state.token
      }).then(response => {
        commit('setToken','')
        commit('setName','')
        commit('setRole','')
        resetRouter()
        cookies.set('token','')
        resolve(response.data)
      }).catch( error => {
        reject(error)
      })
    })
    }
  }*/

  export default user
