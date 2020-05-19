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
      <kt-button icon="el-icon-plus"  perms="sys:menu:add" type="primary" @click="addDept" >新增</kt-button>
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
  </div>
</template>

<script>
  import KtButton from '@/views/core/KtButton'
  import {findMenuTree} from "@/api/system/menu";
    export default {
        name: "menu",
      components:{ KtButton },
      data(){
          return {
            queryParams:{   //查询参数
              name:''
            },
            size:"small",
            exportLoading:false,  //导出按钮加载状态
            tableLoading:false,   //表格数据加载状态
            tableData:[],     //菜单表格数据
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
          }
      },
      methods: {
        //搜索按钮函数
        search() {
          let name=this.queryParams.name
          this.findTreeData(name)
        },
        //新增按钮函数
        addDept() {

        },

        //获取数据
        findTreeData(name){
          this.tableLoading = true
          findMenuTree({'name':name}).then(res =>{
            this.tableData = res.data
            this.tableLoading = false
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


        //刷新操作
        refreshTreeData() {
          this.findTreeData('')
        },

        //列显示对话框
        displayFilterColumnsDialog() {

        },

        //导出
        exportMenuExcelFile() {

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
      },
      mounted() {
        this.initColumns()
        this.refreshTreeData()
      }
    }
</script>

<style scoped>

</style>
