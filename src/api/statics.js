import request from '@/utils/request'

// 查询实时事故类型统计数据
export function queryDynamicAccidentsStatistics(query) {
  return request({
    url: '/accident/statistics/dynamic',
    method: 'get',
    params: query
  })
}

// 查询所有事故类型统计数据——饼图
export function queryPieAccidentsStatistics(query) {
  return request({
    url: '/accident/statistics/allTypes',
    method: 'get',
    params: query
  })
}

// 查询月份事故类型统计数据——柱状图
export function queryBarAccidentsStatistics(query) {
  return request({
    url: '/accident/statistics/month',
    method: 'get',
    params: query
  })
}

// 查询地图标号
export function queryMapAccidentsMarkers(query) {
  return request({
    url: '/accident/statistics/addressMarkers',
    method: 'get',
    params: query
  })
}


