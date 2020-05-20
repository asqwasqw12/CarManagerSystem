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
      <kt-button icon="el-icon-plus"  perms="sys:dict:add" type="primary" @click="addDept" >新增</kt-button>
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
    <!--表格树内容栏-->
    <!--<el-table :data="tableData" stripe size="mini" style="width: 100%;" row-key="id"
              v-loading="tableLoading" rowKey="id" element-loading-text="加载中。。。">
      <el-table-column
      prop="id" header-align="center" align="center" :width="setWidth('id')" :label="setLabel('id')" v-if="includeColumn('id')">
      </el-table-column>
      <el-table-column
        prop="label" header-align="center" align="center" :width="setWidth('label')" :label="setLabel('label')" v-if="includeColumn('label')" >
      </el-table-column>
      <el-table-column prop="value" header-align="center" align="center" :width="setWidth('value')" :label="setLabel('value')" v-if="includeColumn('value')">
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center"  :width="setWidth('type')" :label="setLabel('type')" v-if="includeColumn('type')">
      </el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" :show-overflow-tooltip="true" :width="setWidth('sort')" :label="setLabel('sort')" v-if="includeColumn('sort')">
      </el-table-column>
      <el-table-column prop="description" header-align="center" align="center"  :width="setWidth('description')" :label="setLabel('description')" v-if="includeColumn('description')">
      </el-table-column>
      <el-table-column prop="remarks" header-align="center" align="center"  :width="setWidth('remarks')" :label="setLabel('remarks')" v-if="includeColumn('remarks')">
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" label="操作">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" perms="sys:dept:edit" :size="size" @click="handleEdit(scope.$index, scope.row)" style="margin:auto 0;"></kt-button>
          <kt-button icon="fa fa-trash" perms="sys:dept:delete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin:auto 0;" ></kt-button>
        </template>
      </el-table-column>
    </el-table>-->
    <kt-table perms-edit="sys:user:edit" perms-delete="sys:user:delete"
              :data="pageResult.content" :columns="filterColumns"
              :loading="tableLoading"
              @handleEdit="handleEdit" @handleDelete="handleDelete" >
    </kt-table>
    <pagination v-show="pageResult.totalSize>0" :total="pageResult.totalSize" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
    <!--表格显示列界面-->
    <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns"  @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
  </div>
</template>

<script>
  import KtButton  from '@/views/core/KtButton'
  import KtTable from "@/views/core/KtTable"
  import pagination from  "@/components/Pagination"
  import {batchDelete, findPage} from "@/api/system/dict";
  import TableColumnFilterDialog from "@/views/core/TableColumnFilterDialog";
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
          }
      },
      methods:{
          //搜索按钮函数
          search(){
              this.findPage()
          },

        //新增按钮函数
        addDept(){

        },

        //查询用户列表
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

        },

        //表格行编辑按钮函数
        handleEdit(){

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
            this.loading =false
          }).catch( error =>{
            this.loading =false
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
           // {prop:"remarks", label:"备注", minWidth:120},
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
