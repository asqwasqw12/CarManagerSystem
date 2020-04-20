import request from '@/utils/request'

// 查询机构树
export function findTree() {
  return request({
    url: '/api/dept/findTree',
    method: 'get'
  })
}

export default { findTree }
