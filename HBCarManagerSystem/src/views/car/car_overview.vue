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
      <!--<el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="webSocketSend()">发送消息</el-button>
        <el-input v-model="map.location"></el-input>
      </div>
      <div>
        {{vehicleStatusList}}
      </div>
      </el-card>-->
      <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
        <!--缩放-->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <!--定位-->
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <!--点-->
        <bm-marker v-if="vehicleStatusList"
                   v-for="status in vehicleStatusList"
                   :key ="status.vehicleId"
                   :position="{lat:status.location.latitude,lng:status.location.longitude}"
                   :title="status.vehicle.name"
                   @click="OpenWindow($event,status)"
                   :draggable="map.dragging"
                   :icon  = "online ? icon1:icon2"
                   animation="BMAP_ANIMATION_DROP">
        </bm-marker>
        <bm-info-window :show= "infoWindowDisplay"
                        :title="infoWindowTitle"
                        @close="infoWindowClose()"
                         :width= 300
                        :auto-pan="true"
                        :position="infoWindowPosition"
                        @open="infoWindowOpen()">
          <ul class="vehicle-info">
            <li><svg-icon icon-class="login" />车辆名称<div class="vehicle-right">{{ vehicleStatus.vehicle.name }}/{{vehicleStatus.vehicle.type}}</div></li>
            <li><svg-icon icon-class="user1" /> 车辆牌照 <div class="vehicle-right" v-if="vehicleStatus.vehicle.license !==null && vehicleStatus.vehicle !==null">{{ vehicleStatus.vehicle.license }}</div></li>
            <li><svg-icon icon-class="phone" /> 定位状态 <div class="vehicle-right">{{ vehicleStatus.vehicleId }}</div></li>
            <li><svg-icon icon-class="email" /> 通讯卡号<div class="vehicle-right">{{ vehicleStatus.location.terminalPhone }}</div></li>
            <li><svg-icon icon-class="dept" /> 当前速度 <div class="vehicle-right"> {{ vehicleStatus.location.speed }}&nbsp;km/h</div></li>
            <li><svg-icon icon-class="anq" /> 上装状态<div class="vehicle-right">{{ vehicleStatus.vehicleId }}</div></li>
          </ul>
        </bm-info-window>
        <el-input v-model="locationInput"> </el-input>
        <bm-local-search v-if = "searchDisplay" class="search" style="float:left" :keyword="locationInput" :auto-viewport="true" :location="map.location"></bm-local-search>
        <!--行车路径-->
        <bm-driving v-if="drivingDisplay" start="合加新能源汽车有限公司" end="咸宁区交通运输局" @searchcomplete="handleSearchComplete" :panel="false" :autoViewport="true"></bm-driving>
          <bml-lushu v-if="trailDisplay"
            @stop="reset"
            :path="path"
            :icon="icon1"
            :play="play"
            :speed="1000"
            :rotation="true">
         </bml-lushu>
      </baidu-map>
    </div>
</template>

<script>
  import {BmlLushu} from 'vue-baidu-map'
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
        Treeselect
      },
        name: "car_overview",
      data(){
          return {
            locationInput:'',
            deptData:[],
            treeSelectData:[
              {
                id:1,
                label:'合加新能源汽车有限公司'
              }
            ],
            websock:{},
            lockReconnect:false,
            tt:{},
            BMap:{},
            map:{
              center:{
                lng:113.136844,  //中车电动汽车股份有限公司经度
                lat:27.82916     //中车电动汽车股份有限公司纬度
              },
              zoom:15,
              show:true,
              dragging:true,
              keyword:"中车",
              location:""
            },

            drivingDisplay:false,   //行车路线显示属性
            trailDisplay:false,    //轨迹显示属性
            searchDisplay:true,   //搜索组件显示属性
            infoWindowDisplay:false,    //标注点信息显示属性
            infoWindowTitle:"<h4 style='padding:0px;margin:0px;text-align: center;'>车辆信息</h4>",
            infoWindowPosition:{
              lng:'',
              lat:'',
            },
            //车辆状态
            vehicleStatus:{
                vehicleId:null,
                vehicle:{},
               location:{}
            },
            online:false,
            play: true,
            path: [],
            icon1: {
              //url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
              url:require('../../assets/marker_truck2.png'),
              size: {width: 30, height: 24},
              opts: {anchor: {width: 27, height:13}}
            },
            icon2: {
              //url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
              url:require('../../assets/marker_truck2_offline.png'),
              size: {width: 30, height: 24},
              opts: {anchor: {width: 27, height:13}}
            },
            vehicleStatusList:[],
          }
      },
        computed: {
          ...mapGetters(['websocketApi'])
        },
      created(){
        this.initWebSocket()
      },
      mounted(){
        this.findDeptTree()
      },
      beforeDestroy(){
        console.log('断开websock连接')
        if(this.websock !== null && this.websock !==''){
          this.websock.close()
        }
      },


      methods:{

        // 获取部门列表
        findDeptTree() {
          findTree({'name':''}).then( res => {
            //this.deptData = res.data
            this.deptData = res.data.filter((item) => item.isCompany ==1 )
            this.treeSelectData = this.filterDeptTree(res.data)
          })
        },
        //获取vue-treeselect对象
        filterDeptTree(deptList) {
          const res = []
          deptList.forEach(dept => {
            if(dept.isCompany ===1){
              const tmp = {
                id: dept.id,
                label: dept.name,
              }
              if (dept.children && dept.children.length > 0) {
                if(this.filterDeptTree(dept.children).length>0){
                  tmp.children = this.filterDeptTree(dept.children)
                }
              }
              res.push(tmp)
            }
          })
          return res
        },
        // 点击部门搜索对应的岗位
        selectFun(node, instanceId) {
          //this.getJobs(node.id)
          //this.form.job.id = null
        },

          handler({BMap,map }){
            let me=this
            this.BMap= BMap
            this.map = map
            console.log(BMap,map)
            //鼠标缩放
            map.enableScrollWheelZoom(true);
            //点击事件获取经纬度
            map.addEventListener('click',function(e){
              console.log(e.point.lng,e.point.lat)
            })

            //下面为功能测试
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
            map.addOverlay(marker1);
            /*let myIcon = new BMap.Icon("markers.png", new BMap.Size(23, 25), {
              offset: new BMap.Size(10, 25),
              imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
            });*/
            //this.getCurlocation()
          },
        reset () {
          this.play = false
        },
        handleSearchComplete (res) {
          this.path = res.getPlan(0).getRoute(0).getPath()
        },
        getCurlocation() { // 获取浏览器当前定位
          if (!this.BMap) return false
          let BMap = this.BMap
          let geolocation = new BMap.Geolocation()
          let _this = this
          geolocation.getCurrentPosition(function (r) {
            _this.map.center = r.point
           // _this.map_center = r.point
           // _this.shop_lng = r.point.lng
           // _this.shop_lat = r.point.lat
          })
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
        OpenWindow(event,vehicleStatus){
          this.infoWindowDisplay =true
          this.infoWindowPosition = event.target.point
          this.vehicleStatus = vehicleStatus
        },
        initWebSocket() {
          const wsUri = this.websocketApi + '/vehicleStatus/'+store.getters.name
          if('WebSocket' in window){
            this.websock = new WebSocket(wsUri)
          }else{
            this.$notify({
              title: 'browser no support websocket',
              type: 'error',
              duration: 0
            })
          }

          this.websock.onerror = this.webSocketOnError
          this.websock.onopen = this.webSocketOnOpen
          this.websock.onmessage = this.webSocketOnMessage
          router.afterEach(() =>{
            this.websock.close()
          })
        },
        webSocketOnError(e) {
          this.$notify({
            title: 'WebSocket连接发生错误',
            type: 'error',
            duration: 0
          })
        },
        webSocketOnOpen(e){
            console.log("成功建立websocket!!!!!!")
           //心跳检测重置
          //this.reconnect()
        },

        webSocketOnMessage(e) {
          console.log("接收到服务端消息！！！！")
          console.log("e.data="+e.data)
          const data = JSON.parse(e.data)
          console.log("data="+data)
          if(data !== null)
          {
            this.vehicleStatusList = data
          } else {
            this.$notify({
              title: '',
              message: data.msg,
              dangerouslyUseHTMLString: true,
              type: 'error',
              duration: 0
            })
          }
        },
        //重连机制
        reconnect(){
          if(this.lockReconnect) {
            return
          }
          this.lockReconnect = true;
          //没连接上会一直重连，设置延迟避免请求过多
          this.tt && clearTimeout(this.tt);
          this.tt = setTimeout(function () {
            this.initWebSocket()
            this.lockReconnect = false
          }, 4000)
        },
        //心跳检测
       // heartCheck() {

       // },
        webSocketSend(agentData) {
          let message = 'websocket  message from client-' + store.getters.name
          findAll().then(response => {
            console.log('准备开始发送数据。。。')
            console.log(this.websock)
            this.websock.send(message)
          }).catch(error => {
          })
        }
      }
    }
</script>

<style scoped>
.map{
  width:100%;
  height:450px;

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
.vehicle-info li {
  text-align: left;
  border-bottom: 1px solid #F0F3F4;
  padding: 11px 0;
  font-size: 13px;
}

.vehicle-right {
  float: right;
}
/*去掉百度logo，建议不用去掉*/
>>>.anchorBL {

  display: none!important;

}
</style>
