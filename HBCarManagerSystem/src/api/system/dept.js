import request from '@/utils/request'

// 查询部门数据树
export function findTree(params) {
  return request({
    url: '/api/dept/findTree',
    method: 'get',
    params
  })
}

// 根据用户名查找
export function findById(params) {
  return request({
    url: '/api/dept/findById',
    method: 'get',
    params
  })
}

// 保存
export function save(data) {
  return request({
    url: '/api/dept/save',
    method: 'post',
    data
  })
}
// 删除
export  function batchDelete(data){
  return request({
    url: '/api/dept/delete',
    method: 'post',
    data
  })
}

//导出数据
export function exportDeptExcelFile(data){
  return request({
    url: '/api/dept/exportDeptExcelFile',
    method: 'post',
    responseType:'blob',
    data
  })
}

export default { findTree,findById,save,batchDelete }
