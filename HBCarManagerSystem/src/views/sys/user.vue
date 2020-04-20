<template>
  <div class="app-container" >
    <el-row :gutter="20">
      <!--侧边部门数据栏-->
      <el-col :xs="9" :sm="6"  :md="4" :lg="4" :xl="4">
        <!--工具栏-->
        <div class="head-container">
          <el-input
            v-model="queryParams.name"
            clearable
            size="small"
            placeHolder="输入用户名搜索"
            prefix-icon="filter-item"
            />
        </div>
        <!--部门数据-->
        <el-tree
          :data="deptData"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
          />
      </el-col>
      <!--用户数据栏-->
      <el-col :xs="15" :sm="18"  :md="20" :lg="20" :xl="20">
        <!--左工具栏-->
        <div class="head-container" style="float:left;">
          <!--用户名搜索框-->
          <el-input
            v-model="queryParams.realName"
            clearable
            size="small"
            style="width: 200px;"
            placeHolder="输入姓名搜索"
            prefix-icon="filter-item"
          />
          <!--注册时间搜索框-->
          <el-date-picker
            v-model="queryParams.creatTime"
            :default-time="['00:00:00','23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            style="width:220px;"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            />
          <!--用户状态栏-->
          <el-select
            v-model="queryParams.status"
            clearable
            size="small"
            placeholder="用户状态"
            class="filter-item"
            style="width:120px"
            @change="queryUser()"
            >
            <el-option v-for="item in statusOptions" :key="item.id " :value="item.id" :label="item.name">
            </el-option>
          </el-select>
          <kt-button icon="el-icon-search"  perms="sys:role:view" type="success" @click="queryUser">搜索</kt-button>
          <kt-button icon="el-icon-plus"  perms="sys:user:add" type="primary" @click="saveUser" >新增</kt-button>
        </div>
        <!--右工具栏-->
        <div class="head-container" style="float: right">
          <el-form :inline="true" :size="mini">
            <el-form-item>
              <el-button-group>
                <el-tooltip content="刷新" placement="top">
                  <el-button icon="fa fa-refresh" @click="queryUser(null)" size="small"></el-button>
                </el-tooltip>
                <el-tooltip content="列显示" placement="top">
                  <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog" size="small"></el-button>
                </el-tooltip>
                <el-tooltip content="导出" placement="top">
                  <el-button icon="fa fa-file-excel-o" @click="exportUserExcelFile" size="small"></el-button>
                </el-tooltip>
              </el-button-group>
            </el-form-item>
          </el-form>
        </div>

      </el-col>



    </el-row>

  </div>
</template>

<script>
    import {findTree} from "@/api/system/dept";
    import KtButton from "@/views/core/KtButton"
    export default {
        name: "user",
      components:{KtButton},
      data(){
          return {
            deptName:'',
            deptData:[],
            defaultProps:{
              children:'children',
              label:'name'
            },
            queryParams:{
              name:'',        //用户名
              realName:'',    //真实姓名
              status:'',      //用户状态
              creatTime:'',   //注册日期
            },
            statusOptions:[
              {
                id:'0',
                name:'禁用'
              },
              {
                id:'1',
                name:'正常'
              },
              {
                id:'2',
                name:'新用户'
              }
            ]
          }
      },
      mounted(){
          this.findDeptTree()
      },
      methods:{
        // 获取部门列表
        findDeptTree() {
          findTree().then( res => {
            this.deptData = res.data
          })
        },
        //切换部门
        handleNodeClick(data){

        },
        //查询用户列表
        queryUser(){

        },
        //新增用户列表
        saveUser(){

        }


      }
    }
</script>

<style scoped>

</style>
