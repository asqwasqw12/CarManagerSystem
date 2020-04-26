<template>
  <div class="app-container" >
    <el-row :gutter="20">
      <!--侧边部门数据栏-->
      <el-col :xs="9" :sm="6"  :md="4" :lg="4" :xl="4">
        <!--工具栏-->
        <div class="head-container">
          <el-input
            v-model="queryParams.name"
            clearable
            size="small"
            placeHolder="输入用户名搜索"
            prefix-icon="filter-item"
            />
        </div>
        <!--部门数据-->
        <el-tree
          :data="deptData"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
          />
      </el-col>
      <!--用户数据栏-->
      <el-col :xs="15" :sm="18"  :md="20" :lg="20" :xl="20">
        <!--左工具栏-->
        <div class="head-container" style="float:left;">
          <!--用户名搜索框-->
          <el-input
            v-model="queryParams.realName"
            clearable
            size="small"
            style="width: 200px;"
            placeHolder="输入姓名搜索"
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
          <!--用户状态栏-->
          <el-select
            v-model="queryParams.status"
            clearable
            size="small"
            placeholder="用户状态"
            class="filter-item"
            style="width:120px"
            @change="findPage()"
            >
            <el-option v-for="item in statusOptions" :key="item.id " :value="item.id" :label="item.name">
            </el-option>
          </el-select>
          <kt-button icon="el-icon-search"  perms="sys:role:view" type="success" @click="findPage">搜索</kt-button>
          <kt-button icon="el-icon-plus"  perms="sys:user:add" type="primary" @click="saveUser" >新增</kt-button>
        </div>
        <!--右工具栏-->
        <div class="head-container" style="float: right">
          <el-form :inline="true" size="mini">
            <el-form-item>
              <el-button-group>
                <el-tooltip content="刷新" placement="top">
                  <el-button icon="fa fa-refresh" @click="findPage(null)" size="small"></el-button>
                </el-tooltip>
                <el-tooltip content="列显示" placement="top">
                  <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog" size="small"></el-button>
                </el-tooltip>
                <el-tooltip content="导出" placement="top">
                  <el-button icon="fa fa-file-excel-o" @click="exportUserExcelFile" size="small"></el-button>
                </el-tooltip>
              </el-button-group>
            </el-form-item>
          </el-form>
        </div>
        <kt-table perms-edit="sys:user:edit" perms-delete="sys:user:delete"
          :data="pageResult.content" :columns="filterColumns"
                  :loading="loading"
          @handleEdit="handleEdit" @handleDelete="handleDelete">
        </kt-table>
        <pagination v-show="pageResult.totalSize>0" :total="pageResult.totalSize" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
      </el-col>



    </el-row>

  </div>
</template>

<script>
    import {findTree} from "@/api/system/dept";
    import KtButton from "@/views/core/KtButton"
    import KtTable from "@/views/core/KtTable";
    import {findAll} from "@/api/system/role";
    import {findPage} from "@/api/system/user";
    import pagination from  "@/components/Pagination"
    export default {
        name: "user",
      components:{KtTable, KtButton,pagination},
      data(){
          return {
            deptName:'',
            deptData:[],
            defaultProps:{
              children:'children',
              label:'name'
            },
            queryParams:{
              name:'',        //根据用户名查询
              realName:'',    //根据真实姓名查询
              status:'',      //根据用户状态查询
              createTime:[],   //根据注册日期查询
              deptId:0        //根据部门id查询
            },
            pageRequest:{
              pageNum:1,
              pageSize:10,
              params:[],
              objectParam:{}
            },
            pageResult:{
              totalSize:0,  //总行数
              totalPages:0, //总页数
              content:[]    //查询后的用户信息列表
            },
            loading:false,
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            statusOptions:[
              {
                id:'0',
                name:'禁用'
              },
              {
                id:'1',
                name:'正常'
              },
              {
                id:'2',
                name:'新用户'
              }
            ]
          }
      },
      mounted(){
        this.findDeptTree()
        this.initColumns()
        this.findPage()
      },
      methods:{
        // 获取部门列表
        findDeptTree() {
          findTree().then( res => {
            this.deptData = res.data
          })
        },
        //切换部门
        handleNodeClick(data){
              this.queryParams.deptId = data.id
              this.findPage()
        },
        //查询用户列表
        findPage(){
            this.listLoading = true
            this.getPageRequest()
          this.pageRequest.objectParam = this.queryParams
            findPage(this.pageRequest).then(response => {
              this.listLoading = false
              if (response.msg === 'ok') {
                this.pageResult = response.data
                this.findUserRoles()
              } else {
                this.$notify({
                  title: '提示',
                  type: 'error',
                  message:response.msg,
                  duration: 1500
                })
              }
            }).catch(error =>{
              this.listLoading = false
              this.$notify({
                title:'获取数据提示',
                message:error.message,
                position:'bottom-right',
                type:'error'
              })
            })
        },

        //获取查询参数
        getPageRequest(){
          this.pageRequest.params=[
            {
              name:'name',
              value:this.queryParams.name
            },
            {
              name:'realName',
              value:this.queryParams.realName
            },
            {
              name:'status',
              value:this.queryParams.status
            },
            /*{
              name:'creatTime',
              value:this.queryParams.creatTime
            },*/
            {
              name:'deptId',
              value:this.queryParams.deptId
            }
          ]
        },
        // 加载所有用户角色信息
        findUserRoles() {
          findAll().then((res) => {
            // 加载角色集合
            this.rolesList = res.data
          })
        },

        //新增用户列表
        saveUser(){

        },

        //表格列属性选择对话框
        displayFilterColumnsDialog(){

        },
         //导出用户数据
        exportUserExcelFile(){

        },

        //表格编辑按钮函数
        handleEdit(){

        },

        //表格删除按钮函数
        handleDelete(){

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
      }
    }
</script>

<style scoped>

</style>
