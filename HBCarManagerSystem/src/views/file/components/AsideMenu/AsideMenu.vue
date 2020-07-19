<template>
  <div class="aside-menu-wrapper" :class="{'expand': !isFolder}">
    <div class="aside-title">
      <i class="el-icon-share" ></i>
      <span >项目文档</span>
      <el-tooltip class="item" effect="dark" content="收起分类栏" placement="bottom-end">
        <i
          class="el-icon-d-arrow-left"
          v-show="!isFolder"
          @click="isFolder = true"
        ></i>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="展开分类栏" placement="bottom-start">
        <i
          class="el-icon-d-arrow-right"
          v-show="isFolder"
          @click="()=>{isFolder = false}"
        ></i>
      </el-tooltip>
    </div>
    <div class="file-tree-wrapper">
      <el-tree
        class="file-tree"
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        default-expand-all
        @node-click="handleNodeClick"
        @node-contextmenu="rightClick"
      >
       <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
                <i :class="node.icon"></i><img :src="setFileImg(data.extendName,node)" style="width: 15px;" />
            </span>
            <span v-if="data.isDir !==1">{{node.label}}.{{data.extendName}}</span>
            <span v-else>{{node.label}}</span>
        </span>
      </el-tree>
      <ul v-show="menuVisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="download(node,nodeData)">下载</li>
        <li @click="upload(node,nodeData)">上传</li>
        <li @click="createFolder(node,nodeData)">新建文件夹</li>
        <li @click="deleteFile(node,nodeData)">删除</li>
        <li @click="rename(node,nodeData)">重命名</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import variables from '@/styles/variables.scss'
  export default {
    name: 'AsideMenu',
    props:{
      data:{
        type:Array
      },
    },
    data() {
      return {
        fileListByFileType: [],
        isFolder:true,
        menuVisible:false,    //菜单显示
        nodeData:{},         //树节点当前数据
          node:{},           //树节点信息
        left:0,
        top:0,
        deptData:[{
            id:1,
            name:"金典环卫集团",
            icon:"",
          extendName:"",
            children:[{
                id:5,
              name:"北京分公司",
              icon:"",
              extendName:"",
            children:[{
                  id:7,
              name:"技术部",
              icon:"",
              extendName:"png"
            },
              {
                id:10,
                name:"市场部",
                icon:"",
                extendName:"png"
              }]
            }]
        },
          {
            id:2,
            name:"人人洁集团",
            icon:"",
            extendName:"",
            children:[{
              id:4,
             name:"上海分公司",
              icon:"",
              extendName:"",
              children:[
                {
                  id:8,
                  name:"销售部",
                  icon:"",
                  extendName:"jpg"
                }
              ]
            },
              {
                id:36,
                name:"北京分公司",
                icon:"",
                extendName:"",
                children:[{
                  id:37,
                  name:"技术部",
                  icon:"",
                  extendName:"doc"
                },
                  {
                    id:38,
                    name:"销售部",
                    icon:"",
                    extendName:"pdf",
                  }]

              }]
          }],
        defaultProps:{
          children:'children',
          label:'name'
        },
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
    computed: {
      variables(){
        return variables
      },
    },
    watch:{
      menuVisible(value){
       /* if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }*/
      }
    },
    methods: {
      //  导航菜单项点击事件
      handleSelect(index) {

        this.$router.push({
        path: '/file/list',
        query: { title: index, fileType: index }
       })
      },
      //  根据文件扩展名设置文件图片
      setFileImg(extendname,node) {
        console.log("树节点node="+node)
        if (extendname === null || extendname==="") {
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
      //文件树右键函数
      rightClick(event,object,value,element){
        this.nodeData = object;//存当前数据
        this.node = value;//存当前节点信息
        this.menuVisible=true//让菜单显示
        /* 菜单定位基于鼠标点击位置 */
        this.left = event.clientX + 20 ;
        this.top = event.clientY -10 ;
        document.addEventListener("click", this.Listen);//添加监听，监听鼠标事件
      },
      //鼠标点击事件
      Listen() {
        this.menuVisible = false;
        document.removeEventListener("click", this.Listen);
      },
      //关闭文件树右键菜单
      closeMenu() {
        this.menuVisible = false
      },

      //下载
      download(node,data){

      },

      //上传
      upload(node,data){

      },

      //新建文件夹
      createFolder(node,data){
        console.log("当前data为：",data);
        this.$prompt('请输入文件夹名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:'新建文件夹',
          inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,//匹配中文字符、英文字母、_、数字
          inputErrorMessage: '文件夹格式不正确'
        }).then(({ value }) => {
          const newChild = { id: 198, name: value,extendName:"", children: [] };
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild);
        }).catch(() => {
        });

      },

      //删除文件or文件夹
      deleteFile(node,data){
        console.log("当前node为：",node);
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      //重命名
      rename(node,data){
        let reg
        reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
        /*if(data.extendName === null || data.extendName === ""){
          reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
        }else{
          reg = /^([\u4e00-\u9fa5_a-zA-Z0-9]+)\.([a-zA-Z0-9]+)/
        }*/
        this.$prompt('请输入名称(无需输入文件后缀）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:data.name,
          inputPattern: reg,
          inputErrorMessage: '请由汉字字母数字下划线自由组合'
        }).then(({ value }) => {
          data.name=value
        }).catch(() => {
        });
      },
      //切换部门
      handleNodeClick(data){
        this.menuVisible = false;
        document.removeEventListener("click", this.Listen);
        console.log("data.id="+data.id)
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .aside-menu-wrapper {
    width: 150px;
    transition: width 0.5s;
    -webkit-transition: width 0.5s;
    .aside-title {
      color: #303133;
      height: 80px;
      line-height: 80px;
      font-size: 18px;
      text-align: center;
      position: relative;
      background-color:$green;
      .el-icon-d-arrow-left {
        position: absolute;
        right: 6px;
        top: 32px;
        cursor: pointer;
      }

      .el-icon-d-arrow-right {
        cursor: pointer;
      }

      > > > .el-menu {
        border-right:none;
      }
    }
    .file-tree-wrapper{
      .file-tree{
        position:relative;
      }
      .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: fixed;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

        li {
          margin: 0;
          padding: 7px 16px;
          cursor: pointer;

          &:hover {
            background: #eee;
          }
        }
      }
    }
  }
  .expand {
    width: 350px;

    > > > .el-menu {
      .el-menu-item {
        padding-left: 40px !important;
        border-right: none;
      }
    }
  }
</style>
