<template>
  <div>
  <baidu-map class="map" center="中国" @ready="handler">
    <bml-marker-clusterer :averageCenter="true">
      <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}" key="maker"></bm-marker>
    </bml-marker-clusterer>
  </baidu-map>
  </div>
</template>

<script>
  import {BmlMarkerClusterer} from 'vue-baidu-map'
    export default {
      components: {
        BmlMarkerClusterer
      },
        name: "remote_upgrade",
      data () {
        return {
          markers:[{lng: 122.335103, lat: 40.971729},
            {lng: 123.291763, lat: 41.692825},
            {lng: 115.491309, lat: 43.002907},
            {lng: 107.764444, lat: 40.073205},
            {lng: 98.19785, lat: 36.060564},
            {lng: 100.92065, lat: 31.009968},
            {lng: 108.647515, lat: 34.002671},
            {lng: 109.383406, lat: 34.977604},
            {lng: 109.824942, lat: 36.477719},
            {lng: 112.400563, lat: 36.715083}
          ]

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
        }
      }
    }
</script>

<style scoped>
  .map{
    width:100%;
    height:600px;

  }
</style>
