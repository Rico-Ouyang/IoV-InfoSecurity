import request from '@/utils/request2'
// 真后端

// 查询所有事故
export function queryAllAccidents(query) {
  return request({
    url: '/accident/info/all',
    method: 'post',
    data: query
  })
}

// 查询当日事故
export function queryNowAccidents(query) {
  return request({
    url: '/accident/info/now',
    method: 'get',
    params: query
  })
}

// 提交事故信息
export function submitAccidents(data) {
  return request({
    url: '/accident/info/submit',
    method: 'post',
    data
  })
}

// 更新事故处理状态
export function updateStatus(data) {
  return request({
    url: '/accident/info/updateStatus',
    method: 'post',
    data
  })
}

// 真后端登录
export function login(data) {
  return request({
    // headers: {
    //   'Content-Type': 'applocation/x-www-form-urlencoded'
    // },
    url: '/user/login',
    method: 'get',
    params: data
  })
}
