<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      height="530"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="index"  header-align="center" align="center" width="60" label="序号">
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
        width="120"
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
        prop="regdate"
        header-align="center"
        align="center"
        width="180"
        label="注册时间">
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="passApplication(row)">
            通过
          </el-button>
          <el-button  size="mini" type="success" @click="rejectApplication(row)">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="审核新用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
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
  export default {
    name: 'new_user_check',
    data() {
      return {
        list: [],           //新用户数据源
        rolesList:[],       //角色数据源
        checkedRoleIds:[2,4],   //审核后的角色，默认选择普通用户
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
      this.getUserInfoByStatus()
    },
    methods: {
      getUserInfoByStatus() {
        this.listLoading = true
        let param = new URLSearchParams()
        param.append('status','0')
        request({
          url: '/api/getUserInfoByStatus',
          method: 'post',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data:param                              //携带数据发送请求到后台
        }).then(response => {
          this.listLoading = false
          const data = response.data
          if (data.info.code === '0') {
            this.list = data.data.userInfo
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
      getDescriptions(){
        request({
          url: '/api/role/getDescriptions',
          method: 'get',
        }).then(response => {
          const data = response.data
          console.log('data='+data.data)
          this.rolesList = data.data.rolesList
        }).catch(error =>{
          this.$notify({
            title:'获取数据提示',
            message:error.message,
            position:'bottom-right',
            type:'error'
          })
        })
      },
      updateData(){
        this.dialogFormVisible = false
        let param = new URLSearchParams()
        this.temp.status = '1'    //将用户状态由新用户改为正常
        let roleIds = this.checkedRoleIds.join(",")  //将数组转换为字符串
        let userInfo=JSON.stringify(this.temp)
        param.append('userInfo',userInfo)
        param.append('roleIds',roleIds)
        request({
          url: '/api/userRole/updateUserRole',
          method: 'post',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data:param
        }).then( response =>{

          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          this.getUserInfoByStatus()
        })

      },
      sortChange(){

      },
      passApplication(row) {
        this.getDescriptions()        //获取所有角色
        this.temp = Object.assign({}, row) //复制所在行数据
        this.dialogFormVisible=true     //显示对话框

      },
      rejectApplication(row) {
        let str = '确定拒绝用户 ' + row.userName + ' 的申请么？'
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
            this.getUserInfoByStatus()
          })
        })
      }
    }
  }
</script>
