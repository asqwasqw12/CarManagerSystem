<template>
  <div class="app-container">
  <!--左工具栏-->
  <div class="head-container left" style="float:left;">
    <el-input
      v-model="queryParams.label"
      clearable
      :size="size"
      style="width: 200px;"
      placeHolder="输入字典名称搜索"
      prefix-icon="filter-item"
    />
    <kt-button icon="el-icon-search"  perms="sys:dict:view" type="success" @click="search()">搜索</kt-button>
    <kt-button icon="el-icon-plus"  perms="sys:dict:add" type="primary" @click="addDict" >新增</kt-button>
  </div>
  <!--右工具栏-->
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
          <el-tooltip content="导出" placement="top">
            <el-button icon="fa fa-file-excel-o" @click="exportDictExcelFile" :size="size" :loading="exportLoading"></el-button>
          </el-tooltip>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
  <kt-table perms-edit="sys:user:edit" perms-delete="sys:user:delete"
            :data="pageResult.content" :columns="filterColumns"
            :loading="tableLoading"
            @handleEdit="handleEdit" @handleDelete="handleDelete" >
  </kt-table>
  <pagination v-show="pageResult.totalSize>0" :total="pageResult.totalSize" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
  <!--表格显示列界面-->
  <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns"  @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
  <el-dialog  v-dialogDrag :title="operation ? '新增字典':'编辑字典'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="temp" label-width="80px"   ref="temp"  :rules="rules" :size="size"
             style="text-align: left;">
      <el-form-item label="ID" prop="id"  v-if="false">
        <el-input v-model="temp.id" :disabled="true" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="label">
        <el-input v-model="temp.label" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="temp.value" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input v-model="temp.type" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="temp.sort" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述 " prop="description">
        <el-input v-model="temp.description" auto-complete="off" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="temp.remarks" auto-complete="off" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
      <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import KtButton  from '@/views/core/KtButton'
  import KtTable from "@/views/core/KtTable"
  import pagination from  "@/components/Pagination"
  import {batchDelete, exportDictExcelFile, findPage, save} from "@/api/system/dict";
  import TableColumnFilterDialog from "@/views/core/TableColumnFilterDialog";
  import {downloadFile} from "@/utils";
    export default {
        name: "dict",
      components:{
        KtButton,
        KtTable,
        pagination,
        TableColumnFilterDialog
      },
      data(){
          return{
            size:"small",   //默认小
            exportLoading:false, //导出按钮加载状态
            tableLoading:false,   //表格数据加载状态
            editLoading:false,    //对话框提交按钮加载状态
            dialogVisible:false,  //对话框显示状态
            tableData:[],     //菜单表格数据
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            operation:true,   //选择编辑或者新增对话框
            queryParams:{
              label:''     //根据名称查询
            },
            pageRequest:{
              pageNum:1,
              pageSize:10,
              objectParam:{}
            },
            pageResult:{
              totalSize:0,  //总行数
              totalPages:0, //总页数
              content:[]    //查询后的用户信息列表
            },
            temp:{            //行数据
              id: 0,
              label: '',
              value: '',
              type: '',
              sort: 0,
              description: '',
              remarks: ''
            },
            rules:{   //输入校验
              label: [
                {
                  required: true,
                  trigger: 'blur',
                  message:'请输入名称'
                }
              ]
            },
          }
      },
      methods:{
          //搜索按钮函数
          search(){
              this.findPage()
          },

        //新增按钮函数
        addDict(){
          this.dialogVisible=true
          this.operation = true
          this.temp= {            //行数据
            id: 0,
            label: '',
            value: '',
            type: '',
            sort: 0,
            description: '',
            remarks: ''
          }
        },

        //查询字典列表
        findPage(){
          this.tableLoading = true
          this.pageRequest.objectParam = Object.assign({},this.queryParams)
          findPage(this.pageRequest).then(response => {
            this.tableLoading = false
            if (response.msg === 'ok') {
              this.pageResult = response.data
            } else {
              this.$notify({
                title: '提示',
                type: 'error',
                message:response.msg,
                duration: 1500
              })
            }
          }).catch(error =>{
            this.tableLoading = false
            this.$notify({
              title:'获取数据提示',
              message:error.message,
              position:'bottom-right',
              type:'error'
            })
          })
        },

        //刷新函数
        refreshTreeData(){
              this.findPage()
        },

        //表格列属性选择对话框
        displayFilterColumnsDialog(){
          this.$refs.tableColumnFilterDialog.setDialogVisible(true)
          this.$nextTick(() => {
            this.$refs.tableColumnFilterDialog.addRow()
          })
        },

        //处理表格列过滤显示
        handleFilterColumns(data){
          this.filterColumns = data.filterColumns
          this.$refs.tableColumnFilterDialog.setDialogVisible(false)
        },

        //导出
        exportDictExcelFile(){
          this.exportLoading =true
          let temp = Object.assign({},this.pageRequest)
          temp.objectParam = Object.assign({},this.queryParams)
          temp.pageSize = 0   //不分页
          exportDictExcelFile(temp).then( (response) => {
            this.exportLoading = false
            let a =  Math.floor(Math.random()*100)+"字典数据"
            downloadFile(response,a,'xlsx')
          }).catch( (error) => {
            this.exportLoading = false
            this.$notify({
              title:'操作提示',
              message:error.message,
              duration: 2000,
              type:'error'
            })
          })
        },

        //表格行编辑按钮函数
        handleEdit(params){
          this.dialogVisible = true
          this.operation = false
          Object.assign(this.temp, params.row)
        },

        //提交部门数据表单
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
                    this.findPage()
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

        //表格删除按钮函数
        handleDelete(data){
          batchDelete(data.params).then( response => {
            if(response.msg === 'ok'){
              this.$message(
                {
                  message:'删除成功',
                  type:'success'
                }
              )
              this.findPage()
            }else{
              this.$message(
                {
                  message:'操作失败',
                  type:'error'
                }
              )
            }
            this.tableLoading =false
          }).catch( error =>{
            this.tableLoading =false
            this.$notify({
              title:'操作提示',
              message:error.message,
              duration: 2000,
              type:'error'
            })
          })
        },

        // 处理表格列过滤显示
        initColumns() {
          this.columns = [
            {prop:"id", label:"ID", minWidth:50},
            {prop:"label", label:"名称", minWidth:50},
            {prop:"value", label:"值", minWidth:50},
            {prop:"type", label:"类型", minWidth:50},
            {prop:"sort", label:"排序", minWidth:80},
            {prop:"description", label:"描述", minWidth:80},
            {prop:"remarks", label:"备注", minWidth:80},
           // {prop:"createBy", label:"创建人", minWidth:100},
            {prop:"createTime", label:"创建时间", minWidth:120}
          ]
          this.filterColumns = JSON.parse(JSON.stringify(this.columns));
        }
      },
      mounted() {
        this.initColumns()
        this.findPage()
      }
    }
</script>

<style scoped>

</style>
