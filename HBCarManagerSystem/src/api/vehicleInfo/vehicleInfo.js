import request from '@/utils/request'


// 查询全部
export function findAll() {
  return request({
    url: '/api/vehicleInfo/findAll',
    method: 'get'
  })
}


//分页查询
export function findPage(data) {
  return request({
    url: '/api/vehicleInfo/findPage',
    method: 'post',
    data
  })
}

// 删除
export function batchDelete(data){
  return request({
    url: '/api/vehicleInfo/delete',
    method: 'post',
    data
  })
}

// 保存
export function save(data) {
  return request({
    url: '/api/vehicleInfo/save',
    method: 'post',
    data
  })
}
