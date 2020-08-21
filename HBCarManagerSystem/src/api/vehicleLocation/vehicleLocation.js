import request from '@/utils/request'
import {findTree} from "@/api/system/dept";


// 查询全部
export function findAll() {
  return request({
    url: '/api/vehicleLocation/findAll',
    timeout:25000,
    method: 'get'
  })
}


//分页查询
export function findPage(data) {
  return request({
    url: '/api/vehicleLocation/findPage',
    method: 'post',
    data
  })
}

// 删除
export function batchDelete(data){
  return request({
    url: '/api/vehicleLocation/delete',
    method: 'post',
    data
  })
}

// 保存
export function save(data) {
  return request({
    url: '/api/vehicleLocation/save',
    method: 'post',
    data
  })
}
export default { findAll,findPage,save,batchDelete }
