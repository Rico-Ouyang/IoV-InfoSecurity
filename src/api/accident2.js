import request from '@/utils/request2'

// 查询销售(可查询所有，也可根据发起销售人查询)(发起的)
export function queryAllAccidents() {
  return request({
    url: '/user/accident/all',
    method: 'post',
  })
}
