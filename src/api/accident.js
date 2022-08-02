import request from '@/utils/request'

// 查询销售(可查询所有，也可根据发起销售人查询)(发起的)
export function queryAllAccidents(query) {
  return request({
    url: '/vue-element-admin/accident/all',
    method: 'get',
    params: query
  })
}
