import Cookies from 'js-cookie'
const app = {
  state:{
    sidebar: {
      opened: !+Cookies('sidebarStatus'),     //默认侧边框为打开
      withoutAnimation: false                //无动画属性默认为无
},
    size: Cookies.get('size') || 'small'
  },
  mutations:{

    //改变sidebar状态
    TOGGLE_SIDEBAR:state =>{
      if(state.sidebar.opened){
        Cookies.set('sidebarStatus',1)
      }else{
        Cookies.set('sidebarStatus',0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },

    //关闭sidebar
    CLOSE_SIDEBAR:(state,withoutAnimation)=>{
      Cookies.set('sidebarStatus',1)
      state.sidebar.opened =false
      state.sidebar.withoutAnimation = withoutAnimation
},
    //修改设备
    TOGGLE_DEVICE:(state,device)=>{
      state.device = device
},
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    }
  },
  actions:{
    ToggleSidebar:({commit})=>{
      commit('TOGGLE_SIDEBAR')
    },
    CloseSidebar:({commit},{withoutAnimation}) => {
      commit('CLOSE_SIDEBAR',withoutAnimation)
    },
    ToggleDevice:({commit},device) => {
      commit('TOGGLE_DEVICE',device)
    }
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }

}
export default app
