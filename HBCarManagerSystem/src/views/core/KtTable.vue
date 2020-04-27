<template>
  <div>
    <!--表格栏-->
    <el-table :data="data" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange"
              @current-change="handleCurrentChange" v-loading="loading" element-loading-text="加载" :border="border" :stripe="stripe"
              :show-overflow-tooltip="showOverflowTooltip" :max-height="maxHeight" :size="size" :align="align" style="width:100%;" >
      <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
                       :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
                       :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
                       :sortable="column.sortable==null?true:column.sortable">
          <template  slot-scope="scope">
            <span v-if="column.prop !=='createTime'">{{ scope.row[column.prop] }}</span>
            <span  v-else >{{ formatTime(scope.row.createTime) }}</span>
          </template>
      </el-table-column>
      <el-table-column  label="操作" width="120" fixed="right" v-if="showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" style="margin:auto 0;"></kt-button>
          <kt-button icon="fa fa-trash" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin:auto 0;" ></kt-button>
        </template>
      </el-table-column>
    </el-table>
    <!--批量删除-->
    <div class="toolbar" style="padding:10px;">
      <kt-button  :perms="permsDelete" :size="size" type="danger" @click="handleBatchDelete()"
                 :disabled="this.selections.length===0" style="float:left;" v-if="showBatchDelete & showOperation">删除</kt-button>
    </div>
  </div>
</template>

<script>
 import KtButton from "@/views/core/KtButton"
  import { format } from "@/utils/datetime"
  export default {
    name: 'KtTable',
    components:{ KtButton },
    props: {
      columns: Array, // 表格列配置
      permsEdit: String,  // 编辑权限标识
      permsDelete: String,  // 删除权限标识
      data:{
        type:Array
      },
      size: { // 尺寸样式
        type: String,
        default: 'mini'
      },
      align: {  // 文本对齐方式
        type: String,
        default: 'left'
      },
      maxHeight: {  // 表格最大高度
        type: Number,
        default: 440
      },
      showOperation: {  // 是否显示操作组件
        type: Boolean,
        default: true
      },
      border: {  // 是否显示边框
        type: Boolean,
        default: false
      },
      stripe: {  // 是否显示斑马线
        type: Boolean,
        default: true
      },
      highlightCurrentRow: {  // // 是否高亮当前行
        type: Boolean,
        default: true
      },
      showOverflowTooltip: {  // 是否单行显示
        type: Boolean,
        default: true
      },
      showBatchDelete: {  // 是否显示操作组件
        type: Boolean,
        default: true
      },
      loading: {
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        selections: []  // 列表选中列
      }
    },
    methods: {
      formatTime(creatTime){
        return format(creatTime)
      },
      // 选择切换
      selectionChange: function (selections) {
        this.selections = selections
        this.$emit('selectionChange', {selections:selections})
      },
      // 选择切换
      handleCurrentChange: function (val) {
        this.$emit('handleCurrentChange', {val:val})
      },
      // 编辑
      handleEdit: function (index, row) {
        this.$emit('handleEdit', {index:index, row:row})
      },
      // 删除
      handleDelete: function (index, row) {
        this.delete(row.id)
      },
      // 批量删除
      handleBatchDelete: function () {
        let ids = this.selections.map(item => item.id).toString()
        this.delete(ids)
      },
      // 删除操作
      delete: function (ids) {
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let params = []
          let idArray = (ids+'').split(',')
          for(var i=0; i<idArray.length; i++) {
            params.push({'id':idArray[i]})
          }
          this.$emit('handleDelete', {params:params})
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped>

</style>
