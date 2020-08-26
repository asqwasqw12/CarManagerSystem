<template>
  <div class="app-container" >
    <el-row :gutter="20">
      <!--侧边部门数据栏-->
      <el-col :xs="9" :sm="6"  :md="4" :lg="4" :xl="4" >
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
          class="tree-left"
          />
      </el-col>
      <!--用户数据栏-->
      <el-col :xs="15" :sm="18"  :md="20" :lg="20" :xl="20">
        <!--左工具栏-->
        <div class="head-container left" style="float:left;">
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
          <kt-button icon="el-icon-search"  perms="sys:user:view" type="success" @click="findPage">搜索</kt-button>
          <kt-button icon="el-icon-plus"  perms="sys:user:add" type="primary" @click="addUser" >新增</kt-button>
        </div>
        <!--右工具栏-->
        <div class="head-container right" style="float: right">
          <el-form :inline="true" size="mini">
            <el-form-item>
              <el-button-group>
                <el-tooltip content="刷新" placement="top">
                  <el-button icon="fa fa-refresh" @click="findPage()" size="small"></el-button>
                </el-tooltip>
                <el-tooltip content="列显示" placement="top">
                  <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog" size="small"></el-button>
                </el-tooltip>
                <el-tooltip content="导出" placement="top">
                  <el-button icon="fa fa-file-excel-o" @click="exportUserExcelFile" size="small" :loading="exportLoading"></el-button>
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
      </el-col>
    </el-row>
    <!--表格显示列界面-->
    <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" :init-columns="columns" @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>

    <!--新增编辑界面-->
    <el-dialog v-dialogDrag :title="operation?'新增用户':'编辑用户'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">

      <el-form :model="temp" label-width="80px"   ref="dataForm"  :rules="rules" :size="size"
               label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名:" prop="name" >
              <el-input v-model="temp.name" auto-complete="off" placeholder="例如：xiaoMing_a3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="realName" >
              <el-input v-model="temp.realName" auto-complete="off" placeholder="例如：小明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码:" prop="password">
              <el-input v-model="temp.password" type="password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <!--用户状态栏-->
              <el-select
                v-model="temp.status"
                clearable
                size="small"
                placeholder="用户状态"
                class="filter-item"
              >
                <el-option v-for="item in statusOptions" :key="item.id " :value="item.id" :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门:" prop="deptId">
              <treeselect
                v-model="temp.deptId"
                :options="treeSelectData"
                placeholder="选择部门"
                @select="selectFun"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务:" prop="job">
              <el-input v-model="temp.job" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱:" prop="email" >
              <el-input v-model="temp.email" auto-complete="off" placeholder="例如：xiaoMing@163.com"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机:" prop="mobile" >
              <el-input v-model="temp.mobile" auto-complete="off" placeholder="例如：13112345678"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色:" prop="userRoles" v-if="!operation">
          <el-select v-model="temp.userRoles" multiple placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in rolesList" :key="item.id"
                       :label="item.remark" :value="item.id">
            </el-option>
          </el-select>
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
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {findTree} from "@/api/system/dept";
    import KtButton from "@/views/core/KtButton"
    import KtTable from "@/views/core/KtTable";
    import {findAll} from "@/api/system/role";
    import {batchDelete, exportUserExcelFile, findPage, save} from "@/api/system/user";
    import pagination from  "@/components/Pagination"
    import TableColumnFilterDialog from "@/views/core/TableColumnFilterDialog";
    import {downloadFile} from "@/utils";
    export default {
        name: "user",
      components:{TableColumnFilterDialog, KtTable, KtButton,pagination,Treeselect},
      data(){
        let validatePassword = (rule, value, callback) => {
          const reg = /^\S{6,100}$/g
          if (value.length === 0) {
            callback(new Error('请输入密码'))
          } else if(!reg.test(value)) {
            callback(new Error('请输入6-20个非空字符'))
          }else {
            callback()
          }
        }
        let validateName = (rule, value, callback) => {
          const reg = /^[a-zA-Z][a-zA-Z0-9_-]{4,16}$/
          if (value.length === 0) {
            callback(new Error('请输入用户名'))
          } else if (!reg.test(value)) {
            callback(new Error('请由字母数字下划线减号自由组合'))
          } else {
            callback()
          }
        }
        let validateMobile = (rule, value, callback) => {
          const reg = /^[1][3,4,5,7,8][0-9]{9}$/
          if (value.length === 0) {
            callback(new Error('请输入手机号码'))
          } else if (!reg.test(value)) {
            callback(new Error('您输入的手机号码格式有误'))
          } else {
            callback()
          }
        }
        let validateEmail = (rule, value, callback) => {
          const reg = /^(\w+\.?)*[A-Za-z0-9_-]+@(\w+\.)\w+$/      // /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (value.length === 0) {
            callback(new Error('请输入您的电子邮箱'))
          } else if (!reg.test(value)) {
            callback(new Error('您输入的电子邮箱格式有误'))
          } else {
            callback()
          }
        }
        let validateStatus = (rule, value, callback) => {
          if (value==="" ){
            callback(new Error('请输入您的用户状态'))
          }else{
            callback()
          }
        }
        let validateUserRoles = (rule, value, callback) => {
          if (value.length ===0 ){
            callback(new Error('请输入您的用户角色'))
          }else{
            callback()
          }
        }
          return {
            size:"small",   //显示框、按钮等尺寸等级
            deptName:'',
            deptData:[],
            treeSelectData:[
              {
                id:1,
                label:'合加新能源汽车有限公司'
              }
            ],
            defaultProps:{
              children:'children',
              label:'name'
            },
            queryParams:{
              name:'',        //根据用户名查询
              realName:'',    //根据真实姓名查询
              status: '',      //根据用户状态查询
              createTime:[],   //根据注册日期查询
              deptId:0        //根据部门id查询
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
            exportLoading:false,  //导出按钮加载状态
            tableLoading:false,   //表格加载状态
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            statusOptions:[
              {
                id:0,
                name:'禁用'
              },
              {
                id:1,
                name:'正常'
              },
              {
                id:2,
                name:'新用户'
              }
            ],
            operation:false,      //true:新增，false:编辑
            dialogVisible:false,  //新增或编辑界面是否显示
            editLoading:false,    //按钮加载状态
            rolesList:[],        //角色数据源
            temp:{              //行临时存储数据
              id: 0,
              name: '',
              realName:'',
              password: '',
              deptId: 12,
              job: '结构工程师',
              email: '',
              mobile: '',
              status: 1,
              userRoles: []
            },
            rules: {
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  validator: validateName
                }
              ],
              realName: [
                {
                  required: true,
                  message: '请输入您的真实姓名',
                  trigger: 'blur'
                },
                {
                  min: 2,
                  max: 10,
                  message: '长度在2到10个字符',
                  trigger:'blur'
                }
              ],
              mobile: [
                {
                  required: true,
                  trigger: 'blur',
                  validator:validateMobile
                }
              ],
              email: [
                {
                  required: true,
                  trigger: 'blur',
                  validator: validateEmail
                }
              ],
              deptId: [
                {
                  required: true,
                  message: '请输入您所在部门',
                  trigger: 'blur'
                }
            ],
              job: [
                {
                  required: true,
                  message: '请输入您的职务',
                  trigger: 'blur'
                },
                {
                  min: 2,
                  max: 20,
                  message: '长度在2到20个字符',
                  trigger:'blur'
                }
              ],
              status:[
                {
                  required:true,
                  trigger:'blur',
                  validator:validateStatus
                }
              ],
              userRoles:[
                {
                  required:true,
                  trigger:'blur',
                  validator:validateUserRoles
                }
              ],
            }
          }
      },
      created(){

      },
      mounted(){
        this.initColumns()
        this.findDeptTree()
        this.findPage()
      },
      methods:{
        // 获取部门列表
        findDeptTree() {
          findTree({'name':''}).then( res => {
            this.deptData = res.data
            this.treeSelectData = this.filterDeptTree(res.data)
          })
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
        //切换部门
        handleNodeClick(data){
              this.queryParams.deptId = data.id
              this.findPage()
        },
        //查询用户列表
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
              this.tableLoading = false
              this.$notify({
                title:'获取数据提示',
                message:error.message,
                position:'bottom-right',
                type:'error'
              })
            })
        },
        // 加载所有用户角色信息
        findUserRoles() {
          findAll().then((res) => {
            // 加载角色集合
            this.rolesList = res.data
          })
        },

        //新增用户列表
        addUser(){
          this.dialogVisible = true
          this.operation = true
          this.temp = {
            id: 0,
            name: '',
            realName:'',
            password: '',
            deptId: 12,
            job: '结构工程师',
            email: '',
            mobile: '',
            status: 1,
            userRoles: []
          }

        },

         //导出用户数据
        exportUserExcelFile(){
          this.exportLoading =true
          let temp = Object.assign({},this.pageRequest)
          temp.objectParam = Object.assign({},this.queryParams)
          temp.pageSize = 0   //不分页
          //在status未选中状态，传递给后端的status参数改为-1，以此查询所有状态的用户
          if(temp.objectParam.status  === "" && temp.objectParam.status  !== 0  ){
            temp.objectParam.status =-1
          }
          exportUserExcelFile(temp).then( (response) => {
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

        // 点击部门搜索对应的岗位
        selectFun(node, instanceId) {
          //this.getJobs(node.id)
          //this.form.job.id = null
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
        //表格编辑按钮函数
        handleEdit(params){
          this.dialogVisible = true
          this.operation = false
          this.temp = Object.assign({},params.row)
          let userRoles = []
          for(let i=0,len=params.row.userRoles.length;i<len;i++){
            userRoles.push(params.row.userRoles[i].roleId)
          }
          this.temp.userRoles=userRoles
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

        //对话框提交按钮函数
        submitForm(){
          this.$refs.dataForm.validate((valid) => {
            if(valid){
              this.$confirm('确认提交吗?','提示',{}).then( ()=>{
                this.editLoading = true
                let params = Object.assign({},this.temp)
                let userRoles = []
                for(let i=0,len=params.userRoles.length; i<len; i++) {
                  let userRole = {
                    userId: params.id,
                    roleId: params.userRoles[i]
                  }
                  userRoles.push(userRole)
                }
                params.userRoles = userRoles
                save(params).then( response =>{
                  this.editLoading = false
                  if (response.msg === 'ok') {
                    this.$notify({
                      title: 'Success',
                      message: '操作成功',
                      type: 'success',
                      duration: 2000
                    })
                    this.dialogVisible = false
                    this.findPage()
                  }else{
                    this.$notify({
                      title: '操作失败',
                      type: 'error',
                      message:response.msg,
                      duration: 2000
                    })
                  }
                }).catch(error =>{
                  this.editLoading = false
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
.tree-left{
  overflow: hidden;
 /* border:1px solid red;*/
}
</style>
