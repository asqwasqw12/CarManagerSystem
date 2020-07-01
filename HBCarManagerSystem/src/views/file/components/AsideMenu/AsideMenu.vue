<template>
  <div class="aside-menu-wrapper" :class="{'expand': !isFolder}">
    <div class="aside-title">
      <i class="el-icon-share" v-show="!isFolder"></i>
      <span v-show="!isFolder">项目文档</span>
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
    <el-menu
      class="aside-menu"
      :default-openeds="[0]"
      :default-active="activeIndex"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <i class="el-icon-menu" title="全部"></i>
        <span slot="title" v-show="!isFolder">全部</span>
      </el-menu-item>
      <el-menu-item index="1" title="图片">
        <i class="el-icon-picture"></i>
        <span slot="title" v-show="!isFolder">图片</span>
      </el-menu-item>
      <el-menu-item index="2" title="文档">
        <i class="el-icon-document"></i>
        <span slot="title" v-show="!isFolder">文档</span>
      </el-menu-item>
      <el-menu-item index="3" title="视频">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title" v-show="!isFolder">视频</span>
      </el-menu-item>
      <el-menu-item index="4" title="音乐">
        <i class="el-icon-headset"></i>
        <span slot="title" v-show="!isFolder">音乐</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import variables from '@/styles/variables.scss'
  export default {
    name: 'AsideMenu',
    data() {
      return {
        fileListByFileType: [],
        isFolder:false
      }
    },
    computed: {
      //  当前活跃菜单项index，也是当前被选中的文件类型
      activeIndex: {
        get() {
          return String(this.$route.query.fileType)
        },
        set() {
          return '0'
        }
      },
      variables(){
        return variables
      },
    },
    methods: {
      //  导航菜单项点击事件
      handleSelect(index) {
        this.$router.push({
        path: '/file/list',
        query: { title: index, fileType: index }
       })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .aside-menu-wrapper {
    width: 59px;
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
        border: none;
      }
    }
  }
  .expand {
    width: 150px;

    > > > .el-menu {
      .el-menu-item {
        padding-left: 40px !important;
      }
    }
  }
</style>
