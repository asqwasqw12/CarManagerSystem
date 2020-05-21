import request from '@/utils/request'


// 查询全部
export function findAll() {
  return request({
    url: '/api/role/findAll',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/roles',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/api/roles/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: '/api/roles/level',
    method: 'get'
  })
}


export function edit(data) {
  return request({
    url: '/api/roles',
    method: 'put',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/api/roles/menu',
    method: 'put',
    data
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
export default { findAll,add, edit, batchDelete, get, editMenu, getLevel,findPage,save }
