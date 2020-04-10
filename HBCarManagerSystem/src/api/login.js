import request from '@/utils/request'

/*
 * 系统登录模块
 */

//登录
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

//退出登录
export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}

//获取用户信息
export function getInfo(token) {
  return request({
    url: '/api/getInfo',
    method: 'get',
    params: { token }
  })
}

//登录
export function register(data) {
  return request({
    url: '/api/register',
    method: 'post',
    data
  })
}
