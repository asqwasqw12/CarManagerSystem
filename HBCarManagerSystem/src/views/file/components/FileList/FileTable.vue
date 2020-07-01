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
          <span v-if="column.prop !=='createTime' && column.prop !=='isDir' && column.prop !=='fileName'">{{ scope.row[column.prop] }}</span>
          <span  v-if="column.prop ==='createTime'" >{{ formatTime(scope.row.createTime) }}</span>
          <span v-if="column.prop === 'isDir'">{{ <img :src="setFileImg(scope.row.extendName)" style="width: 30px;" /> }}</span>
          <div v-if="column.prop === 'fileName'" style="cursor:pointer;" @click="clickFileName(scope.row)">
            <span>{{scope.row.fileName}}</span>
            <span v-if="!scope.row.isDir && scope.row.extendName !== null">.{{scope.row.extendName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="120" fixed="right" v-if="showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :perms="permsView" :size="size" @click="handleView(scope.$index, scope.row)" style="margin:auto 0;"></kt-button>
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
        name: "FileTable",
      components:{ KtButton },
      props: {
        columns: Array, // 表格列配置
        permsView: String,  // 查看权限标识
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
          selections: [],  // 列表选中列,
          fileImgTypeList: [    //  可以识别的文件类型
            'png',
            'jpg',
            'jpeg',
            'docx',
            'doc',
            'ppt',
            'pptx',
            'xls',
            'xlsx',
            'avi',
            'mp4',
            'css',
            'csv',
            'chm',
            'rar',
            'zip',
            'dmg',
            'mp3',
            'open',
            'pdf',
            'rtf',
            'txt',
            'oa',
            'js',
            'html',
            'img',
            'sql',
            'jar',
            'svg',
            'gif',
            'json',
            'exe'
          ],
          fileImgMap: {                 //  文件图片Map映射
            dir: require('@/assets/images/file/dir.png'),
            chm: require('@/assets/images/file/file_chm.png'),
            css: require('@/assets/images/file/file_css.png'),
            csv: require('@/assets/images/file/file_csv.png'),
            png: require('@/assets/images/file/file_pic.png'),
            jpg: require('@/assets/images/file/file_pic.png'),
            jpeg: require('@/assets/images/file/file_pic.png'),
            docx: require('@/assets/images/file/file_word.png'),
            doc: require('@/assets/images/file/file_word.png'),
            ppt: require('@/assets/images/file/file_ppt.png'),
            pptx: require('@/assets/images/file/file_ppt.png'),
            xls: require('@/assets/images/file/file_excel.png'),
            xlsx: require('@/assets/images/file/file_excel.png'),
            mp4: require('@/assets/images/file/file_video.png'),
            avi: require('@/assets/images/file/file_avi.png'),
            rar: require('@/assets/images/file/file_rar.png'),
            zip: require('@/assets/images/file/file_zip.png'),
            dmg: require('@/assets/images/file/file_dmg.png'),
            mp3: require('@/assets/images/file/file_music.png'),
            open: require('@/assets/images/file/file_open.png'),
            pdf: require('@/assets/images/file/file_pdf.png'),
            rtf: require('@/assets/images/file/file_rtf.png'),
            txt: require('@/assets/images/file/file_txt.png'),
            oa: require('@/assets/images/file/file_oa.png'),
            unknown: require('@/assets/images/file/file_unknown.png'),
            js: require('@/assets/images/file/file_js.png'),
            html: require('@/assets/images/file/file_html.png'),
            img: require('@/assets/images/file/file_img.png'),
            sql: require('@/assets/images/file/file_sql.png'),
            jar: require('@/assets/images/file/file_jar.png'),
            svg: require('@/assets/images/file/file_svg.png'),
            gif: require('@/assets/images/file/file_gif.png'),
            json: require('@/assets/images/file/file_json.png'),
            exe: require('@/assets/images/file/file_exe.png')
          }
        }
      },
      methods: {

        //  根据文件扩展名设置文件图片
        setFileImg(extendname) {
          if (extendname === null) {
            //  文件夹
            return this.fileImgMap.dir
          } else if (!this.fileImgTypeList.includes(extendname)) {
            //  无法识别文件类型的文件
            return this.fileImgMap.unknown
          } else {
            //  可以识别文件类型的文件
            return this.fileImgMap[extendname]
          }
        },

        //  点击文件名
        clickFileName(row) {
          //  若是目录则进入目录
          if (row.isDir) {
            this.$router.push({
              query: {
                filePath: row.filePath + row.fileName + '/',
                fileType: 0
              }
            })
          }
          //  若是文件，则进行相应的预览
          else {
            //  若当前点击项是图片
            const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
            if (PIC.includes(row.extendName)) {
              this.$emit('getImgReviewData', row, true)
            }
            //  若当前点击项是pdf
            if (row.extendName === 'pdf') {
              window.open('api' + row.fileUrl, '_blank')
            }
            //  若当前点击项是html、js、css、json
            const CODE = ['html', 'js', 'css', 'json']
            if (CODE.includes(row.extendName)) {
              window.open('api' + row.fileUrl, '_blank')
            }
            //  若当前点击项是视频mp4格式
            const VIDEO = ['mp4']
            if (VIDEO.includes(row.extendName)) {
              window.open('api' + row.fileUrl, '_blank')
            }
            //  若当前点击项是视频mp3格式
            const AUDIO = ['mp3']
            if (AUDIO.includes(row.extendName)) {
              window.open('api' + row.fileUrl, '_blank')
            }
          }
        },

         //时间格式转换
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
        // 查看
        handleView: function (index, row) {
          this.$emit('handleView', {index:index, row:row})
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
