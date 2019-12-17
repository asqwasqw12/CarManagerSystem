import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const moduleFiles = require.context('./modules',false,/\.js$/ )    //三个参数：1.要搜索的文件夹目录；2.是否应该搜索它的子目录；3.匹配文件的正则表达式
                                                                    //返回值：1个函数（3个属性），resolve(函数），返回请求被解析后得到的id
                                                                    //keys(函数），返回一个数组，由所有可能被上下文模块处理的请求组成
                                                                    //id:是上下文模块里面所包含的模块id,它可能在你使用module.hot.accept的时候使用
//批量导入多个文件
const modules = moduleFiles.keys().reduce(
   (modules,modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/,'$1')
  const value = moduleFiles(modulePath)
  modules[moduleName] = value.default
  return modules
},{})
const store = new Vuex.Store({
  modules,
  getters
})

export default store
