import request from '@/utils/request'

export function getDicts() {
  return request({
    url: '/api/dict/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/dict',
    method: 'post',
    data
  })
}

// 删除
export function batchDelete(data){
  return request({
    url: '/api/dict/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/api/dict',
    method: 'put',
    data
  })
}

//分页查询
export function findPage(data) {
  return request({
    url: '/api/dict/findPage',
    method: 'post',
    data
  })
}

export default { add, edit, batchDelete ,findPage }
