<template>
  <div class="file-list-wrapper">
    <!-- 操作按钮 -->
    <el-header class="file-list-header">
      <OperationMenu
        :operationFile="operationFile"
        :selectionFile="selectionFile"
        :filePath="filePath"
        :storageValue="storageValue"
        @showStorage="showStorage"
        @getTableDataByType="getTableDataByType"
        @setMoveFileDialogData="setMoveFileDialogData"
      ></OperationMenu>
    </el-header>
    <div class="middle-wrapper">
      <!-- 图片展示模式 -->
      <div class="change-image-model">
        <el-radio-group v-model="imageGroupLable" size="mini" @change="changeImageDisplayModel" v-show="fileType == 1">
          <el-radio-button :label="0">列表</el-radio-button>
          <el-radio-button :label="1">网格</el-radio-button>
          <el-radio-button :label="2">时间线</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <File-Table
      perms-view="sys:user:view" perms-delete="sys:user:delete"
      :data="fileList" :columns="filterColumns"
      :loading="tableLoading"
      @handleView="handleView" @handleDelete="handleDelete"
    ></File-Table>
  </div>
</template>

<script>
  import OperationMenu from './OperationMenu'
  import FileTable from './FileTable'
  import {getFileTree, selectFileByFileType} from "@/api/file/file";
  //import SelectColumn from './components/SelectColumn'
  //import FileTable from './components/FileTable'
  //import ImageModel from './components/ImageModel'
  //import MoveFileDialog from './components/MoveFileDialog'
  //import ImgReview from './components/ImgReview'

  export default {
    name: 'FileList',
    components: {
      OperationMenu,
      FileTable
    },
    data() {
      return {
        storageValue: '0KB',
        imageGroupLable:0,
        operationFile: {}, // 当前操作行
        selectionFile: [], // 勾选的文件
        dialogMoveFile: {     //  移动文件模态框数据
          isBatchMove: false,
          visible: false, //  是否可见
          fileTree: [] //  目录树
        },
        tableLoading:false,   //表格加载状态
        columns:[],       //表格所有列属性
        filterColumns:[], //过滤后显示列属性
        fileList: [], //  表格数据-文件列表
      }
    },
    computed: {
      fileType: {
        get() {
          return this.$route.query.fileType
        },
        set() {
          return 0
        }
      },
      //  当前查看的文件路径
      filePath: {
        get() {
          return this.$route.query.filePath
        },
        set() {
          return ''
        }
      },
    },
    created() {
      //this.getTableDataByType()
      //this.showStorage()
    },
    mounted() {
      this.initColumns()
    },
    methods: {
      changeImageDisplayModel() {

      },
      //  获取已占用内存
      showStorage() {
        getstorage().then(res => {
          if (res.success) {
            let size = res.data ? res.data.storagesize : 0
            const B = 1024
            const KB = Math.pow(1024, 2)
            const MB = Math.pow(1024, 3)
            const GB = Math.pow(1024, 4)
            if (!size) {
              this.storageValue = 0 + 'KB'
            } else if (size < KB) {
              this.storageValue = (size / B).toFixed(0) + 'KB'
            } else if (size < MB) {
              this.storageValue = (size / KB).toFixed(2) + 'MB'
            } else if (size < GB) {
              this.storageValue = (size / MB).toFixed(3) + 'GB'
            } else {
              this.storageValue = (size / GB).toFixed(4) + 'TB'
            }
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      },
      //表格数据获取相关事件
      getTableDataByType() {
        if (this.fileType !== '0') {
          //  分类型
          this.showFileListByType()
        } else {
          //  全部文件
          this.showFileList()
        }
      },
      //  根据文件类型展示文件列表
      showFileListByType() {
        //  分类型
        let data = {
          fileType: this.fileType
        }
        selectFileByFileType(data).then(res => {
          if (res.success) {
            this.fileList = res.data
            this.loading = false
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      },
      //  设置移动文件模态框相关数据，isBatchMove为null时是确认移动，值由之前的值而定
      setMoveFileDialogData(isBatchMove, visible) {
        this.initFileTree()
        this.dialogMoveFile.isBatchMove = isBatchMove
          ? isBatchMove
          : this.dialogMoveFile.isBatchMove
        this.dialogMoveFile.visible = visible
      },
      //  移动文件模态框：初始化文件目录树
      initFileTree() {
        getFileTree().then(res => {
          if (res.success) {
            this.dialogMoveFile.fileTree = [res.data]
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      },

      //表格查看按钮函数
      handleView(params) {

      },
      //表格删除按钮函数
      handleDelete(data) {
      },

      // 处理表格列过滤显示
      initColumns() {
        this.columns = [
          {prop:"isDir", label:"", minWidth:30},
          {prop:"fileName", label:"文件名", minWidth:120},
          {prop:"filePath", label:"文件路径", minWidth:120},
          {prop:"fileSize", label:"文件大小", minWidth:120},
          {prop:"createTime",label:"创建时间",minWidth:100 }
          // {prop:"createBy", label:"创建人", minWidth:120},
          // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
          // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
          // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ]
        this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      }
    }

  }
</script>

<style lang="scss" scoped>
  .file-list-wrapper{
    .file-list-header {
           .el-dialog-div {
             height: 200px;
             overflow: auto;
           }
         }
    .middle-wrapper{
      display:flex;
      .change-image-model{
        margin-right:20px;
        height:30px;
        line-height:30px;
      }
    }
  }
</style>
