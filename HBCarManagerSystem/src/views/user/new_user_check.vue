<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="index" width="60" label="序号">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        width="80"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        width="80"
        label="姓名">
      </el-table-column>
        <el-table-column
          prop="sex"
          header-align="center"
          align="center"
          width="80"
          label="性别">
      </el-table-column>
        <el-table-column
          prop="departmentname"
          header-align="center"
          align="center"
          width="80"
          label="部门">
        </el-table-column>
          <el-table-column
            prop="mobilephone"
            header-align="center"
            align="center"
            width="80"
            label="电话">
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

  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    name: 'new_user_check',
    data() {
      return {
        list: [],
        listLoading: true
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
