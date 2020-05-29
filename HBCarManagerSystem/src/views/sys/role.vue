<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="width:100%;height: 50px;">
      <!--左工具栏-->
      <div class="head-container left" style="float:left;">
        <el-input
        v-model="queryParams.name"
        clearable
        :size="size"
        style="width: 200px;"
        placeHolder="输入角色名称搜索"
        prefix-icon="filter-item"
        />
        <el-input
          v-model="queryParams.remark"
          clearable
          :size="size"
          style="width: 200px;"
          placeHolder="输入备注搜索"
          prefix-icon="filter-item"
        />
        <kt-button icon="el-icon-search"  perms="sys:role:view" type="success" @click="search()">搜索</kt-button>
        <kt-button icon="el-icon-plus"  perms="sys:role:add" type="primary" @click="addRole" >新增</kt-button>
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
              <el-button icon="fa fa-file-excel-o" @click="exportRoleExcelFile" :size="size" :loading="exportLoading"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      </div>
    </div>
    <el-row :gutter="0" >
        <!--角色管理-->
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px;">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="role-span">角色列表</span>
                </div>
                <kt-table perms-edit="sys:role:edit" perms-delete="sys:role:delete"
                        :data="pageResult.content" :columns="filterColumns" :stripe="false"
                        :loading="tableLoading" :show-batch-delete="false"
                        @handleEdit="handleEdit" @handleDelete="handleDelete"
                        @handleCurrentChange="handleRoleSelectChange">
                </kt-table>
                <pagination v-show="pageResult.totalSize>0" :total="pageResult.totalSize" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
            </el-card>
        </el-col>
        <!--菜单授权-->
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never" >
            <div slot="header" class="clearfix" style="text-align: left;">
              <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top" >
                <span class="role-span">菜单分配</span>
              </el-tooltip>
              <Kt-button
                :disabled="this.selectRole.id == null"
                :loading="menuSaveLoading"
                icon="el-icon-check"
                perms="sys:role:edit"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="saveMenu"
              >保存</Kt-button>
            </div>
            <el-tree
              size="mini"
              ref="menuTree"
              :data="menuData"
              :props="defaultProps"
              check-strictly
              accordion
              show-checkbox
              node-key="id"
              v-loading="menuLoading"
              element-loading-text="加载中..."
              @check-change="handleMenuCheckChange"
            />
            <div style="float:left;padding-left:24px;padding-top:12px;padding-bottome:4px;">
              <el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.selectRole.id == null"><b>全选</b></el-checkbox>
            </div>
          </el-card>
        </el-col>
    </el-row>
    <!--表格显示列界面-->
    <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" :init-columns="columns" @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
    <el-dialog v-dialogDrag :title="operation ? '新增角色':'编辑角色'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="temp" label-width="80px"   ref="temp"  :rules="rules" :size="size"
               style="text-align: left;">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="temp.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" auto-complete="off"></el-input>
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
  import KtButton  from '@/views/core/KtButton'
  import KtTable from "@/views/core/KtTable"
  import pagination from  "@/components/Pagination"
  import TableColumnFilterDialog from "@/views/core/TableColumnFilterDialog";
  import {batchDelete, exportRoleExcelFile, findPage, findRoleMenus, save, saveRoleMenus} from "@/api/system/role";
  import {findMenuTree} from "@/api/system/menu";
  import {downloadFile} from "@/utils";
    export default {
        name: "role",
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
            tableData:[],     //角色表格数据
            menuData:[],         //菜单数据
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            operation:true,   //选择编辑或者新增对话框
            menuSaveLoading:false,  //菜单设置保存加载
            menuLoading:false,  //菜单加载
            selectRole:{},      //点击角色表行选择的角色
            currentRoleMenus:[],//当前角色菜单
            checkAll:false,    //
            defaultProps:{
              children:'children',
              label:'name'
            },
            queryParams:{
              name:'',     //根据名称查询
              remark:''     //根据备注查询
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
              name: '',
              remark: ''
            },
            rules:{   //输入校验
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  message:'请输入名称'
                }
              ]
            },
          }
      },
      methods:{
        //搜索按钮函数
        search(){
          this.findPage()
        },

        //新增按钮函数
        addRole(){
          this.dialogVisible=true
          this.operation = true
          this.temp= {            //行数据
            id: 0,
            name: '',
            remark: ''
          }
        },

        //刷新函数
        refreshTreeData(){
          this.findPage()
          this.findTreeData()
        },

        //获取菜单数据
        findTreeData(){
          this.menuLoading = true
            findMenuTree({'name':''}).then(res =>{
              this.menuData = res.data
              this.menuLoading = false
            }).catch( error =>{
              this.menuLoading =false
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
        },

        //查询角色列表
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

        //角色导出
        exportRoleExcelFile(){
          this.exportLoading =true
          let temp = Object.assign({},this.pageRequest)
          temp.objectParam = Object.assign({},this.queryParams)
          temp.pageSize = 0   //不分页
          exportRoleExcelFile(temp).then( (response) => {
            this.exportLoading = false
            let a =  Math.floor(Math.random()*100)+"角色数据"
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

        //表格行编辑按钮函数
        handleEdit(params){
          this.dialogVisible = true
          this.operation = false
          Object.assign(this.temp, params.row)
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

        //提交部门数据表单
        submitForm() {
          this.$refs.temp.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗?', '提示', {}).then(() => {
                this.editLoading = true
                let params = Object.assign({}, this.temp)
                save(params).then((response) => {
                  this.editLoading = false
                  if(response.msg === 'ok') {
                    this.$message({ message: '操作成功', type: 'success' })
                    this.dialogVisible = false
                    this.findPage()
                  } else {
                    this.$message({message: '操作失败, ' + response.msg, type: 'error'})
                  }
                }).catch( error =>{
                  this.editLoading =false
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

        //保存按钮函数
        saveMenu(){
          let roleId = this.selectRole.id
          if('admin' == this.selectRole.name){
            this.$message({
              message:'超级管理员拥有所有菜单权限，不允许修改！',
              type:'error'
            })
            return
          }
          this.menuSaveLoading = true
          let checkedNodes = this.$refs.menuTree.getCheckedNodes(false,true)
          let roleMenus = []
          for(let i=0,len=checkedNodes.length;i<len;i++){
            let roleMenu = { roleId:roleId,menuId:checkedNodes[i].id }
            roleMenus.push(roleMenu)
          }
          saveRoleMenus(roleMenus).then( response => {
            this.menuSaveLoading = false
            if(response.msg === 'ok') {
              this.$message({ message: '操作成功', type: 'success' })
            } else {
              this.$message({message: '操作失败, ' + response.msg, type: 'error'})
            }
          }).catch( error =>{
            this.menuSaveLoading =false
            this.$notify({
              title:'操作提示',
              message:error.message,
              duration: 2000,
              type:'error'
            })
          })
        },

        //角色选择改变监听
        handleRoleSelectChange(val){
          if(val== null || val.val == null){
            return
          }
          this.selectRole = val.val
          findRoleMenus({'roleId':val.val.id}).then( res =>{
            this.currentRoleMenus = res.data
            this.$refs.menuTree.setCheckedNodes(res.data)
          })

        },

        //树节点监听
        handleMenuCheckChange(data,check,subCheck){
          if(check) {
            //节点选中同步选中父节点
            let parentId = data.parentId
            this.$refs.menuTree.setChecked(parentId,true,false)
          }else{
            //节点取消选中时同步取消选中子节点
            if(data.children != null){
              data.children.forEach( element => {
                this.$refs.menuTree.setChecked(element.id,false,false)
              })
            }
          }
        },

        // 全选操作
        handleCheckAll() {
          if(this.checkAll) {
            let allMenus = []
            this.checkAllMenu(this.menuData, allMenus)
            this.$refs.menuTree.setCheckedNodes(allMenus)
          } else {
            this.$refs.menuTree.setCheckedNodes([])
          }
        },
        // 递归全选
        checkAllMenu(menuData, allMenus) {
          menuData.forEach(menu => {
            allMenus.push(menu)
            if(menu.children) {
              this.checkAllMenu(menu.children, allMenus)
            }
          });
        },

        // 处理表格列过滤显示
        initColumns() {
          this.columns = [
            {prop:"id", label:"ID", minWidth:20},
            {prop:"name", label:"角色名", minWidth:80},
            {prop:"remark", label:"备注", minWidth:80},
            {prop:"createBy", label:"创建人", minWidth:50},
            {prop:"createTime", label:"创建时间", minWidth:120 }
          ]
          this.filterColumns = JSON.parse(JSON.stringify(this.columns));
        }
      },
      mounted() {
          this.initColumns()
          this.findPage()
          this.findTreeData()
      }
    }
</script>

<style scoped >
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
