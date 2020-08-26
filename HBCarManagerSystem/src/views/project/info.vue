<template>
  <div class="app-container">
    <el-container>
      <el-header height="160px">
        {{ company.name }}
      </el-header>
      <el-container>
      <el-aside>
        <h3>项目简介</h3>
        <p>{{company.remarks}}</p>
      </el-aside>
      <el-main>
        <h3>项目总览</h3>
        <el-card>
        <p>公司id：{{ company.id }}</p>
        <p>公司名称：{{ company.name }}</p>
        <p>法人代表：{{ company.juridicalPerson }}</p>
        <p>注册时间：{{ company.registeredTime }}</p>
        <p>办公地址：{{ company.address}}</p>
        <p>办公电话：{{ company.telephone }}</p>
        <p><span>总经理：{{ company.manager }}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;电话：{{ company.managerPhone}}</span></p>
        <p><span>总经理：{{ company.viceManager }}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;电话：{{ company.viceManagerPhone}}</span></p>
        </el-card>
      </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
    import {findById} from "@/api/system/dept";

    export default {
        name: "info",
      data(){
          return{
            company:{
              id: 3,
              name: '中车时代电动股份有限公司',  //单位名称
              parentId:null, //父Id
              parentName:null, //父单位名称
              address:'',  //单位地址
              telephone:'', //单位座机
              website:'', //单位网址
              industry:'', //单位行业
              remarks:'',  //单位简介
              orderNum:'', //排序
              isCompany:1, //是否为公司，公司==1，部门==0
              delFlag:0,  //删除标志
              personNum:'', //环卫人员数量
              serviceNum:'',//服务人口（万）
              cleanArea:'', //清扫保洁面积(万平方米）
              greenArea:'', //绿化带面积(万平方米）
              mechineRate:'', //机械化作业率
              rubbishVolume:'', //垃圾清运量（吨/天）
              renewableResourcesVolume:'', //可再生资源回收（吨/月）
              workStartTime:'', //进场时间
              administrativeDivision:'', 	//行政区域
              latitude:113.136844, //经度
              longitude:27.82916, //纬度
              juridicalPerson:'', //公司法人
              registeredTime:'', //注册时间
              registeredCapital:null, //注册资金
              stockRate:'', //持股说明
              manager:'', //总经理
              managerPhone:'', //总经理电话
              viceManager:'',   //副总经理
              viceManagerPhone:'', //副总经理电话
              fax:'' //传真
            }
          }
      },

      //由于页面使用的缓存(routers.js设置组件的noCache),所以使用生命周期函数activated保证每次打开时能够加载query参数
      activated() {
          this.getCompany()
      },
      methods:{
          getCompany(){
            let id = this.$route.query.id
           console.log("id ="+ id +"!!!!!!!!!!!!!!!!!!!!!!!!!!")
            this.company.id = this.$route.query.id
            findById({'id':id }).then(res =>{
              this.company = res.data
              }).catch(error=>{
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          }
      }
    }
</script>

<style scoped>
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    height:160px;
    line-height: 160px;
    font-size:50px;
  }
   .el-footer{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 20px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 20px;
  }
</style>
