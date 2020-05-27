//封装axios
import axios from 'axios'
import Cookies from "js-cookie";
import router from "@/router/routers";
 const service = axios.create({
   headers: {
     'Content-Type': 'application/json;charset=UTF-8'
   },
   timeout:5000
 });
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    let token = Cookies.get('token')
    // 发送请求时携带token
    if (token) {
      config.headers.token = token
    } else {
      // 重定向到登录页面
      router.push('/login')
    }
    return config
  },
  error => {
    // 请求发生错误时
    console.log('request:', error)
    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('timeout请求超时')
    }
    // 需要重定向到错误页面
    const errorInfo = error.response
    console.log(errorInfo)
    if (errorInfo) {
      error = errorInfo.data  // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
      const errorStatus = errorInfo.status; // 404 403 500 ...
      router.push({
        path: `/error/${errorStatus}`
      })
    }
    return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
  }
);
//添加响应拦截器
service.interceptors.response.use(response =>{
  return response.data;
},error => {
  switch (error.response.status) {
    case 400:
      error.message = '错误请求'
      break;
    case 401:
      error.message = '未授权，请重新登录'
      break;
    case 403:
      error.message = '拒绝访问,令牌可能过期'
      break;
    case 404:
      error.message = '请求错误，未找到该资源'
      break;
    case 405:
      error.message = '请求方法未允许'
      break;
    case 408:
      error.message = '请求超时'
      break;
    case 500:
      error.message = '服务器端出错'
      break;
    case 501:
      error.message = '网络未实现'
      break;
    case 502:
      error.message = '网络错误'
      break;
    case 503:
      error.message = '服务不可用'
      break;
    case 504:
      error.message = '网络超时'
      break;
    case 505:
      error.message = 'http版本不支持该请求'
          break;
    default:
      error.message = `连接错误${ error.response.status }`
  }
    return Promise.reject(error);
  });


export  default service;

