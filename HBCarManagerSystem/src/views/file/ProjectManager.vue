<template>
  <div class="file-wrapper">
    <el-container class="el-container">
      <el-aside width="auto">
        <AsideMenu :data="tableTreeData"></AsideMenu>
      </el-aside>
      <el-container>
        <el-main class="el-main">
          <div class="head-container left" style="float:left;">
            <!--文件名称搜索框-->
            <el-input
              v-model="queryParams.name"
              clearable
              :size="size"
              style="width: 200px;"
              placeHolder="输入文件名称搜索"
              prefix-icon="filter-item"
            />
            <kt-button icon="el-icon-search"  perms="file:list:view" type="success" @click="search()">搜索</kt-button>
            <kt-button icon="el-icon-plus"  perms="file:list:add" type="primary" @click="addFolder()" >新建文件夹</kt-button>
            <kt-button icon="el-icon-plus"  perms="file:list:add" type="primary" @click="uploadFile()" >文件上传</kt-button>
          </div>
          <div class="head-container right" style="float:right;">
            <el-form :inline="true" size="mini">
              <el-form-item>
                <el-button-group>
                  <el-tooltip content="刷新" placement="top">
                    <el-button icon="fa fa-refresh" @click="refreshTreeData()" :size="size"></el-button>
                  </el-tooltip>
                  <el-tooltip content="列显示" placement="top">
                    <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog" :size="size"></el-button>
                  </el-tooltip>
                </el-button-group>
              </el-form-item>
            </el-form>
          </div>
          <el-dialog v-dialogDrag :title="operation ? '新增文件夹':'编辑文件'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="temp" label-width="100px"   ref="temp"  :rules="rules" :size="size"
                     label-position="right">
              <el-form-item prop="name"  label="名称:" >
                <el-input v-model="temp.name" placeholder="请输入文件夹名称"></el-input>
              </el-form-item>
              <el-form-item prop="parentId"  label="上级文件夹:">
                <treeselect
                  v-model="temp.parentId"
                  :options="treeSelectData"
                  placeholder="选择文件夹"
                  @select="selectFun"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
              <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
            </div>
          </el-dialog>
          <!--表格显示列界面-->
          <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" :init-columns="columns" @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import AsideMenu from "@/views/file/components/AsideMenu/AsideMenu";
    import KtButton from "@/views/core/KtButton"
    import TableColumnFilterDialog  from '@/views/core/TableColumnFilterDialog'
    import {getFileList} from "@/api/file/file";
    export default {
        name: "ProjectManager",
      components: {AsideMenu,TableColumnFilterDialog,KtButton,Treeselect},
      data(){
          return{
            queryParams: {
              name:''     //文件名称
            },
            dialogVisible:false,  //编辑新增对话框显示属性
            size:'small',     //按钮尺寸
            temp:{            //行数据
              id: 0,
              name: '',
              parentId: 34,
              frontPath: '',
              isShare:0
            },
            treeSelectData:[] , //文件数据树
            tableTreeData:[],   //文件数据表格
            tableLoading:false,        //表格加载状态
            editLoading:false,   //对话框提交按钮加载状态
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            operation:true,   //选择编辑或者新增对话框
            rules: {
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  message:'请输入文件或文件夹名称'
                }
              ]
            },
          }
      },
      mounted(){
        this.initColumns()
        this.refreshTreeData()
      },
      methods:{
        //查询
        search(){
          let name=this.queryParams.name
          this.findTreeData(name)
        },
        //新建文件夹
        addFolder(){
          this.dialogVisible = true
          this.operation = true
          this.temp = {
            id: 0,
            name: '',
            parentId: 34,
            frontPath: '',
            isShare:0
          }
        },
        //文件上传
        uplaodFile(){

        },
        //查找文件树
        findTreeData(name) {
          this.tableLoading = true
          return new Promise((resolve,reject) => {
            getFileList({'name':name}).then(res => {
              this.tableLoading = false
              this.tableTreeData = res.data
              resolve(res.data)
            }).catch( error =>{
              this.tableLoading =false
              reject(error)
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          })
        },
        //获取vue-treeselect对象
        filterFileTree(fileList) {
          const res = []
          fileList.forEach(record => {
            const tmp = {
              id: record.id,
              label: record.name,
            }
            if (record.children.length > 0) {
              tmp.children = this.filterFileTree(record.children)
            }
            res.push(tmp)
          })
          return res
        },
        //刷新数据
        refreshTreeData(){
          this.findTreeData('').then( result =>{
            this.treeSelectData = this.filterFileTree(result)
          })
        },
        //表格列属性选择对话框
        displayFilterColumnsDialog() {
          this.$refs.tableColumnFilterDialog.setDialogVisible(true)
          this.$nextTick(() => {
            this.$refs.tableColumnFilterDialog.addRow()
          })
        },
        selectFnn(){

        },
        //处理表格列过滤显示
        handleFilterColumns(data) {
          this.filterColumns = data.filterColumns
          this.$refs.tableColumnFilterDialog.setDialogVisible(false)
        },
        // 处理表格列过滤显示
        initColumns() {
          this.columns = [
            {prop: "id", label: "ID", minWidth: 50},
            {prop: "name", label: "名称", minWidth: 80},
            {prop:"extendName",label:"扩展名",minWidth:30},
            {prop: "frontPath", label: "路径", minWidth: 80},
            {prop: "size", label: "大小", minWidth: 70},
            {prop: "createBy", label: "创建人", minWidth: 120},
            {prop: "createTime", label: "创建时间", minWidth: 100}
          ]
          this.filterColumns = JSON.parse(JSON.stringify(this.columns));//深拷贝
        },
      }
    }
</script>

<style lang="scss"scoped>
  .file-wrapper {
    width: 100% !important;
    .el-container {
      .el-aside {
        border-right: solid 1px #E4E7ED;
        height: calc(100vh - 70px);
        setScrollbar: 4px;
      }
    }
    .el-main {
      padding-top: 0px !important;
      overflow: hidden;
    }
  }
</style>
