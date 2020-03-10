<template>
    <div>
      <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
        <!--缩放-->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <!--定位-->
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <!--点-->
        <bm-marker :position="map.center" :draggable="map.dragging" animation="BMAP_ANIMATION_DROP">
          <!--提示信息-->
          <bm-info-window :show="map.show">Hello，合加新能源汽车</bm-info-window>
        </bm-marker>
          <!--行车路径-->
          <bm-driving start="合加新能源汽车有限公司" end="咸宁区交通运输局" @searchcomplete="handleSearchComplete" :panel="false" :autoViewport="true"></bm-driving>
          <bml-lushu
            @stop="reset"
            :path="path"
            :icon="icon"
            :play="play"
            :speed="1000"
            :rotation="true">
          </bml-lushu>

      </baidu-map>
    </div>
</template>

<script>
  import {BmlLushu} from 'vue-baidu-map'
    export default {
      components: {
        BmlLushu
      },
        name: "car_overview",
      data(){
          return {
            map:{
              center:{
                lng:114.339969,
                lat:29.871057
              },
              zoom:15,
              show:true,
              dragging:true
            },
            play: true,
            path: [],
            icon: {
              url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
              size: {width: 52, height: 26},
              opts: {anchor: {width: 27, height:13}}
            }
          }
      },
      methods:{
          handler({BMap,map }){
            let me=this;
            console.log(BMap,map)
            //鼠标缩放
            map.enableScrollWheelZoom(true);
            //点击事件获取经纬度
            map.addEventListener('click',function(e){
              console.log(e.point.lng,e.point.lat)
            })
          },
        reset () {
          this.play = false
        },
        handleSearchComplete (res) {
          this.path = res.getPlan(0).getRoute(0).getPath()
        }
      }
    }
</script>

<style scoped>
.map{
  width:100%;
  height:600px;

}
/*去掉百度logo，建议不用去掉*/
>>>.anchorBL {

  display: none!important;

}
</style>
