<template>
<section class="app-main">
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="cachedViews">
      <router-view :key="key"></router-view>
    </keep-alive>
  </transition>
  <div  v-if="$store.state.settings.showFooter" id="el-main-footer">
    <span v-html="$store.state.settings.footerTxt" />
    <span> ⋅ </span>
    <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
  </div>
</section>
</template>

<script>
    export default {
        name: "AppMain",
      computed:{
          cachedViews(){
            console.log("到底发生什么了！！！！="+ this.$store.state.tagsView.cachedViews)
            return this.$store.state.tagsView.cachedViews
          },
        key(){
            console.log('this.route.path:'+this.$route.path)
            return this.$route.path
        }
      }
    }
</script>

<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }
  #el-main-footer {
    background: none repeat scroll 0 0 white;
    border-top: 1px solid #e7eaec;
    overflow: hidden;
    padding: 10px 6px 0 6px;
    height: 33px;
    font-size: 0.7rem !important;
    color: #7a8b9a;
    letter-spacing: 0.8px;
    font-family: Arial, sans-serif !important;
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
  }
  .hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }

</style>
