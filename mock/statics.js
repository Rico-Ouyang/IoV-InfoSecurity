const Mock = require('mockjs')

const List = []
const count = 50

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({
//     time: '@datetime',
//     time: '@now',
//     // title: '@title(5, 10)',
//     // importance: '@integer(1, 3)',
//     直行事故: '@integer(0, 200)',
//     超车事故: '@integer(0, 200)',
//     追尾事故: '@integer(0, 200)',
//     其他事故: '@integer(0, 200)',
//   }))
// }
var Random = Mock.Random
List.push(Mock.mock({
  date: '@datetime',
  time: '@now',
  // title: '@title(5, 10)',
  // importance: '@integer(1, 3)',
  直行事故: '@integer(0, 300)',
  超车事故: '@integer(0, 300)',
  追尾事故: '@integer(0, 300)',
  其他事故: '@integer(0, 600)',
}))

module.exports = [
//   {
//     url: '/user/accident/all',
//     type: 'get',
//     response: config => {
//       const { user_id, accident_name, page = 1, limit = 20, sort, start_month, end_month, search_date } = config.query

//       let mockList = List.filter(item => {
//         // if (importance && item.importance !== +importance) return false
//         if (user_id && item.user_id !== user_id) return false
//         if (accident_name && item.accident_name.indexOf(accident_name) < 0) return false
//         if (search_date && item.time < search_date) return false
//         if (end_month && item.time > end_month) return false
//         if (start_month && item.time < start_month) return false
//         return true
//       })

//       if (sort === '-time') {
//         mockList = mockList.reverse()
//       }

//       const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

//       return {
//         code: 20000,
//         data: {
//           total: mockList.length,
//           items: pageList
//         }
//       }
//     }
//   },

//   {
//     url: '/user/accident/now',
//     type: 'get',
//     response: config => {
//       const { importance, accident_type, title, page = 1, limit = 20, sort } = config.query

//       let mockList = List.filter(item => {
//         if (importance && item.importance !== +importance) return false
//         if (accident_type && item.accident_type !== accident_type) return false
//         if (title && item.title.indexOf(title) < 0) return false
//         return true
//       })

//       if (sort === '-id') {
//         mockList = mockList.reverse()
//       }

//       const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

//       return {
//         code: 20000,
//         data: {
//           total: mockList.length,
//           items: pageList
//         }
//       }
//     }
//   },

  {
    url: '/accident/statistics/dynamic',
    type: 'get',
    response: config => {
      const { id } = config.query
      return {
        code: 20000,
        data: {
          date: '@datetime',
          time: '@now',
          // title: '@title(5, 10)',
          // importance: '@integer(1, 3)',
          直行事故: Random.integer(0, 100),
          超车事故: Random.integer(0, 100),
          追尾事故: Random.integer(0, 100),
          其他事故: Random.integer(0, 100),
        }
        // data: {
        //   // total: List.length,
        //   items: List
        // }
      }
    }
  },
  {
    url: '/accident/statistics/allTypes',
    type: 'get',
    response: config => {
      const { id } = config.query
      return {
        code: 20000,
        data: {
          type_names: ["超车事故", "追尾事故", "直行事故", "其他事故"],
          date: '@datetime',
          time: '@now',
          // title: '@title(5, 10)',
          // importance: '@integer(1, 3)',
          直行事故: Random.integer(20, 200),
          超车事故: Random.integer(20, 200),
          追尾事故: Random.integer(20, 200),
          其他事故: Random.integer(20, 200),
        }
        // data: {
        //   // total: List.length,
        //   items: List
        // }
      }
    }
  },
  {
    url: '/accident/statistics/month',
    type: 'get',
    response: config => {
      const { id } = config.query
      return {
        code: 20000,
        data: {
          type_names: ["超车事故", "追尾事故", "直行事故", "其他事故"],
          date: '@datetime',
          time: '@now',
          // title: '@title(5, 10)',
          // importance: '@integer(1, 3)',
          items: [
            {
              month: "一月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            },
            {
              month: "二月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            },
            {
              month: "三月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            },
            {
              month: "四月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            },
            {
              month: "五月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            },
            {
              month: "六月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            },
            {
              month: "七月",
              直行事故: Random.integer(20, 200),
              超车事故: Random.integer(20, 200),
              追尾事故: Random.integer(20, 200),
              其他事故: Random.integer(20, 200),
            }
          ]
          
        }
        // data: {
        //   // total: List.length,
        //   items: List
        // }
      }
    }
  }
]
