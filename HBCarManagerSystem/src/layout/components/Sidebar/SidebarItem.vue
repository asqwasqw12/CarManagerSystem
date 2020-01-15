<template>
<div v-if="!item.hidden" class="menu-wrapper">
  <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
    <router-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <i :class="onlyOneChild.meta.icon||(item.meta && item.meta.icon)"></i>
        <span v-if="onlyOneChild.meta.title">{{ onlyOneChild.meta.title }}+main</span>
      </el-menu-item>
    </router-link>
  </template>
  <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
       <i v-if="item.meta" :class="(item.meta && item.meta.icon)||onlyOneChild.meta.icon"></i>
        <span v-if="item.meta" slot="title">{{ item.meta.title}}+sub</span>
      </template>
    <sidebar-item
    v-for="child in item.children"
    :key="child.path"
    :is-nest="true"
    :item="child"
    :base-path="resolvePath(child.path)"
    class="nest-menu"
    ></sidebar-item>
  </el-submenu>

</div>
</template>

<script>
  //<item :icon="onlyOneChild.meta.icon||(item.meta && item.meta.icon)" :title="item.meta.title"/>
  //<template slot="title">
    //<item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title">
    //</item>
    //</template>
  import path from 'path'

    export default {
        name: "SidebarItem",
      props:{
          item:{
            type:Object,
            required:true
          },
        isNest:{
            type:Boolean,
          default:false
        },
        basePath:{
            type:String,
          default:''
        }
      },
      data(){
          this.onlyOneChild = null
        return { }
      },
      methods:{
          //如果子路径为1或者0，返回1
          hasOneShowingChild( children = [],parent){
            const showingChildren = children.filter(item => {   //需要显示的子路径
              if(item.hidden){
                return false
              }else{
                this.onlyOneChild = item
                return true
              }
            })
            console.log('showingChildren:'+showingChildren);
            console.log('onlyOneChild'+this.onlyOneChild);
            if(showingChildren.length === 1){
              return true
            }
            if(showingChildren.length === 0 ){
              this.onlyOneChild = { ...parent,path:'',noShowingChildren:true }
              return true
            }
            return false
          },
        resolvePath(routePath){
          console.log(path.resolve(this.basePath,routePath))
            return path.resolve(this.basePath,routePath)  //连接路径，形成绝对路径
        }
      }
    }
</script>

<style scoped>

</style>
