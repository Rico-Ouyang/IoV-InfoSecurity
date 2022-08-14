<template>
     <div id="container"></div>
</template>
<style  scoped>
    #container{
        padding:0px;
        margin: 0px;
        width: 100%;
        height: 800px;
    }
</style>
<script>
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: 'MyMap2',
  data(){
      return{
        map:null,
     } 
  },
  mounted(){
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  methods:{
    initMap(){
        AMapLoader.load({
            key:"c0a89b1e51b7db060a0a69b435ded806",             // 申请好的Web端开发者Key，首次调用 load 时必填
            securityJsCode: '47c8354058245520b3c15d5de2284431',
            version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins:[''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        }).then((AMap)=>{
            this.map = new AMap.Map("container",{  //设置地图容器id
                viewMode:"3D",    //是否为3D地图模式
                zoom:5,           //初始化地图级别
                center:[105.602725,37.076636], //初始化地图中心点位置
            });
        }).catch(e=>{
            console.log(e);
        })
    },
},
}
</script>