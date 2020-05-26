<template>
  <div class="app-container">
    <!--左工具栏-->
    <div class="head-container left" style="float:left;">
      <el-input
        v-model="queryParams.name"
        clearable
        :size="size"
        style="width: 200px;"
        placeHolder="输入字典名称搜索"
        prefix-icon="filter-item"
      />
      <!--注册时间搜索框-->
      <el-date-picker
        v-model="queryParams.createTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        style="width:220px;"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <kt-button icon="el-icon-search"  perms="sys:log:view" type="success" @click="search()">搜索</kt-button>
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
    <kt-table  :data="pageResult.content" :columns="filterColumns"
               :loading="tableLoading"
               :show-operation="showOperation" >
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
  import TableColumnFilterDialog from "@/views/core/TableColumnFilterDialog";
  import {downloadFile} from "@/utils";
  export default {
    name: "SysLog",
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
        tableData:[],     //菜单表格数据
        columns:[],       //表格所有列属性
        filterColumns:[], //过滤后显示列属性
        showOperation:false, //不显示操作列
        queryParams:{
          name:'',     //根据名称查询
          createTime:[],   //根据日期查询
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
        }
      }
    },
    methods:{
      //搜索按钮函数
      search(){
        this.findPage()
      },
      //刷新函数
      refreshTreeData(){
        this.findPage()
      },
      //查询日志列表
      findPage(){
        this.tableLoading = true
        this.pageRequest.objectParam = Object.assign({},this.queryParams)
        //在status未选中状态，传递给后端的status参数改为-1，以此查询所有状态的用户
        if(this.pageRequest.objectParam.status  === "" && this.pageRequest.objectParam.status  !== 0  ){
          this.pageRequest.objectParam.status =-1
        }
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
      //导出日志数据
      exportLogExcelFile(){
        this.exportLoading =true
        let temp = Object.assign({},this.pageRequest)
        temp.objectParam = Object.assign({},this.queryParams)
        temp.pageSize = 0   //不分页
        //在status未选中状态，传递给后端的status参数改为-1，以此查询所有状态的用户
        if(temp.objectParam.status  === "" && temp.objectParam.status  !== 0  ){
          temp.objectParam.status =-1
        }
        exportLogExcelFile(temp).then( (response) => {
          this.exportLoading = false
          let a =  Math.floor(Math.random()*100)+"用户数据"
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
      // 处理表格列过滤显示
      initColumns() {
        this.columns = [
          {prop:"id", label:"ID", minWidth:50},
          {prop:"name", label:"用户名", minWidth:80},
          {prop:"realName", label:"姓名", minWidth:80},
          {prop:"deptName", label:"机构", minWidth:120},
          {prop:"roleNames", label:"角色", minWidth:100},
          /*{prop:"email", label:"邮箱", minWidth:120},*/
          {prop:"mobile", label:"手机", minWidth:100},
          {prop:"status", label:"状态", minWidth:70},
          {prop:"createTime",label:"注册时间",minWidth:100 }
          // {prop:"createBy", label:"创建人", minWidth:120},
          // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
          // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
          // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ]
        this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
