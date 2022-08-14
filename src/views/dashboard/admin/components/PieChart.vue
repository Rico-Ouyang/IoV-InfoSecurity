<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

import { queryPieAccidentsStatistics } from '@/api/statics'  // 假后端
// import { queryPieAccidentsStatistics } from '@/api/statics2' // 真后端

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
      type_name: [], // 类型名称
      series_data: [], // 饼图option中的series data配置项
      time: '',
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.initChart()
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
      queryPieAccidentsStatistics().then(response => {
        if (response) {
          var data = response.data
          this.type_name = data.type_names
          // console.log(this.type_name)
          this.time = data.time
          var statisticsData = data
          // console.log(JSON.stringify(statisticsData))

            for (var key in this.type_name) {
              if ( this.type_name[key] in statisticsData ) {
                this.series_data.push({
                  value: statisticsData[this.type_name[key]],
                  name: this.type_name[key]
                })
              }
            }

          // 初始化barchart
          this.initChart()
          // console.log("MONTH:" + this.month_data)
        }
      })
    },
    initChart() {
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
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
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
          top: 10,
          left: '2%',
          right: '2%',
          // bottom: '3%',
          bottom: 60,
          containLabel: true
        },
        series: [
          {
            name: '事故总数统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95], // 圆心大小
            center: ['50%', '38%'], // 位置
            data: this.series_data,
            // [
            //   { value: 320, name: '超车事故' },
            //   { value: 240, name: '追尾事故' },
            //   { value: 149, name: '直行事故' },
            //   { value: 296, name: '其他事故' }
            // ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
