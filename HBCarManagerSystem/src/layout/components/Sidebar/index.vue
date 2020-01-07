<template>
    <div :class="{'has-logo':showLogo}">
      <logo v-if="showLogo" :collapse="isCollapse"></logo>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
          >
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path"/>
        </el-menu>
      </el-scrollbar>

    </div>
</template>

<script>
    import SidebarItem from "@/layout/components/Sidebar/SidebarItem";
    import Logo from "@/layout/components/Sidebar/Logo";
    import { mapGetters } from 'vuex'
    import variables from '@/styles/variables.scss'
    export default {
        name: "index.vue",
      components: {SidebarItem,Logo },

      data(){
          return {
            showLogo:true
          }
      },
      computed:{
          ...mapGetters([
            'permission_routes',
            'sidebar'
          ]),
        activeMenu(){
            const route = this.$route
          const { meta, path } = route
          if(meta.activeMenu){
            return meta.activeMenu
          }
          return path
        },
        variables(){
            console.log('variables=' ,variables)
            return variables
        },
        isCollapse(){
            return !this.sidebar.opened
        }
      },

    }
</script>

<style scoped>

</style>
