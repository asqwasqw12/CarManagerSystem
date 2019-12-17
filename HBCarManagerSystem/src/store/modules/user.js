import Cookies from 'js-cookie'
import { resetRouter } from "@/router"
import request from '@/utils/request'
const user = {}

user.state = {
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

  user.action = {

    //发送用户名和密码到后台验证，成功则将后台响应回来的token信息存储到vuex和cookies
    /*后台数据格式 res = {
                  string date; //时间
                  int status = 200; //状态码，默认200，表示响应成功
                  T data; //接口返回的数据
                  InfoMsg info; //消息
                          }*/
    /*InfoMsg = {
      String code=0;    //默认0，表示正常执行
      String message="操作成功"; //默认等于操作成功
    }*/
    login: ({commit}, userInfo) => {

      userInfo.userName = userInfo.userName.trim()    //去掉头尾空格
      //const { userName,password } = userInfo
      return new Promise((resolve, reject) => {
        request({
          url: '/api/login',
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
        url:'/api/getUserInfo',
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
  }

  export default user
