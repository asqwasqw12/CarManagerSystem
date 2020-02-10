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
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="passApplication(row)">
            通过
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="rejectApplication(row)">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="审核新用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;" size="mini">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="temp.userName" disabled="true" />
            </el-form-item>
            <el-form-item label="姓名" prop="realName" >
              <el-input v-model="temp.realName" disabled="true"/>
            </el-form-item>
            <el-form-item label="部门" prop="departmentname">
              <el-input v-model="temp.departmentname" />
            </el-form-item>
            <el-form-item label="职务" prop="post">
              <el-input v-model="temp.post" />
            </el-form-item>
        <el-form-item label="公司" prop="company" >
          <el-input v-model="temp.company" disabled="true"/>
        </el-form-item>
        
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    name: 'new_user_check',
    data() {
      return {
        list: [],           //数据源
        listLoading: true,  //加载状态
        dialogFormVisible: false,  //对话框显示属性
        temp:{             //行数据临时存储
          userName:'',
          realName:'',
          departmentname:'',
          post:'',
          mobilephone:'',
          company:''
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
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data:param                                   //携带数据发送请求到后台
        }).then(response => {
          this.listLoading = false
          const data = response.data
          if (data.info.code === '0') {
            console.log("userInfo="+data.data.userInfo)
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
      sortChange(){

      },
      passApplication(row) {
        this.temp = Object.assign({}, row) //复制所在行数据
        this.dialogFormVisible=true     //显示对话框
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
