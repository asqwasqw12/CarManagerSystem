import cookies from 'js-cookie'
import { resetRouter } from "@/router/routers"
import { login, logout,getInfo } from '@/api/login'
import {findNavTree} from "@/api/system/menu";
import {findPermissions} from "@/api/system/user";
import store from "@/store/index";
const user = {
  state:{
    token:cookies.get('token'),     //使用令牌进行路由，cookies.get()保证刷新页面可以不用重新登录
    name:'',
    roles:[],   //用户角色,预留
    perms: [],  // 用户权限标识集合
    navTree: [],  // 导航菜单树

    // 第一次加载菜单时用到
    loadMenus: false
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
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
    setPerms(state, perms){  // 用户权限标识集合
      state.perms = perms;
    },
    setNavTree(state, navTree){  // 设置导航菜单树
      state.navTree = navTree;
    }
  },
  actions:{
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('setToken','')
        commit('setName','')
        commit('setPerms','')
        commit('setNavTree','')
        resolve()
      })
    },
    findNavTree:({commit},name) =>{
      return new Promise(
      (resolve,reject) =>{
        findNavTree({'userName':name}).then(response =>{
          if(response.msg !=='ok'){
            reject('获取菜单树失败，请重新登录')
          }
          commit('setNavTree',response.data)
          resolve(response.data)
          }).catch(error => {
          reject(error)
        })
      })
},
    findPermissions:({commit},name) => {
      return new Promise(
        (resolve,reject) => {
          findPermissions({'name':name}).then(response => {
            if(response.msg !=='ok'){
              reject('获取权限集合失败，请重新登录')
            }
            commit('setPerms', response.data)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
    },
    login: ({commit}, userInfo) => {
      const user = userInfo
      //user.userName = user.userName.trim()    //去掉头尾空格
      return new Promise(
        (resolve, reject) => {
          login(user).then(response => {             //后台响应返回数据
          const data = response
          if (data.msg === 'ok' ) {                      //验证成功
            commit('setToken', data.data.token )        //存储token到vuex
            commit('setName', user.account )       //存储token到vuex
            cookies.set('token', data.data.token)       //存储token到cookies
            commit('SET_LOAD_MENUS', false)             //要求重新加载菜单
          }else{
            reject(data.msg)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //根据token获取后台用户信息（名字和角色等），并存储到vuex
    getInfo: ({commit,state}) => {
      return new Promise( (resolve,reject) => {
       getInfo(state.token).then(response => {
          const data = response
          if(data.msg !=='ok'){
            reject('认证失败，请重新登录')
          }
            commit('setName',data.data.username)
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
          commit('setPerms','')
          commit('setNavTree','')
          resetRouter()
          cookies.set('token','')
          dispatch('delAllViews')
          resolve(response.data)
        }).catch( error => {
          reject(error)
        })
      })
    },
    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}
export default user
