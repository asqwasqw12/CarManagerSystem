import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

// 保存
export function save(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

//删除
export function batchDelete(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

//分页查询
export function findPage(data) {
  return request({
    url: '/user/findPage',
    method: 'post',
    data
  })
}

// 导出Excel用户信息
export function exportUserExcelFile(data) {
  return request({
    url: '/user/exportUserExcelFile',
    method: 'post',
    data
  })
}

// 查找用户的菜单权限标识集合
export function findPermissions(params) {
  return request({
    url: '/user/findPermissions',
    method: 'get',
    params
  })
}

// 根据用户名查找
export function findByName(params) {
  return request({
    url: '/user/findByName',
    method: 'get',
    params
  })
}
// 更新用户密码
export function updatePassword(params){
  return request({
    url: '/user/updatePassword',
    method: 'get',
    params
  })
}
export default { updatePassword, findByName, findPermissions, exportUserExcelFile,findPage,batchDelete,save}
