<template>
  <div class="app-container">
    <!--左工具栏-->
    <div class="head-container left" style="float:left;">
      <!--部门名称搜索框-->
      <el-input
        v-model="queryParams.name"
        clearable
        :size="size"
        style="width: 200px;"
        placeHolder="输入部门名称搜索"
        prefix-icon="filter-item"
      />
      <kt-button icon="el-icon-search"  perms="sys:dept:view" type="success" @click="search()">搜索</kt-button>
      <kt-button icon="el-icon-plus"  perms="sys:dept:add" type="primary" @click="addDept" >新增</kt-button>
    </div>
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
              <el-button icon="fa fa-file-excel-o" @click="exportDeptExcelFile" :size="size" :loading="exportLoading"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
   <el-table :data="tableTreeData" stripe size="mini" style="width: 100%;" row-key="id"
              v-loading="tableLoading" rowKey="id" element-loading-text="加载中。。。">
      <el-table-column
        prop="id" header-align="center" align="center" :width="setWidth('id')" :label="setLabel('id')" v-if="includeColumn('id')">
      </el-table-column>
      <el-table-column
       prop="name" header-align="center" align="center" treeKey="id" :width="setWidth('name')" :label="setLabel('name')" v-if="includeColumn('name')" >
      </el-table-column>
      <el-table-column
        prop="parentName" header-align="center" align="center" :width="setWidth('parentName')" :label="setLabel('parentName')"  v-if="includeColumn('parentName')">
      </el-table-column>
      <el-table-column
        prop="orderNum" header-align="center" align="center" :label="setLabel('orderNum')"  :width="setWidth('orderNum')" v-if="includeColumn('orderNum')">
      </el-table-column>
      <el-table-column
        prop="createBy" header-align="center" align="center" :label="setLabel('createBy')" :width="setWidth('createBy')" v-if="includeColumn('createBy')">
      </el-table-column>
      <el-table-column
        prop="createTime" header-align="center" align="center" :label="setLabel('createTime')" :formatter="dateFormat" :width="setWidth('createBy')" v-if="includeColumn('createTime')">
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" label="操作">
          <template slot-scope="scope">
            <kt-button icon="fa fa-edit" perms="sys:dept:edit" :size="size" @click="handleEdit(scope.$index, scope.row)" style="margin:auto 0;"></kt-button>
            <kt-button icon="fa fa-trash" perms="sys:dept:delete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin:auto 0;" ></kt-button>
          </template>
      </el-table-column>
    </el-table>
    <!--表格显示列界面-->
    <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns"  @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
    <!--新增编辑界面-->
    <el-dialog v-dialogDrag :title="operation ? '新增部门':'编辑部门'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="temp" label-width="80px"   ref="temp"  :rules="rules" :size="size"
             label-position="right">
      <el-form-item prop="name"  label="名称" >
        <el-input v-model="temp.name" placeholder="请输入部门或公司名称"></el-input>
      </el-form-item>
      <el-form-item prop="parentId"  label="上级部门">
        <treeselect
          v-model="temp.parentId"
          :options="treeSelectData"
          placeholder="选择部门"
          @select="selectFun"
        />
      </el-form-item>
      <el-form-item prop="orderNum" label="顺序编号">
        <el-input-number v-model="temp.orderNum" controls-position="right" :min="0" label="排序编号"></el-input-number>
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
  import TableColumnFilterDialog  from '@/views/core/TableColumnFilterDialog'
  import KtButton from "@/views/core/KtButton"
  import KtTable from "@/views/core/KtTable"
  import pagination from "@/components/Pagination"
  import {batchDelete, exportDeptExcelFile, findTree, save} from "@/api/system/dept"
  import TableTreeColumns from '@/views/core/TableTreeColumns'
  import {format} from "@/utils/datetime";
  import {downloadFile} from "@/utils";
    export default {
        name: "dept",
      components:{ TableColumnFilterDialog,KtButton,KtTable,pagination,TableTreeColumns ,Treeselect},
      data(){
          return{
            queryParams: {
              name:''     //部门名称
            },
            tableLoading:false,        //表格加载状态
            exportLoading:false,   //导出按钮加载状态
            editLoading:false,   //对话框提交按钮加载状态
            size:'small',     //按钮尺寸
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            filterColumns2:[],  //过滤好
            dialogVisible:false,  //编辑新增对话框显示属性
            operation:true,   //选择编辑或者新增对话框
            temp:{            //行数据
              id: 0,
              name: '',
              parentId: 1,
              parentName: '',
              orderNum: 0
            },
            dataForm:{},
            treeSelectData:[] , //部门数据树
            tableTreeData:[],   //表格部门数据
            rules: {
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  message:'请输入部门或公司名称'
                }
              ]
            },
          }
      },
      methods: {
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

        selectFun(){

        },
        //新增部门
        addDept() {
          this.dialogVisible = true
          this.operation = true
          this.temp = {
            id: 0,
            name: '',
            parentId: 1,
            parentName: '',
            orderNum: 0
          }
        },

        //导出部门数据
        exportDeptExcelFile() {
            this.exportLoading =true
          //let name =this.queryParams.name
          let data = {
              name:''
          }
            exportDeptExcelFile(data).then( (response) => {
              this.exportLoading = false
              let a =  Math.floor(Math.random()*100)+"部门数据"
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
                    this.refreshTreeData()
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
        displayFilterColumnsDialog() {
          this.$refs.tableColumnFilterDialog.setDialogVisible(true)
          this.$nextTick(() => {
            this.$refs.tableColumnFilterDialog.addRow()
          })
        },

        //处理表格列过滤显示
        handleFilterColumns(data) {
          this.filterColumns = data.filterColumns
          this.$refs.tableColumnFilterDialog.setDialogVisible(false)
        },

        // 处理表格列过滤显示
        initColumns() {
          this.columns = [
            {prop: "id", label: "ID", minWidth: 50},
            {prop: "name", label: "名称", minWidth: 80},
            {prop: "parentName", label: "上级部门", minWidth: 80},
            {prop: "orderNum", label: "排序", minWidth: 70},
            {prop: "createBy", label: "创建人", minWidth: 120},
            {prop: "createTime", label: "创建时间", minWidth: 100}
          ]
          this.filterColumns = JSON.parse(JSON.stringify(this.columns));//深拷贝
        },

        //判断是否显示列
        includeColumn(prop){
          return this.filterColumns.some(item =>{
            return item.prop === prop
          })
        },
        //设置列宽度
        setWidth(prop){
          let width = 80
          this.filterColumns.forEach( item => {
            if(item.prop === prop){
             width = item.minWidth
            }
          })
          return "'minWth':"+width
        },

        //设置列名称
        setLabel(prop){
          let label='列名'
          this.filterColumns.forEach( item => {
            if(item.prop === prop){
              label = item.label
            }
          })
          return label
        },

        //表格编辑按钮
        handleEdit(index, row) {
          this.dialogVisible = true
          this.operation = false
          Object.assign(this.temp, row)
        },

        //表格删除按钮
        handleDelete(index, row) {
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            let params = this.getDeleteIds([], row)
            batchDelete(params).then( response => {
              if(response.msg === 'ok'){
                this.$message(
                  {
                    message:'删除成功',
                    type:'success'
                  })
              this.refreshTreeData()
              }else {
                this.$message(
                  {
                    message:'操作失败',
                    type:'error'
                  })
              }
            }).catch( error =>{
              this.loading =false
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          })
        },

        // 获取删除的包含子机构的id列表
        getDeleteIds (ids, row) {
          ids.push({id:row.id})
          if(row.children != null) {
            for(let i=0, len=row.children.length; i<len; i++) {
              this.getDeleteIds(ids, row.children[i])
            }
          }
          return ids
        },

        //查找部门树
        findTreeData(name) {
          this.tableLoading = true
          return new Promise((resolve,reject) => {
            findTree({'name':name}).then(res => {
              this.tableLoading = false
              this.tableTreeData = res.data
              resolve(res.data)
            }).catch( error =>{
              this.tableLoading =false
              reject(error)
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          })
        },
        refreshTreeData(){
           this.findTreeData('').then( result =>{
             this.treeSelectData = this.filterDeptTree(result)
           })
        },

        //搜索
        search(){
          let name=this.queryParams.name
          this.findTreeData(name)
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index){
          return format(row[column.property])
        }
      },

      mounted() {
        this.initColumns()
        this.refreshTreeData()
      }
    }
</script>

<style scoped>

</style>
