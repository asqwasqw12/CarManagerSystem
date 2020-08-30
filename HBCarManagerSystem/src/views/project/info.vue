<template>
  <div class="app-container">
    <el-container>
      <el-header height="300px">
      </el-header>
      <el-container>
      <el-aside>
        <h3>项目简介</h3>
        <p>{{company.remarks}}</p>
      </el-aside>
      <el-main>
        <h3>{{ company.name }}</h3>
        <el-row :gutter="20">
          <el-col class="col-container" :span="8">
                <ul class="company-info">
                  <li><svg-icon icon-class="login" />法人代表:<div class="company-right">{{ company.juridicalPerson }}</div></li>
                  <li><svg-icon icon-class="user1" /> 注册时间: <div class="company-right">{{ formatDate(company.registeredTime) }}</div></li>
                  <li><svg-icon icon-class="user1" /> 注册资金: <div class="company-right">{{ company.registeredCapital }}</div></li>
                  <li><svg-icon icon-class="user1" /> 所属行业: <div class="company-right">{{ company.industry }}</div></li>
                  <li><svg-icon icon-class="email" /> 办公电话: <div class="company-right">{{ company.telephone }}</div></li>
                  <li><svg-icon icon-class="email" /> 传真号: <div class="company-right">{{ company.fax }}</div></li>
                  <li><svg-icon icon-class="user1" /> 持股说明: <div class="company-right">{{ company.stockRate }}</div></li>
                  <li><svg-icon icon-class="phone" /> 公司网址:<span>&nbsp;<a :href="company.website" target="_blank">{{company.website}}</a></span></li>
                  <li><svg-icon icon-class="phone" /> 行政区域:<span>&nbsp;{{company.administrativeDivision}}</span></li>
                  <li><svg-icon icon-class="phone" /> 办公地址:<span>&nbsp;{{company.address}}</span></li>
                </ul>
          </el-col>
          <el-col class="col-container" :span="8">
            <ul class="company-info ">
              <li><svg-icon icon-class="dept" /> 总经理: <div class="company-right"> {{ company.manager }}</div></li>
              <li><svg-icon icon-class="dept" /> 总经理电话: <div class="company-right"> {{ company.managerPhone }}</div></li>
              <li><svg-icon icon-class="dept" /> 副总经理: <div class="company-right"> {{ company.viceManager}}</div></li>
              <li><svg-icon icon-class="dept" /> 副总电话: <div class="company-right"> {{ company.viceManagerPhone }}</div></li>
              <li><svg-icon icon-class="login" />进场时间：<div class="company-right">{{ formatDate(company.workStartTime) }}</div></li>
              <li><svg-icon icon-class="login" />环卫人员：<div class="company-right">{{ company.personNum }}（人）</div></li>
              <li><svg-icon icon-class="login" />服务人口：<div class="company-right">{{ company.serviceNum }}（万人）</div></li>
              <li><svg-icon icon-class="login" />清扫保洁面积：<div class="company-right">{{ company.cleanArea }}（万平方米）</div></li>
              <li><svg-icon icon-class="login" />绿化带面积：<div class="company-right">{{ company.greenArea }}（万平方米）</div></li>
              <li><svg-icon icon-class="login" />垃圾清运量：<div class="company-right">{{ company.rubbishVolume }}（吨/天）</div></li>
            </ul>
          </el-col>
          <el-col class="col-container" :span="8">
            <ul class="company-info ">
              <li><svg-icon icon-class="login" />可再生资源回收：<div class="company-right">{{ company.renewableResourcesVolume }}（吨/月）</div></li>
              <li><svg-icon icon-class="anq" /> 机械化作业率：<div class="company-right">{{company.mechineRate }}</div></li>
              <li><svg-icon icon-class="user1" /> 环卫车辆： <div class="company-right" >辆</div></li>
              <li><svg-icon icon-class="phone" /> 公厕管理： <div class="company-right">座</div></li>
              <li><svg-icon icon-class="email" /> 中转站管理：<div class="company-right">座</div></li>
              <li><svg-icon icon-class="dept" /> 垃圾桶保洁： <div class="company-right">个</div></li>
            </ul>
          </el-col>
        </el-row>
      </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
    import {findById} from "@/api/system/dept";
    import { formatWithSeperator } from "@/utils/datetime"
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
      mounted(){
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
          },
        formatDate(date){
            if(date === null || date===""){
              return null
            }
          return formatWithSeperator(date,'-')//parseTime(date,'{y}-{m}-{d}')
        },
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "~@/assets/styles/element-variables.scss";
  .el-header{
    color: #333;
    text-align: center;
    line-height: 350px;
    font-size:50px;
    background: url('../../assets/images/project/project_info2.png') no-repeat center;
    background-size:cover;
    background-origin: border-box;
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
    line-height: 30px;
    margin-bottom:0px;
  }
  .col-container{
    border-right: #7abaff 1px solid;
  }
  .col-container:last-child{
    border-right: none;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 20px;

  }
  .company-info {
    padding-left: 0;
    list-style: none;

  li {
    text-align: left;
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
    a{
      text-decoration: underline;
      color:$--color-primary
    }
  }

  .company-right {
    float: right;
    margin:auto 5px;
  }

  }

</style>
