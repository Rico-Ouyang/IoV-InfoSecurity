<template>
  <div id="container">
    <el-amap 
      :zoom="zoom"
      :center="center"
      class="amap-demo"
      view-mode="3D"
      map-style="amap://styles/9bb0865c9a6dfe0f9a96d78539ee56dc"
      :showLabel=true
      :features="map_features">
      <!-- 默认图层 -->
      <!-- <el-amap-layer-default map-style="amap://styles/blue"></el-amap-layer-default> -->
      <!--  指南针 -->
      <el-amap-control-control-bar :visible="visible" map-style="amap://styles/9bb0865c9a6dfe0f9a96d78539ee56dc"></el-amap-control-control-bar>
      <!-- 路况、路网、卫星地图切换 :showTraffic="true"-->
      <el-amap-control-map-type :visible="visible" map-style="amap://styles/9bb0865c9a6dfe0f9a96d78539ee56dc"></el-amap-control-map-type>
      <!-- 鹰眼控件 -->
      <el-amap-control-hawk-eye :visible="visible" :showButton=true map-style="amap://styles/9bb0865c9a6dfe0f9a96d78539ee56dc"></el-amap-control-hawk-eye>
      <!-- 实时交通图层 -->
      <!-- <el-amap-layer-traffic :visible="visible"></el-amap-layer-traffic> -->
      <el-amap-loca @init="initLoca">
        <el-amap-loca-scatter :visible="visible" :sourceData="redSourceUrl" :layer-style="redLayerStyle" :zIndex="113" @click="showDetails"></el-amap-loca-scatter>
        <el-amap-loca-scatter :visible="visible" :sourceData="greenSourceUrl" :layer-style="greenLayerStyle" :zIndex="111"></el-amap-loca-scatter>
        <!-- <el-amap-loca-scatter :visible="visible" :sourceData="orangeSourceUrl" :layer-style="orangeLayerStyle" :zIndex="112" @click="showDetails"></el-amap-loca-scatter> -->
      </el-amap-loca>
      <el-amap-info-window
          :position="position"
          :visible.sync="infoVisible"
          :closeWhenClickMap=true>
          <div>
            <p>测试slot</p>
          </div>
      </el-amap-info-window>
    </el-amap>
    <div class="toolbar">
      <button type="button" name="button" @click="toggleVisible">{{visible ? '隐藏标记' : '显示标记'}}</button>
    </div>
  </div>
</template>

<style  scoped>
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    /* color: #00ff73ce; */
    /* height: 1000px; */
  }
  .amap-demo {
    height: 500px
  }
</style>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: 'MyMap',
  data() {
      return{
        yes: true,
        // 地图要显示的东西
        map_features: ['bg','point','road','building'],
        // 信息窗体的位置
        position: [],
        map:null,
        zoom: 11,
        center: [113.97199630737305, 22.5807295363949],
        infoVisible: true,
        visible: true,
        redSourceUrl: require('../../../../data/Map/red.json'),
        greenSourceUrl: require('../../../../data/Map/green.json'),
        orangeSourceUrl: require('../../../../data/Map/orange.json'),
        redLayerStyle: {
          unit: 'meter',
          size: [2000, 2000],
          borderWidth: 0,
          texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
          duration: 800,
          animate: true,
        },
        greenLayerStyle: {
          unit: 'meter',
          size: [250, 250],
          color: '#00e1ffce',
          borderWidth: 0,
          // texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
          duration: 800,
          animate: true,
        },
        orangeLayerStyle: {
          unit: 'meter',
          size: [1500, 1500],
          borderWidth: 0,
          texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
          duration: 800,
          animate: true,
        }
      }
  },
  // watch: {
  //   'position': function(val) {
  //     this.infoVisible = true
  //   }
  // },
  methods:{
    showDetails(feature) {
      if (feature) {
        this.position = feature.coordinates
        this.infoVisible = true
        console.log(this.position)
        let prop = feature.properties
        let message = '事故地点：' + prop.name + ',事故时间：' + prop.month
        this.$notify({
          title: '事故信息',
          message: message,
          offset: 200
        });
        console.log(feature)
      }
    },
    initMap(){
        // AMapLoader.load({
        //     key:"",             // 申请好的Web端开发者Key，首次调用 load 时必填
        //     version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        //     plugins:[''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        // }).then((AMap)=>{
        //   this.map = new AMap.Map("container",{  //设置地图容器id
        //     viewMode:"3D",    //是否为3D地图模式
        //     // zoom:5,           //初始化地图级别
        //     // center:[105.602725,37.076636], //初始化地图中心点位置
        //   });
        // }).catch(e=>{
        //     console.log(e);
        // })
    },
    toggleVisible() {
      this.visible = !this.visible;
    },
    initLoca(loca){
      loca.animate.start();
    }
  },
  // mounted(){
  //   //DOM初始化完成进行地图初始化
  //   // this.initMap();
  // }
};

</script>