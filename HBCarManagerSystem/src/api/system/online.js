import request from '@/utils/request'

//分页查询
export function findPage(data) {
  return request({
    url: '/api/online/findPage',
    method: 'post',
    data
  })
}

//导出数据
export function exportOnlineExcelFile(data){
  return request({
    url: '/api/online/exportOnlineExcelFile',
    method: 'post',
    responseType:'blob',
    data
  })
}

export default { findPage,exportOnlineExcelFile }
