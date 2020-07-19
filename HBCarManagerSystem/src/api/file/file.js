import request from '@/utils/request'

//获取文件列表
export function getFileList(params){
  return request({
    url:'/api/file/findTree',
    method:'get',
    params
  })
}



//获取存储占用
export function getStorage(params){
  return request({
    url:'/api/file/getStorage',
    method:'get',
    params
  })
}

// 通过文件类型选择文件
export function selectFileByFileType(params){
  return request({
    url:'/api/file/selectFileByFileType',
    method:'get',
    params
  })
}

//下载文件
export function downloadFile(params){
  return request({
    url:'/api/fileTransfer/downloadFile',
    method:'get',
    params
  })
}

//获取文件的树结构
export function getFileTree(params){
  return request({
    url:'/api/file/getFileTree',
    method:'get',
    params
  })
}



//解压文件
export function unzipFile(data){
  return request({
    url:'/api/file/unzipFile',
    method:'post',
    data
  })
}

//删除文件
export function deleteFile(data){
  return request({
    url:'/api/file/deleteFile',
    method:'post',
    data
  })
}

//批量删除文件
export function batchDeleteFile(data) {
  return request({
    url:'/api/file/batchDeleteFile',
    method:'post',
    data
  })

}

//移动文件
export function moveFile(data){
  return request({
    url:'/api/file/moveFile',
    method:'post',
    data
  })
}

//批量移动文件
export function batchMoveFile(data){
  return request({
    url:'/api/file/batchMoveFile',
    method:'post',
    data
  })
}

//创建文件
export function createFile(data){
  return request({
    url:'/api/file/createFile',
    method:'post',
    data
  })
}


export default { createFile,batchMoveFile,moveFile,batchDeleteFile,deleteFile,unzipFile,getFileTree,downloadFile,selectFileByFileType,getStorage,getFileList }
