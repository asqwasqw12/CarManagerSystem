import cookies from 'js-cookie'
import { resetRouter } from "@/router"
import { login, logout } from '@/api/login'
import { getInfo } from '@/api/user'
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
      return new Promise(

        (resolve, reject) => {
          login(userInfo).then(response => {                         //后台响应返回数据
          const data = response
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
       getInfo(state.token).then(response => {
          const data = response
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
      return new Promise( (resolve,reject) => {
        logout().then(response => {
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

  export default user
