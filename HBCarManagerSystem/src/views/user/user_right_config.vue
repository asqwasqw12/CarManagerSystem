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
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;" size="mini">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName" >
          <el-input v-model="temp.realName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="部门" prop="departmentname">
          <el-input v-model="temp.departmentname" />
        </el-form-item>
        <el-form-item label="职务" prop="post">
          <el-input v-model="temp.post" />
        </el-form-item>
        <el-form-item label="公司" prop="company" >
          <el-input v-model="temp.company" :disabled="true"/>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-checkbox-group v-model="checkedRoleIds" :min="1">
            <el-checkbox v-for="role in rolesList" :label="role.roleid" :key="role.roleid">{{role.description}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="冻结用户">
          <el-checkbox v-model="forbiddenTag">冻结该用户，冻结后该用户将禁止使用该系统</el-checkbox>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination' // 二次包装 el-pagination
    export default {
      name: "user_right_config",
      components: {Pagination},
      data() {
        return {
          listQuery: {
            page: 1,            //默认第一页
            limit: 10,          //默认一页20行
            userName: undefined,  //根据用户名查询
            realName: undefined,  //根据姓名查询
            departmentname: undefined, //根据部门查询
            company: undefined,    //根据公司查询
            sort: '+regdate',       //默认注册时间排序
            status: 1                //只获取正常用户
          },
          forbiddenTag: false,  //冻结该用户
          total: 0,           //查询总行数
          list: [],           //新用户数据源
          rolesList: [],       //角色数据源
          checkedRoleIds: [],   //审核后的角色，默认选择普通用户
          modifiedRoleIds: [],   //修改后的角色
          downloadLoading: false,//下载状态
          listLoading: true,  //加载状态
          dialogFormVisible: false,  //对话框显示属性
          temp: {             //行数据临时存储
            id: '',
            userName: '',
            realName: '',
            departmentname: '',
            post: '',
            mobilephone: '',
            company: '',
            status: ''
          }
        }
      },
      created() {
        this.getList()
      },
      methods: {

        getRoleId(id) {
          let param = new URLSearchParams()
          param.append('id', JSON.stringify(id))
          request({
            url: '/api/userRole/getRoleId',
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: param
          }).then(response => {
            const data = response.data
            console.log('data=' + data.data)
            this.rolesList = data.data.rolesList
            this.checkedRoleIds = data.data.roleIdList
          }).catch(error => {
            this.$notify({
              title: '获取数据提示',
              message: error.message,
              position: 'bottom-right',
              type: 'error'
            })
          })
        },
        edit(row) {
          this.getRoleId(row.id)        //获取所有角色
          this.temp = Object.assign({}, row) //复制所在行数据
          this.forbiddenTag = false
          console.log('forbiddenTag='+this.forbiddenTag)
          this.dialogFormVisible = true     //显示对话框
        },
        updateData() {
          this.dialogFormVisible = false
          if (!this.forbiddenTag) {
            let param = new URLSearchParams()
            this.temp.status = '1'    //将用户状态由新用户改为正常
            let roleIds = this.checkedRoleIds.join(",")  //将数组转换为字符串
            let userInfo = JSON.stringify(this.temp)
            param.append('userInfo', userInfo)
            param.append('roleIds', roleIds)
            request({
              url: '/api/userRole/updateUserRole',
              method: 'post',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: param
            }).then(response => {

              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          } else {
            this.rejectApplication(this.temp)
          }

        },
        rejectApplication(row) {
          let str = '确定冻结用户 ' + row.userName + ' 吗？'
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            row.status = 2  //将该用户设置成禁用状态
            let userInfo = row
            request({
              url: '/api/rejectUserAppliction',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: userInfo
            }).then(response => {
              this.$message({
                type: 'success',
                message: '已禁用该用户!'
              });
              this.getList()
            })
          })
        },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleDownload() {

      },
      getList() {
        this.listLoading = true
        request({
          url: '/api/getUserInfoList',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: this.listQuery                             //携带数据发送请求到后台
        }).then(response => {
          this.listLoading = false
          const data = response.data
          if (data.info.code === '0') {
            this.list = data.data.userInfo
            this.total = data.data.total
          } else {
            this.$message.error(data.info.msg)
          }
        }).catch(error => {
          this.listLoading = false
          this.$notify({
            title: '获取数据提示',
            message: error.message,
            position: 'bottom-right',
            type: 'error'
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
      getSortClass: function (key) {
        const sort = this.listQuery.sort
        return sort === `+${key}`
          ? 'ascending'
          : sort === `-${key}`
            ? 'descending'
            : ''
      },
      pageIndex(index) {
        return (this.listQuery.page - 1) * (this.listQuery.limit) + index + 1
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
