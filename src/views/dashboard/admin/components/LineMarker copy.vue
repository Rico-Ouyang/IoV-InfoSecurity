<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

import { queryDynamicAccidentsStatics } from '@api/statics'
// import { queryDynamicAccidentsStatics } from '@api/statics2'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: 'calc(50vh - 50px)'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#24347c', //'#243382', //'#1d2870',
        title: {
          top: 20,
          text: '交通事故统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        // 选中指示
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: 'f1ffff'
            }
          }
        },
        legend: {
          top: 30,
          icon: 'rect',
          itemWidth: 15,
          itemHeight: 5,
          itemGap: 13,
          data: ['追尾事故', '直行事故', '超车事故', '其他事故'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: 65,
          borderWidth: 0,
          containLabel: true
        },
        // x轴样式
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#f1ffff9e'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55', '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55']
        }],
        // y轴样式
        yAxis: [{
          type: 'value',
          name: '(%)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#f1ffff9e'
            }
          },
          axisLabel: {
            margin: 10,
            // interval: 0,
            textStyle: {
              fontSize: 14
            }
          },
          // 内部坐标网格线
          splitLine: {
            lineStyle: {
              color: '#6d77ac'
            }
          }
        }],
        // 图片放缩条
        dataZoom: [{
          show: true,
          height: 20,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        // series里面放数据
        series: [{
          name: '追尾事故',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: [220, 182, 191, 134, 150, 120, 11, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        }, {
          name: '直行事故',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: [120, 110, 125, 145, 122, 165, 122, 220, 0, 191, 134, 150, 12, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
        }, {
          name: '超车事故',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122, 220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
        }, {
          name: '其他事故',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 228, 196, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(255, 228, 196, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(255, 228, 196)',
              borderColor: 'rgba(255, 228, 196, 0.2)',
              borderWidth: 12
            }
          },
          data: [12, 11, 12, 15, 22, 15, 12, 20, 0, 11, 13, 50, 1, 10, 15, 45, 22, 15, 22, 20, 82, 91, 34, 50]
        }]
      })
    }
  }
}
</script>


<!-- <style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  color: #f1ffff91;
}
</style> -->

