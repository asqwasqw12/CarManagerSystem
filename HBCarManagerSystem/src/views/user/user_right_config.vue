<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.realName" placeholder="姓名" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.departmentname" placeholder="部门" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.company" placeholder="公司" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
      <el-table-column type="index"  header-align="center" align="center" width="60" label="序号" :index="pageIndex">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        width="120"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        width="100"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        width="60"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="departmentname"
        header-align="center"
        align="center"
        width="120"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="post"
        header-align="center"
        align="center"
        width="120"
        label="职务">
      </el-table-column>
      <el-table-column
        prop="mobilephone"
        header-align="center"
        align="center"
        width="120"
        label="电话">
      </el-table-column>
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          width="180"
          label="公司">
        </el-table-column>
      <el-table-column
        prop="regdate"
        header-align="center"
        align="center"
        width="180"
        sortable="custom"
        label="注册时间"
        :class-name="getSortClass('regdate')">
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="edit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination' // 二次包装 el-pagination
    export default {
        name: "user_right_config",
      components:{ Pagination },
       data(){
          return{
            listQuery: {
              page: 1,            //默认第一页
              limit: 10,          //默认一页20行
              userName: undefined,  //根据用户名查询
              realName: undefined,  //根据姓名查询
              departmentname:undefined, //根据部门查询
              company:undefined,    //根据公司查询
              sort:'+regdate',       //默认注册时间排序
              status:1                //只获取正常用户
            },
            total: 0,           //查询总行数
            list: [],           //新用户数据源
            rolesList:[],       //角色数据源
            modifiedRoleIds:[],   //修改后的角色
            downloadLoading:false,//下载状态
            listLoading: true,  //加载状态
            dialogFormVisible: false,  //对话框显示属性
            temp:{             //行数据临时存储
              id:'',
              userName:'',
              realName:'',
              departmentname:'',
              post:'',
              mobilephone:'',
              company:'',
              status:''
            }
          }
      },
      created() {
        this.getList()
      },
      methods: {
        forbidden(row) {

        },
        edit(row) {

        },
        handleFilter() {
          this.listQuery.page = 1
          this.getList()
        },
        handleDownload(){

        },
        getList(){
          this.listLoading = true
          request({
            url: '/api/getUserInfoList',
            method: 'post',
            headers:{
              'Content-Type':'application/json'
            },
            data:this.listQuery                             //携带数据发送请求到后台
          }).then(response => {
            this.listLoading = false
            const data = response.data
            if (data.info.code === '0') {
              this.list = data.data.userInfo
              this.total = data.data.total
            } else {
              this.$message.error(data.info.msg)
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
        sortChange(data) {
          const {prop, order} = data
          if (prop === 'regdate') {
            if (order === 'ascending') {
              this.listQuery.sort = '+regdate'
            } else {
              this.listQuery.sort = '-regdate'
            }
            this.handleFilter()
          }
        },
        getSortClass: function(key) {
          const sort = this.listQuery.sort
          return sort === `+${key}`
            ? 'ascending'
            : sort === `-${key}`
              ? 'descending'
              : ''
        },
        pageIndex(index){
          return (this.listQuery.page-1)*(this.listQuery.limit)+index+1
        }
      }
    }
</script>

<style scoped>
.filter-container{
  margin-left: 20px;
  width:800px;
  text-align:left;
 /* position: fixed;
  top: 0;
  right: 0;
  z-index: 9;*/
}
</style>
