<!-- <template>
    <div class="amap-page-container">
      <el-amap :zoom="zoom" :center="center" :show-label="false" class="amap-demo" view-mode="3D">
        <el-amap-loca @init="initLoca">
          <el-amap-loca-scatter :visible="visible" :source-url="sourceUrl" :layer-style="layerStyle" :zIndex="112"></el-amap-loca-scatter>
          <el-amap-loca-scatter :visible="visible" :sourceData="greenSourceUrl" :layer-style="layerStyle2" :zIndex="111"></el-amap-loca-scatter>
        </el-amap-loca>
      </el-amap>
      <div class="toolbar">
        <button type="button" name="button" @click="toggleVisible">{{visible ? '隐藏标记' : '显示标记'}}</button>
      </div>
    </div>
  </template>

  <style>
    .amap-demo {
      height: 500px;
    }
  </style>

<script>
    module.exports = {
      name: 'MapMap',
      data() {
        return {
          zoom: 11,
          center: [113.97199630737305, 22.5807295363949],
          visible: true,
          sourceUrl: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_F.json',
          greenSourceUrl: require('../../../../data/Map/green.json'),
          layerStyle: {
             unit: 'meter',
              size: [2600, 2600],
              borderWidth: 0,
              texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
              duration: 500,
              animate: true,
          },
          layerStyle2: {
             unit: 'meter',
              color: 'rgba(43,156,75,1)',
              size: [150, 150],
              borderWidth: 0,
              // texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_green.png',
              duration: 500,
              animate: true,
          }
        };
      },
      methods: {
        toggleVisible() {
          this.visible = !this.visible;
        },
        initLoca(loca){
          loca.animate.start();
        }
      }
    };
</script> -->
<template>
    <div class="amap-page-container">
      <el-amap  :zoom="zoom" :center="center"  :show-label="false" :zooms="[2, 30]" :show-building-block="false" view-mode="3D" :pitch="55" @init="initMap" class="amap-demo">
        <el-amap-layer-three :lights="lights" :zooms="[2, 30]">
          <el-amap-three-gltf v-if="position" :visible="visible" url="/car4.gltf" :position="position" :scale="20" :angle="angle" :rotation="rotation" :height="height" @click="()=>{click(position)}" @mouseover="mouseover" @mouseout="mouseout" @init="initCar"></el-amap-three-gltf>
        </el-amap-layer-three>
      </el-amap>
      <div class="toolbar">
        <button type="button" name="button" @click="toggleVisible">{{visible ? '隐藏图层' : '显示图层'}}</button>
        <button type="button" name="button" @click="moveCar">移动车辆</button>
        <button type="button" name="button" @click="stopCar">停止移动</button>
        <button type="button" name="button" @click="changeAngle">旋转车辆角度</button>
        <button type="button" name="button" @click="disposeCar">{{position ? '销毁车辆' : '生成车辆'}}</button>
      </div>
    </div>
  </template>

  <style>
    .amap-demo {
      height: 800px;
    }
  </style>

  <script>
    module.exports = {
      name: 'MapMap',
      data() {
        return {
          zoom: 20,
          center: [116.306206, 39.975468],
          visible: true,
          position: [116.306206, 39.975468],
          angle: 90,
          rotation: {x:90, y:0, z:0},
          height: 50,
          timer: null,
          lights: [
            {
              type: 'DirectionalLight', // 灯光类型， 可选值见下面的字典
              args: [0xffffff, 1], // 灯光初始化时需要的参数，具体参数顺序可以查看threejs官网灯光的说明。 采用 ...args 的方式进行初始化
              position: {
                x: 1000,
                y: -100,
                z: 900
              }, // 光源的位置
            },
            {
              type: 'AmbientLight', // 灯光类型， 可选值见下面的字典
              args: [0xffffff, 0.3], // 灯光初始化时需要的参数，具体参数顺序可以查看threejs官网灯光的说明。 采用 ...args 的方式进行初始化
            }
          ],
          
        };
      },
      mounted(){
      },
      methods: {
        toggleVisible(){
          this.visible = !this.visible;
        },
        initMap(map){
        },
        initCar(car){
          console.log('car: ', car);
        },
        moveCar(){
          let position = this.position;
          this.position = [position[0], position[1]+0.000001];
          this.timer = setTimeout(() => {
            this.moveCar();
          }, 300)
        },
        stopCar(){
          clearTimeout(this.timer);
        },
        disposeCar(){
          if(this.position){
            this.position = null;
          }else{
            this.position = [116.306206, 39.975468];
          }
        },
        click(e){console.log('click: ', e)},
        mouseover(e){console.log('mouseover: ', e)},
        mouseout(e){console.log('mouseout: ', e)},
        init(object, $vue){
          $vue.$$startAnimations();
        },
        changeAngle(){
          this.angle += 10;
        }
      }
    };
</script>