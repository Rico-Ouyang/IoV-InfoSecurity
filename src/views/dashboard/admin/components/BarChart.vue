<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { queryBarAccidentsStatistics } from '@/api/statics'  // 假后端获取柱状图数据


// import { queryBarAccidentsStatistics } from '@/api/statics2'  // 真后端

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      chart: null,
      // x轴横坐标数据
      month_data: [],
      type_name: [],
      // y轴纵坐标数据
      series_data: {},
      series: [],
      time: ''
    }
  },
  // created() {
  //   this.handleData()
  // },
  mounted() {
    this.$nextTick(() => {
      this.handleData()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 处理后端数据
    handleData() {
      queryBarAccidentsStatistics().then(response => {
        if (response) {
          var data = response.data
          this.type_name = data.type_names
          // console.log(this.type_name)
          this.time = data.time
          var statisticsData = data.items
          // console.log(JSON.stringify(statisticsData))
          statisticsData.forEach(this.splitData)
          // 初始化barchart的series配置信息
          this.initSeries()
          // 初始化barchart
          this.initChart()
          // console.log("MONTH:" + this.month_data)
        }
      })
    },
    // 分离data.items中的数据，forEach方法的回调函数，变成按事故类型以月份顺序的统计
    splitData(item,index,arr) {
      // 存月份
      this.month_data.push(item.month)
      // 挨个存这个月份下的事故类型type_name的数量
      // 遍历数组，key是序号
      for (var key in this.type_name) {
        // 如果series_data的JSON中没有事故类型名，那就先创建一个key为类型名，value为空数组的键值对
        if ( !( this.type_name[key] in this.series_data )) {
          this.series_data[this.type_name[key]] = new Array()
          this.series_data[this.type_name[key]].push(item[this.type_name[key]])
        } else {
          this.series_data[this.type_name[key]].push(item[this.type_name[key]])
        }
      }
      // console.log("series" + JSON.stringify(this.series_data))
    },
    // 根据series_data来初始化bar option里面的series配置
    initSeries() {
      // 遍历JSON，key是键
      for (var key in this.series_data) {
        // console.log(key)
        this.series.push({
          name: key,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.series_data[key],
          animationDuration
        })
      }
      // console.log("series:" + JSON.stringify(this.series))
    },
    initChart() {
      console.log("init bar")

      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        backgroundColor: '#24347c', //'#243382', //'#1d2870',
        title: {
          bottom: 25,
          left: 'center',
          text: '统计时间截至 ' + this.time,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 10,
            color: '#F1F1F3be'
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // 图注
        legend: {
          left: 'center',
          bottom: '0',
          data: this.type_name,
          textStyle: {
            fontSize: 12,
            color: '#f1ffffde'
          }
        },
        // 坐标轴
        grid: {
          top: 8,
          left: '2%',
          right: '2%',
          // bottom: '3%',
          bottom: 60,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: this.month_data,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#f1ffff9e'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#f1ffff9e'
            }
          },
          // 内部坐标网格线
          splitLine: {
            lineStyle: {
              color: '#6d77ac'
            }
          }
        }],
        series: this.series
        // [{
        //   name: 'pageA',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [79, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }, {
        //   name: 'pageB',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [80, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }, {
        //   name: 'pageC',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [30, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }]
      })
    }
  }
}
</script>
