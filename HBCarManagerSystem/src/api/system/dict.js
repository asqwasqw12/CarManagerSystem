import request from '@/utils/request'


// 保存
export function save(data) {
  return request({
    url: '/api/dict/save',
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

//分页查询
export function findPage(data) {
  return request({
    url: '/api/dict/findPage',
    method: 'post',
    data
  })
}

//导出数据
export function exportDictExcelFile(data){
  return request({
    url: '/api/dict/exportDictExcelFile',
    method: 'post',
    responseType:'blob',
    data
  })
}

export default { save, batchDelete ,findPage,exportDictExcelFile }
