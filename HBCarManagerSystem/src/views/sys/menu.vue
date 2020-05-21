<template>
  <div class="app-container">
    <!--左工具栏-->
    <div class="head-container left" style="float:left;">
      <el-input
        v-model="queryParams.name"
        clearable
        :size="size"
        style="width: 200px;"
        placeHolder="输入菜单名称搜索"
        prefix-icon="filter-item"
      />
      <kt-button icon="el-icon-search"  perms="sys:menu:view" type="success" @click="search()">搜索</kt-button>
      <kt-button icon="el-icon-plus"  perms="sys:menu:add" type="primary" @click="addMenu" >新增</kt-button>
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
              <el-button icon="fa fa-file-excel-o" @click="exportMenuExcelFile" :size="size" :loading="exportLoading"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table :data="tableData" stripe size="mini" style="width: 100%;" row-key="id"
              v-loading="tableLoading" rowKey="id" element-loading-text="加载中。。。">
      <el-table-column
        prop="id" header-align="center" align="center" :width="setWidth('id')" :label="setLabel('id')" v-if="includeColumn('id')">
      </el-table-column>
      <el-table-column
        prop="name" header-align="center" align="center" treeKey="id" :width="setWidth('name')" :label="setLabel('name')" v-if="includeColumn('name')" >
      </el-table-column>
      <el-table-column
         header-align="center" align="center"  :width="setWidth('icon')" :label="setLabel('icon')" v-if="includeColumn('icon')" >
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" :width="setWidth('type')" :label="setLabel('type')" v-if="includeColumn('type')" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-if="scope.row.type === 1" size="small">菜单</el-tag>
          <el-tag v-if="scope.row.type === 2" size="small">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" :width="setWidth('parentName')" :label="setLabel('parentName')" v-if="includeColumn('parentName')">
      </el-table-column>
      <el-table-column prop="url" header-align="center" align="center"  :width="setWidth('url')" :label="setLabel('url')" v-if="includeColumn('url')">
      </el-table-column>
      <el-table-column prop="perms" header-align="center" align="center" :show-overflow-tooltip="true" :width="setWidth('perms')" :label="setLabel('perms')" v-if="includeColumn('perms')">
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center"  :width="setWidth('orderNum')" :label="setLabel('orderNum')" v-if="includeColumn('orderNum')">
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
    <el-dialog :title="operation ? '新增菜单':'编辑菜单'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="temp" label-width="80px"   ref="temp"  :rules="rules" :size="size"
               style="text-align: left;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio v-for="(type,index) in menuTypeList" :label="index" :key="index">
              {{ type }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[temp.type] + '名称'" prop="name">
          <el-input v-model="temp.name" :placeholder="menuTypeList[temp.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item prop="parentId"  label="上级菜单">
          <treeselect
            v-model="temp.parentId"
            :options="treeSelectData"
            placeholder="选择菜单"
            @select="selectFun"
          />
        </el-form-item>
        <el-form-item v-if="temp.type!== 0" label="授权标识" prop="perms">
          <el-input v-model="temp.perms" placeholder="如： sys:user:add,sys:user:edit,sys:user:delete"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.type !== 2" label="菜单路由" prop="url">
          <el-input v-model="temp.url" placeholder="/sys/user"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.type !==2 " prop="orderNum" label="顺序编号">
          <el-input-number v-model="temp.orderNum" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
        <el-form-item v-if="temp.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-input v-model="temp.icon" v-popover:iconListPopover :readonly="false" placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
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
  import KtButton from '@/views/core/KtButton'
  import {batchDelete, exportMenuExcelFile, findMenuTree, save} from "@/api/system/menu";
  import TableColumnFilterDialog  from '@/views/core/TableColumnFilterDialog'
  import FaIconTooltip from "@/components/FaIconTooltip";
  import {downloadFile} from "@/utils";
    export default {
        name: "menu",
      components:{ KtButton,TableColumnFilterDialog,Treeselect,FaIconTooltip },
      data(){
          return {
            queryParams:{   //查询参数
              name:''
            },
            size:"small",
            exportLoading:false,  //导出按钮加载状态
            tableLoading:false,   //表格数据加载状态
            editLoading:false,    //对话框提交按钮加载状态
            dialogVisible:false,  //对话框显示状态
            tableData:[],     //菜单表格数据
            treeSelectData:[],//菜单树数据
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            operation:true,   //选择编辑或者新增对话框
            temp:{            //行数据
              id: 0,
              name: '',
              icon:'',
              type:0,
              parentId:0,
              parentName: '',
              url:'',
              perms:'',
              orderNum: 0
            },
            rules:{   //输入校验
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  message:'请输入部门或公司名称'
                }
              ]
            },
            menuTypeList:["目录","菜单","按钮"],
          }
      },
      methods: {
        //搜索按钮函数
        search() {
          let name=this.queryParams.name
          this.findTreeData(name)
        },
        //新增按钮函数
        addMenu() {
          this.dialogVisible=true
          this.operation = true
          this.temp= {            //行数据
              id: 0,
              name: '',
              icon:'',
              type:0,
              parentId:0,
              parentName: '',
              url:'',
              perms:'',
              orderNum: 0
          }
        },

        //获取vue-treeselect对象
        filterDeptTree(menuList) {
          const res = []
          menuList.forEach( menu => {
            const tmp = {
              id: menu.id,
              label: menu.name
            }
            if (menu.children.length > 0) {
              tmp.children = this.filterDeptTree(menu.children)
            }
            res.push(tmp)
          })
          return res
        },

        //获取数据
        findTreeData(name){
          this.tableLoading = true
          return new Promise((resolve,reject) => {
            findMenuTree({'name':name}).then(res =>{
              this.tableData = res.data
              this.tableLoading = false
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

        //刷新操作
        refreshTreeData() {
          this.findTreeData('').then( (result)=>{
            let parent=[
              {
                id: 0,
                name: "顶级目录",
                children: result
              }
            ]
            this.treeSelectData = this.filterDeptTree(parent)
          })
        },

        //列显示对话框
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

        //导出
        exportMenuExcelFile() {
          this.exportLoading =true
          //let name =this.queryParams.name
          let data = {
            name:''
          }
          exportMenuExcelFile(data).then( (response) => {
            this.exportLoading = false
            let a =  Math.floor(Math.random()*100)+"菜单数据"
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

        // 处理表格列过滤显示
        initColumns() {
          this.columns = [
            {prop: "id", label: "ID", minWidth: 50},
            {prop: "name", label: "名称", minWidth: 80},
            {prop: "icon", label: "图标", minWidth: 50},
            {prop: "type", label: "类型", minWidth: 50},
            {prop:"parentName",label:"上级菜单",minWidth:100},
            {prop:"url",label:"菜单URL",minWidth:150},
            {prop:"perms",label:"授权标识",minWidth:150},
            {prop: "orderNum", label: "排序", minWidth: 70},
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

        selectFun(){

        },
      },
      mounted() {
        this.initColumns()
        this.refreshTreeData()
      }
    }
</script>

<style scoped>

</style>
