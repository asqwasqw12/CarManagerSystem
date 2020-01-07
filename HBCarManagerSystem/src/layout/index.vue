<template>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
      <sidebar class="sidebar-container"></sidebar>
      <div  class="main-container">
        <div :class="{'fixed-header':true }">
          <navbar></navbar>
        </div>
        <app-main></app-main>
        <router-view/>
      </div>
    </div>

</template>

<script>
  import { mapState } from 'vuex';
  import AppMain from "@/layout/components/AppMain";
  import Navbar from "@/layout/components/Navbar";
  import Sidebar from "@/layout/components/Sidebar"
  import TagsView from '@/layout/components/TagsView'
    export default {
        name: "index.vue",
      components: {AppMain,Navbar,Sidebar,TagsView},
      computed:{
        ...mapState({
          sidebar:state => state.app.sidebar,
          device: state => state.app.device
        }),
        classObj() {
          return {
            hideSidebar: !this.sidebar.opened,
            openSidebar: this.sidebar.opened,
            withoutAnimation:this.sidebar.withoutAnimation,
            mobile: this.device === 'mobile'
          }
        }
      },
      methods:{
        handleClickOutside(){
          this.$store.dispatch('closeSideBar',{ withoutAnimation:false})
        }
      }
    }
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  @import "@/styles/mixin.scss";
  @import "@/styles/sidebar.scss";
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sidebarWidth});
    transition: width 0.28s;
  }
  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

</style>
