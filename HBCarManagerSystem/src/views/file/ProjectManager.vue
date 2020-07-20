<template>
  <div class="file-wrapper">
    <el-container class="el-container">
      <el-aside width="auto">
        <AsideMenu :data="treeData"></AsideMenu>
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
            <kt-button icon="el-icon-upload2"  perms="file:list:add" type="primary" @click="uploadFile()" >文件上传</kt-button>
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
          <!--表格树内容栏-->
          <el-table :data="tableData" stripe size="mini" style="width: 100%;" row-key="id"
                    v-loading="tableLoading" rowKey="id" element-loading-text="加载中。。。">
            <el-table-column
              prop="id" header-align="center" align="center" :width="setWidth('id')" :label="setLabel('id')" v-if="includeColumn('id')">
            </el-table-column>
            <el-table-column
              prop="name" header-align="center" align="center" treeKey="id" :width="setWidth('name')" :label="setLabel('name')" v-if="includeColumn('name')" >
            </el-table-column>
            <el-table-column
              prop="extendName" header-align="center" align="center" :width="setWidth('extendName')" :label="setLabel('extendName')"  v-if="includeColumn('extendName')">
            </el-table-column>
            <el-table-column
              prop="frontPath" header-align="center" align="center" :label="setLabel('frontPath')"  :width="setWidth('frontPath')" v-if="includeColumn('frontPath')">
            </el-table-column>
            <el-table-column
              prop="size" header-align="center" align="center" :label="setLabel('size')"  :width="setWidth('size')" v-if="includeColumn('size')">
            </el-table-column>
            <el-table-column
              prop="createBy" header-align="center" align="center" :label="setLabel('createBy')" :width="setWidth('createBy')" v-if="includeColumn('createBy')">
            </el-table-column>
            <el-table-column
              prop="createTime" header-align="center" align="center" :label="setLabel('createTime')" :formatter="dateFormat" :width="setWidth('createBy')" v-if="includeColumn('createTime')">
            </el-table-column>
            <el-table-column
              fixed="right" header-align="center" align="center" width="185" label="操作">
              <template slot-scope="scope">
                <kt-button icon="fa fa-edit" perms="file:list:edit" :size="size" @click="handleEdit(scope.$index, scope.row)" style="margin:auto 0;"></kt-button>
                <kt-button icon="fa fa-trash" perms="file:list:delete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin:auto 0;" ></kt-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog v-dialogDrag :title="'上传文件'" width="500px" :visible.sync="uploadDialogVisible" :close-on-click-modal="false">
            <el-form ref="form" :model="form" size="small" label-width="100px" :rules="rules">
              <el-form-item label="文件名" style="width:400px;">
                <el-input v-model="form.name"  />
              </el-form-item>
              <el-form-item prop="parentId"  label="上级文件夹:" style="width:400px;">
                <treeselect
                  v-model="form.parentId"
                  :options="treeSelectData"
                  placeholder="选择文件夹"
                  @select="selectFun"
                />
              </el-form-item>
              <!--   上传文件   -->
              <el-form-item  label="上传" style="text-align: left;">
                <el-upload
                  ref="upload"
                  :limit="1"
                  :before-upload="beforeUpload"
                  :auto-upload="false"
                  :headers="headers"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :action="uploadFileApi+ '?name=' + form.name+'&parentId=' + form.parentId"
                >
                  <div class="upload-button"><i class="el-icon-upload" /> 添加文件</div>
                  <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="uploadDialogVisible = false">取消</el-button>
              <el-button :size="size" type="primary" @click.native="submitUploadForm" :loading="uploadLoading">确定</el-button>
            </div>
          </el-dialog>
          <el-dialog v-dialogDrag :title="operation ? '新增文件夹':'编辑文件'" width="500px" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="temp" label-width="100px"   ref="temp"  :rules="rules" :size="size"
                     label-position="right">
              <el-form-item prop="name"  label="名称:" >
                <el-input v-model="temp.name" placeholder="请输入文件夹名称"></el-input>
              </el-form-item>
              <el-form-item prop="parentId"  label="上级文件夹:" >
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
    import {batchDeleteFile, getFileList, save} from "@/api/file/file";
    import {format} from "@/utils/datetime";
    import store from '@/store'
    import { mapGetters } from 'vuex'
    import Cookies from "js-cookie";
    export default {
        name: "ProjectManager",
      components: {AsideMenu,TableColumnFilterDialog,KtButton,Treeselect},
      data(){
        let validateName = (rule, value, callback) => {
          const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
          if (value.length === 0) {
            callback(new Error('请输入文件或文件夹名称'))
          } else if (!reg.test(value)) {
            callback(new Error('请由汉字字母数字下划线自由组合'))
          } else {
            callback()
          }
        }
          return{
            queryParams: {
              name:''     //文件名称
            },
            dialogVisible:false,  //编辑新增对话框显示属性
            uploadDialogVisible:false,    //上传对话框显示属性
            form:{
              id: 0,
              name: '',
              parentId: 34,
              frontPath: '',
              isShare:1,
              userId:'',
              isDir:0,
              type:"文件"
            },
            size:'small',     //按钮尺寸
            temp:{            //行数据
              id: 0,
              name: '',
              parentId: 34,
              frontPath: '',
              isShare:1,
              userId:'',
              isDir:1,
              type:"文件夹"
            },
            treeSelectData:[] , //Treeselect数据源
            tableData:[],   //el-table数据源
            treeData:[],   //el-tree数据源
            tableLoading:false,        //表格加载状态
            editLoading:false,   //对话框提交按钮加载状态
            uploadLoading:false,    //上传框提交按钮加载状
            headers: { 'Authorization':store.getters.token },
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            operation:true,   //选择编辑或者新增对话框
            rules: {
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  validator:validateName
                }
              ]
            },
          }
      },
      computed:{
        ...mapGetters([
          'userInfo',
          'uploadFileApi',
          'updateAvatarApi'
        ]),
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
          console.log("userInfo="+this.userInfo)
          this.temp = {
            id: 0,
            name: '',
            parentId: 34,
            frontPath: '',
            isShare:1,
            isDir:1,
            userId:this.userInfo.id,
            type:"文件夹"
          }
        },
        //文件上传
        uploadFile(){
          this.uploadDialogVisible = true
        },
        //查找文件树
        findTreeData(name) {
          this.tableLoading = true
          return new Promise((resolve,reject) => {
            getFileList({'name':name}).then(res => {
              this.tableLoading = false
              this.tableData = res.data
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
            //如果存在子树并且子树中包含文件夹，则继续查找
            if (record.children.length > 0 && record.children.some( item =>
              item.isDir === 1
            ) ) {
              tmp.children = this.filterFileTree(record.children)
            }
            //如果是文件夹，则保存
              if(record.isDir === 1){
                res.push(tmp)
              }
          })
          return res
        },
        //获取el-tree对象

        //刷新数据
        refreshTreeData(){
          this.findTreeData('').then( result =>{
            this.treeSelectData = this.filterFileTree(result)
            this.treeData = result
          })
        },
        //表格列属性选择对话框
        displayFilterColumnsDialog() {
          this.$refs.tableColumnFilterDialog.setDialogVisible(true)
          this.$nextTick(() => {
            this.$refs.tableColumnFilterDialog.addRow()
          })
        },
        selectFun(){

        },
        //表格编辑按钮
        handleEdit(index, row) {
          this.dialogVisible = true
          this.operation = false
          Object.assign(this.temp, row)
        },
        //表格删除按钮
        handleDelete(index, row) {
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            let params = this.getDeleteIds([], row)
            batchDeleteFile(params).then( response => {
              if(response.msg === 'ok'){
                this.$message(
                  {
                    message:'删除成功',
                    type:'success'
                  })
                this.refreshTreeData()
              }else {
                this.$message(
                  {
                    message:'操作失败',
                    type:'error'
                  })
              }
            }).catch( error =>{
              this.loading =false
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          })
        },
        // 获取删除的包含子机构的id列表
        getDeleteIds (ids, row) {
          ids.push({id:row.id})
          if(row.children != null) {
            for(let i=0, len=row.children.length; i<len; i++) {
              this.getDeleteIds(ids, row.children[i])
            }
          }
          return ids
        },
        //提交上传文件表单
        submitUploadForm(){
          this.$refs.upload.submit()
        },
        //上传之前
        beforeUpload(file) {
          let isLt2M = true
          isLt2M = file.size / 1024 / 1024 < 100
          if (!isLt2M) {
            this.loading = false
            this.$message.error('上传文件大小不能超过 100MB!')
          }
          this.form.name = file.name
          return isLt2M
        },

        //
        handleSuccess(response, file, fileList) {
          /*this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.$refs.upload.clearFiles()
          this.crud.status.add = CRUD.STATUS.NORMAL
          this.crud.resetForm()
          this.crud.toQuery()*/
          this.$message({ message: '操作成功', type: 'success' })
          //this.$refs.upload.clearFiles()
          this.uploadDialogVisible = false
        },
        // 监听上传失败
        handleError(e, file, fileList) {
          const msg = JSON.parse(e.message)
          this.$notify({
            title: msg.message,
            type: 'error',
            duration: 2500
          })
          this.uploadDialogVisible = false
        },

        //提交文件数据表单
        submitForm() {
          this.$refs.temp.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗?', '提示', {}).then(() => {
                this.editLoading = true
                let params = Object.assign({}, this.temp)
                save(params).then((response) => {
                  this.editLoading = false
                  if(response.msg === 'ok') {
                    this.$message({ message: '操作成功', type: 'success' })
                    this.dialogVisible = false
                    this.refreshTreeData()
                  } else {
                    this.$message({message: '操作失败, ' + response.msg, type: 'error'})
                  }
                }).catch( error =>{
                  this.editLoading =false
                  this.$notify({
                    title:'操作提示',
                    message:error.message,
                    duration: 2000,
                    type:'error'
                  })
                })
              })
            }
          })
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
        //判断是否显示列
        includeColumn(prop){
          return this.filterColumns.some(item =>{
            return item.prop === prop
          })
        },
        //设置列宽度
        setWidth(prop){
          let width = 80
          this.filterColumns.forEach( item => {
            if(item.prop === prop){
              width = item.minWidth
            }
          })
          return "'minWth':"+width
        },

        //设置列名称
        setLabel(prop){
          let label='列名'
          this.filterColumns.forEach( item => {
            if(item.prop === prop){
              label = item.label
            }
          })
          return label
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index){
          return format(row[column.property])
        }
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
      .upload-button{
        border: 1px dashed #c0ccda;
        border-radius: 5px;
        height: 45px;
        line-height: 45px;
        width:300px;
      }
    }
  }
</style>
