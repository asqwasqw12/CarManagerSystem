import request from '@/utils/request'

// 删除
export  function batchDelete(data){
  return request({
    url: '/api/log/delete',
    method: 'post',
    data
  })
}

//分页查询
export function findPage(data) {
  return request({
    url: '/api/log/findPage',
    method: 'post',
    data
  })
}

export default { findPage,batchDelete }
