const Mock = require('mockjs')

const List = []
const count = 50

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    time: '@datetime',
    accident_id: '@increment',
    timestamp: +Mock.Random.date('T'),
    user_id: '@first',
    // title: '@title(5, 10)',
    // importance: '@integer(1, 3)',
    'accident_type|1': ['1', '2', '3', '4'],
    'accident_name|1': ['追尾事故', '直行事故', '超车事故', '其他事故'],
    address_name: '@county(true)',
    'status|1': ['已出警', '待处理'],
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    update_time: '@now'
  }))
}

module.exports = [
  {
    url: '/accident/info/all',
    type: 'post',
    response: config => {
      const { user_id, accident_name, page = 1, limit = 20, sort, start_month, end_month, search_date } = config.query

      let mockList = List.filter(item => {
        // if (importance && item.importance !== +importance) return false
        if (user_id && item.user_id !== user_id) return false
        if (accident_name && item.accident_name.indexOf(accident_name) < 0) return false
        if (search_date && item.time < search_date) return false
        if (end_month && item.time > end_month) return false
        if (start_month && item.time < start_month) return false
        return true
      })

      if (sort === '-time') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/accident/info/now',
    type: 'get',
    response: config => {
      const { importance, accident_type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (accident_type && item.accident_type !== accident_type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        message: "success",
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/accident/info/submit',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        message: "提交成功！",
        data: {
          message: 'success'
        }
      }
    }
  },

  {
    url: '/accident/info/updateStatus',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success',
        message: "已出警"
      }
    }
  }
]

