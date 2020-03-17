import request from '@/utils/request'

// 保存
export function save(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data
  })
}
// 删除
export function batchDelete(data) {
  return request({
    url: '/menu/delete',
    method: 'post',
    data
  })
}
// 查找导航菜单树
export function findNavTree(params) {
  return request({
    url: '/menu/findNavTree',
    method: 'get',
    params
  })
}
// 查找导航菜单树
export function findMenuTree() {
  return request({
    url: '/menu/findMenuTree',
    method: 'get'
  })
}


export default { save, batchDelete, findMenuTree, findNavTree }


