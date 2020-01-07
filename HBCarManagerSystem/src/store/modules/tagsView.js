//标签导航,包含属性为访问的页面，缓存页面，包含方法为增加页面、关闭页面、关闭其他页面、关闭所有页面
const tagsView = {
  state:{
    visitedViews:[],    //记录用户访问过的页面.对象属性包含{name:'',path:'',title:''}
    cachedViews:[]          //实际上就是keep-alive的路由，可以在配置路由的时候通过meta.noCache来设置是否需要缓存，默认都缓存,对象属性只有路由名字
  },
  mutations:{
    ADD_VISITED_VIEW:(state,view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(
        Object.assign({},view,{title:view.meta.title || 'no-name'})
       /* {name: view.name,
        path: view.fullPath,
        title: view.meta.title || 'no-name'}*/
      )
    },
    ADD_CACHED_VIEW:(state,view) =>{
      if(state.cachedViews.includes(view.name)) return
      if(!view.meta.noCache){
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEW:(state,view) => {
      for (const [i, v] of state.visitedViews.entries()) {      //i为index,v为当前值，entries()方法将数组转换为可迭代的对象
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)                    //删除当前元素
          break
        }
      }
    },
    DEL_CACHED_VIEW:(state,view) => {
      for(const i of state.cachedViews){
        if(i === view.name){
          const index = state.cachedViews.indexOf(i)
          index > -1 && state.cachedViews.splice(index,1)       //如果存在则删除当前元素
          break
        }
      }
    },
    DEL_OTHERS_VIEWS:(state,view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      /*state.visitedViews = state.visitedViews.filter( v =>{
        return v.meta.affix || v.path === view.path
      })*/
    },
    DEL_OTHERS_CACHED_VIEWS:(state,view) =>{
      const index = state.cachedViews.indexOf(view.name)
      if(index>-1){
        state.cachedViews = state.cachedViews.slice(index,index+1)
      }else{
        state.cachedViews = []
      }

      /*for(const i of state.cachedViews){
        if(i === view.name){
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index,index+1)
          break
        }
      }*/
    },
    DEL_ALL_VISITED_VIEWS:(state) =>{
      state.visitedViews = []
    },
    DEL_ALL_CACHED_VIEWS:(state) =>{
      state.cachedViews = []
    },
    UPDATE_VISITED_VIEW:(state,view) => {
      for ( let v of state.visitedViews){
        if(v.path === view.path){
          v = Object.assign(v,view)
          break
        }
      }
    }
  },
  actions:{
    addView({dispatch},view ){
      dispatch('addVisitedView',view)
      dispatch('addCachedView',view)
    },
    addVisitedView({commit},view){
      commit('ADD_VISITED_VIEW',view)
    },
    addCachedView({commit},view){
      commit('ADD_CACHED_VIEW',view)
    },
    delView({dispatch,state},view){
      return new Promise( resolve =>{
        dispatch('delVisitedView',view)
        dispatch('delCachedView',view)
        resolve({
          visitedViews:[...state.visitedViews],
          cachedViews:[...state.cachedViews]
        })
      })
    },
    delVisitedView({commit,state},view){
      return new Promise( (resolve) => {
        commit('DEL_VISITED_VIEW',view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView({commit,state},view){
      return new Promise( (resolve) =>{
        commit('DEL_CACHED_VIEW',view)
        resolve([...state.visitedViews])
      })
    },

  delOthersViews({dispatch,state},view){
      return new Promise( (resolve) => {
        dispatch('delOthersVisitedViews',view)
        dispatch('delOthersCachedViews',view)
        resolve({
          visitedViews:[...state.visitedViews],
          cachedViews:[...state.cachedViews]
        })
      })
  },
    delOthersVisitedViews({commit,state},view){
      return new Promise(resolve =>{
        commit('DEL_OTHERS_VISITED_VIEWS',view)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews({commit,state},view){
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS',view)
        resolve([...state.cachedViews])
      })
    },


    delAllViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view)
        dispatch('delAllCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },

    updateVisitedView({ commit }, view) {
      commit('UPDATE_VISITED_VIEW', view)
    }
  }
}

export default tagsView
