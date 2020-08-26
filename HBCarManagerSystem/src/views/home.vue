<template>
  <div >
    <div class="search-container">
      <!--公司数据-->
      <treeselect
        :options="treeSelectData"
        placeholder="选择公司"
        @select="selectFun"
      />
    </div>
    <baidu-map class="map" center="中国" :zoom="map.zoom" @ready="handler" >
      <!--缩放-->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <!--定位-->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <!--点-->
      <bml-marker-clusterer :averageCenter="true" >
      <bm-marker v-if="companyList.length>0"
                 v-for="company in companyList"
                 :key ="company.id"
                 :position="{ lng:company.latitude,lat:company.longitude}"
                 @click="OpenWindow($event,company)"
                 :draggable="map.dragging"
                 animation="BMAP_ANIMATION_DROP">
        <bm-label :content="company.name" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -35, height: 30}" :position="{lng:company.latitude,lat:company.longitude}"/>
      </bm-marker>
      </bml-marker-clusterer>
      <bm-info-window :show= "infoWindowDisplay"
                      :title="`<h4 style='padding:0px;margin:0px;text-align: center;'>`+company.name+`</h4>`"
                      @close="infoWindowClose()"
                      :width= 400
                      :auto-pan="true"
                      :position="infoWindowPosition"
                      @open="infoWindowOpen()">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <ul class="vehicle-info info-left">
              <li><svg-icon icon-class="login" />环卫人员：<div class="vehicle-right">{{ company.personNum }}&nbsp;人</div></li>
              <li><svg-icon icon-class="user1" /> 环卫车辆： <div class="vehicle-right" >88&nbsp;俩</div></li>
              <li><svg-icon icon-class="phone" /> 公厕管理： <div class="vehicle-right">100&nbsp;座</div></li>
              <li><svg-icon icon-class="email" /> 中转站管理：<div class="vehicle-right">10&nbsp;座</div></li>
              <li><svg-icon icon-class="dept" /> 垃圾桶保洁： <div class="vehicle-right"> 1200&nbsp个</div></li>
              <li><svg-icon icon-class="anq" /> 机械化作业率：<div class="vehicle-right">{{company.mechineRate }}</div></li>
            </ul>
          </el-col>
          <ul class="vehicle-info right">
            <li><svg-icon icon-class="login" />服务人口：<div class="vehicle-right">{{ company.serviceNum }}&nbsp;人</div></li>
            <li><svg-icon icon-class="user1" /> 垃圾清运： <div class="vehicle-right" >{{ company.rubbishVolume }}&nbsp;吨/天</div></li>
            <li><svg-icon icon-class="phone" /> 非机动车辆（人力）：<div class="vehicle-right">28&nbsp;辆</div></li>
            <li><svg-icon icon-class="email" /> 非机动车辆（电动）：<div class="vehicle-right">28&nbsp;辆</div></li>
            <li><svg-icon icon-class="dept" /> 绿化保洁面积： <div class="vehicle-right"> {{ company.greenArea }}&nbsp;万平方米</div></li>
            <li><svg-icon icon-class="anq" /> 清洁保洁面积：<div class="vehicle-right">{{ company.cleanArea }}&nbsp;万平方米</div></li>
          </ul>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          </el-col>
        </el-row>
          <div>
            <span>
              <router-link to="/car/car_overview">
               <el-button size="small" icon="fa fa-male" > 车辆监察</el-button>
              </router-link>
            </span>
            <span>
              <router-link :to="{ path:'/project/info',query:{id:company.id }}">
               <el-button size="small" icon="fa fa-male" >项目信息</el-button>
              </router-link>
            </span>
          </div>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
  import {BmlLushu,BmLabel,BmlMarkerClusterer} from 'vue-baidu-map'
  import { mapGetters } from 'vuex'
  import store from '@/store'
  import router from '@/router/routers'
  import { findAll } from "@/api/vehicleLocation/vehicleLocation";
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {findTree} from "@/api/system/dept";
    export default {
      components: {
        BmlLushu,
        BmLabel,
        BmlMarkerClusterer,
        Treeselect
      },
        name: "home",
      data(){
        return{
          companyList:[],
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
          },
          treeSelectData:[
          {
            id:1,
            label:'合加新能源汽车有限公司'
          }
        ],
        map:{
          center:{
            lng:113.136844,  //中车电动汽车股份有限公司经度
            lat:27.82916     //中车电动汽车股份有限公司纬度
          },
            zoom:5,
            show:true,
            dragging:true,
            keyword:"中车",
            location:"",
        },
          position:{
            lng: 116.404,
            lat: 39.915
          },
          icon: {
            url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
            size: {width: 30, height: 24},
            opts: {anchor: {width: 27, height:13}}
          },
        drivingDisplay:false,   //行车路线显示属性
          trailDisplay:false,    //轨迹显示属性
          searchDisplay:false,   //搜索组件显示属性
          infoWindowDisplay:false,    //标注点信息显示属性
          infoWindowTitle:"<h4 style='padding:0px;margin:0px;text-align: center;'>项目信息</h4>",
          infoWindowPosition:{
            lng:113.136844,  //中车电动汽车股份有限公司经度
            lat:27.82916     //中车电动汽车股份有限公司纬度
        },
        online:false,
          play: true,
          path: [],
      }

      },
      created(){
        this.findDeptTree()
      },
      //离开之前关闭infoWindow
      beforeRouteLeave(to,from,next){
         console.log("准备离开"+from.name+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
         this.infoWindowDisplay = false;
         next()
      },
      methods:{
        // 获取公司树和公司列表
        findDeptTree() {
          findTree({'name':''}).then( res => {
            this.treeSelectData = this.filterDeptTree(res.data)
            this.companyList = this.getCompanyList(res.data)
          })
        },
        //获取vue-treeselect对象
        filterDeptTree(deptTree) {
          const res = []
          deptTree.forEach(dept => {
            if(dept.isCompany ===1){
              const tmp = {
                id: dept.id,
                label: dept.name,
                latitude:dept.latitude, //经度
                longitude:dept.longitude, //纬度
              }
              if (dept.children.length > 0) {
                if(this.filterDeptTree(dept.children).length>0){
                  tmp.children = this.filterDeptTree(dept.children)
                }
              }
              res.push(tmp)
            }
          })
          return res
        },
        //获取companyList
        getCompanyList(deptTree){
          let res = []
          deptTree.forEach(dept=>{
            if(dept.isCompany ===1) {
              const tmp = {
                id: dept.id,
                name: dept.name,  //单位名称
                parentId:dept.parentId, //父Id
                parentName:dept.parentName, //父单位名称
                address:dept.address,  //单位地址
                telephone:dept.telephone, //单位座机
                website:dept.website, //单位网址
                industry:dept.industry, //单位行业
                remarks:dept.remarks,  //单位简介
                orderNum:dept.orderNum, //排序
                isCompany:dept.isCompany, //是否为公司，公司==1，部门==0
                delFlag:dept.delFlag,  //删除标志
                personNum:dept.personNum, //环卫人员数量
                serviceNum:dept.serviceNum,//服务人口（万）
                cleanArea:dept.cleanArea, //清扫保洁面积(万平方米）
                greenArea:dept.greenArea, //绿化带面积(万平方米）
                mechineRate:dept.mechineRate, //机械化作业率
                rubbishVolume:dept.rubbishVolume, //垃圾清运量（吨/天）
                renewableResourcesVolume:dept.renewableResourcesVolume, //可再生资源回收（吨/月）
                workStartTime:dept.workStartTime, //进场时间
                administrativeDivision:dept.administrativeDivision, 	//行政区域
                latitude:dept.latitude, //经度
                longitude:dept.longitude, //纬度
                juridicalPerson:dept.juridicalPerson, //公司法人
                registeredTime:dept.registeredTime, //注册时间
                registeredCapital:dept.registeredCapital, //注册资金
                stockRate:dept.stockRate, //持股说明
                manager:dept.manager, //总经理
                managerPhone:dept.managerPhone, //总经理电话
                viceManager:dept.viceManager,   //副总经理
                viceManagerPhone:dept.viceManagerPhone, //副总经理电话
                fax:dept.fax  //传真
              }
              if (dept.children && dept.children.length > 0) {
                res = res.concat(this.getCompanyList(dept.children))
              }
              res.push(tmp)
            }
          })
           return res
        },
        // 点击部门搜索对应的岗位
        selectFun(node, instanceId) {
          this.map.setZoom(15);
          this.map.panTo(new BMap.Point(node.latitude,node.longitude));

          //this.getJobs(node.id)
          //this.form.job.id = null
        },
        handler({BMap,map }){
          let me=this
          this.map = map
          console.log(BMap,map)
          //鼠标缩放
          map.enableScrollWheelZoom(true);
          //点击事件获取经纬度
          map.addEventListener('click',function(e){
            console.log(e.point.lng,e.point.lat)
          })

          /*//下面为功能测试
          setTimeout(function(){
            map.panTo(new BMap.Point(113.262232,23.154345));
          }, 5000);
          let pointGZ = new BMap.Point(113.262232,23.154345);
          let pointHK = new BMap.Point(110.35,20.02);
          let myIcon = new BMap.Icon
          ("http://developer.baidu.com/map/jsdemo/img/fox.gif",new BMap.Size
          (300,157));
          //创建标注
          let marker = new BMap.Marker(pointHK,{icon:myIcon});
          let marker1 = new BMap.Marker(pointGZ,{icon:myIcon});
          //将标注放大地图上
          map.addOverlay(marker);
          map.addOverlay(marker1);*/
          /*let myIcon = new BMap.Icon("markers.png", new BMap.Size(23, 25), {
            offset: new BMap.Size(10, 25),
            imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
          });*/
          //this.getCurlocation()
        },
        //标注弹框关闭
        infoWindowClose() {
          this.infoWindowDisplay = false;
        },
        //标注弹框打开
        infoWindowOpen() {
          this.infoWindowDisplay = true;
        },
        //
        OpenWindow(event,company ){
          this.infoWindowDisplay =true
          this.infoWindowPosition = event.target.point
          this.company = company
        },
      }


    }
</script>

<style scoped>
  .map{
    width:100%;
    min-height: calc(100vh - 84px);
    height:600px;

  }
  .search-container {
    width: 240px;
    position: absolute;
    left:55px;
    top:94px;
    z-index: 10
  }
  .vehicle-info {
    padding-left: 0;
    list-style: none;
  }
  .info-left{
    /*border-right:  1px solid #F0F3F4;*/
  }
  .vehicle-info li {
    text-align: left;
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .vehicle-right {
    float: right;
    margin-right: 20px;
  }
  /*去掉百度logo，建议不用去掉*/
  >>>.anchorBL {

    display: none!important;

  }

</style>
