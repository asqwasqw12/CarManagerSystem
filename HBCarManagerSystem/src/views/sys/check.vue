<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      height="530"
      fit
      highlight-current-row
      style="width: 100%;"
      :size="size"
      @sort-change="sortChange"
    >
      <el-table-column type="index"  header-align="center" align="center" width="60" label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
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
        prop="job"
        header-align="center"
        align="center"
        width="300"
        label="职务">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="120"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="注册时间">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--<el-button type="primary" size="mini" @click="passApplication(row)">
            通过
          </el-button>
          <el-button  size="mini" type="success" @click="rejectApplication(row)">
            拒绝
          </el-button>-->
          <kt-button perms="sys:user:edit" :size="size" @click="passApplication(row)" style="margin:auto 0;">通过</kt-button>
          <kt-button perms="sys:user:delete" :size="size" type="danger" @click="rejectApplication(row)" style="margin:auto 0;" >拒绝</kt-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-dialogDrag title="审核新用户" width="40%" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;" size="mini">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName" >
          <el-input v-model="temp.realName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
        <treeselect
          v-model="temp.deptId"
          :options="deptData"
          placeholder="选择部门"
          @select="selectFun"
        />
      </el-form-item>
        <el-form-item label="职务" prop="job">
          <el-input v-model="temp.job" />
        </el-form-item>
        <el-form-item label="用户角色" prop="userRoles" >
          <el-select v-model="temp.userRoles" multiple placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in rolesList" :key="item.id"
                       :label="item.remark" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {findByStatus, save} from "@/api/system/user";
    import { format } from "@/utils/datetime"
    import { findTree } from "@/api/system/dept";
    import request from "@/utils/request";
    import {findAll} from "@/api/system/role";
    import KtButton from '@/views/core/KtButton'
    export default {
        name: "check",
        components:{  Treeselect,KtButton },
    data() {
      return {
        size:"small",   //显示框、按钮等尺寸等级
        list: [],           //新用户数据源
        rolesList:[],       //角色数据源
        listLoading: true,  //加载状态
        dialogFormVisible: false,  //对话框显示属性
        temp:{             //行数据临时存储
          id:'',
          name:'',
          realName:'',
          job:'',
          mobile:'',
          deptId:0,
          status:'',
          userRoles:[]
        },
        deptData:[]
      }
    },
    created() {
      this.getUserInfoByStatus()
    },
      mounted(){
        this.findDeptTree()
      },
    methods: {
      getUserInfoByStatus() {
        this.listLoading = true
        findByStatus({status:2 }).then(response => {
          this.listLoading = false
          if (response.msg === 'ok') {
            this.list = response.data
            this.findUserRoles()
          } else {
            this.$notify({
              title: '登录提示',
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
      // 加载用户角色信息
      findUserRoles() {
        findAll().then((res) => {
          // 加载角色集合
          this.rolesList = res.data
        })
      },
      // 获取部门列表
      findDeptTree() {
        findTree({'name':''}).then( res => {
          this.deptData = this.filterDeptTree(res.data)
        })
      },
      formatTime(creatTime){
        return format(creatTime)
      },

      //获取vue-treeselect对象
      filterDeptTree(deptList) {
        const res = []
        deptList.forEach(dept => {
          const tmp = {
            id: dept.id,
            label: dept.name,
          }
          if (dept.children.length > 0) {
            tmp.children = this.filterDeptTree(dept.children)
          }
          res.push(tmp)
        })
        return res
      },
      // 点击部门搜索对应的岗位
      selectFun(node, instanceId) {
        //this.getJobs(node.id)
       //this.form.job.id = null
      },
      updateData(){
        this.dialogFormVisible = false
        let params = Object.assign({}, this.temp)
        let userRoles = []
        for(let i=0,len=params.userRoles.length; i<len; i++) {
          let userRole = {
            userId: params.id,
            roleId: params.userRoles[i]
          }
          userRoles.push(userRole)
        }
        params.userRoles = userRoles
        params.status = 1   //将用户状态修改为正常用户
        let arrayJob
        if(params.job.length !== 0){
          arrayJob = params.job.split('/')
        }
        if( arrayJob.length ===3){
          params.job =arrayJob[2]
        }
        save(params).then( response =>{
          if (response.msg === 'ok') {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getUserInfoByStatus()
          }else{
            this.$notify({
              title: '审核提示',
              type: 'error',
              message:response.msg,
              duration: 2000
            })
          }
        }).catch(error =>{
          this.listLoading = false
          this.$notify({
            title:'审核提示',
            message:error.message,
            duration: 2000,
            type:'error'
          })
        })

      },
      sortChange(){

      },
      passApplication(row) {
        this.temp = Object.assign({}, row) //复制所在行数据
        this.dialogFormVisible=true     //显示对话框
        let userRoles = []
        for(let i=0,len=row.userRoles.length; i<len; i++) {
          userRoles.push(row.userRoles[i].roleId)
        }
        this.temp.userRoles = userRoles
      },
      rejectApplication(row) {
        let str = '确定拒绝用户 ' + row.name + ' 的申请么？'
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

<style scoped>

</style>
