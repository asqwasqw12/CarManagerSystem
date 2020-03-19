import app from "@/store/modules/app";

const iframe = {
    state: {
      iframeUrl: [],   // 当前嵌套页面路由路径
      iframeUrls: []   // 所有嵌套页面路由路径访问URL
    },
    mutations: {
      setIFrameUrl(state, iframeUrl) {  // 设置iframeUrl
        state.iframeUrl = iframeUrl
      },
      addIFrameUrl(state, iframeUrl) {  // iframeUrls
        state.iframeUrls.push(iframeUrl)
      }
    },
    actions: {}
  }
export default iframe
