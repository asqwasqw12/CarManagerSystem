import request from '@/utils/request'


// 查询全部
export function findAll() {
  return request({
    url: '/api/role/findAll',
    method: 'get'
  })
}


//分页查询
export function findPage(data) {
  return request({
    url: '/api/role/findPage',
    method: 'post',
    data
  })
}

// 删除
export function batchDelete(data){
  return request({
    url: '/api/role/delete',
    method: 'post',
    data
  })
}

// 保存
export function save(data) {
  return request({
    url: '/api/role/save',
    method: 'post',
    data
  })
}

// 查询角色菜单集合
export function findRoleMenus(params)  {
  return request({
    url: '/api/role/findRoleMenus',
    method: 'get',
    params
  })
}
// 保存角色菜单集合
export function  saveRoleMenus(data) {
  return request({
    url: '/api/role/saveRoleMenus',
    method: 'post',
    data
  })
}
//导出数据
export function exportRoleExcelFile(data){
  return request({
    url: '/api/role/exportRoleExcelFile',
    method: 'post',
    responseType:'blob',
    data
  })
}

export default { findAll, batchDelete,findPage,save,findRoleMenus,saveRoleMenus,exportRoleExcelFile }
