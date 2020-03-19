import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
import permission from "@/store/modules/permission";

const { tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings
const settings ={
state : {
  theme: variables.theme,
  showSettings: false,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  uniqueOpened: uniqueOpened,
  showFooter: showFooter,
  footerTxt: footerTxt,
  caseNumber: caseNumber
},

 mutations:{
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
},

actions :{
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}
}
export default settings

