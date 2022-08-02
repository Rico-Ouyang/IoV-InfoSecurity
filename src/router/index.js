import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '车联网用户信息安全系统', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人主页', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/accident',
    component: Layout,
    redirect: '/accident/all',
    name: 'accident',
    alwaysShow: true,
    meta: { title: '事故记录', icon: 'tab' },
    children: [
      {
        path: 'all',
        name: 'recentAccident',
        component: () => import('@/views/accident/all/recentAccident'),
        meta: { title: '当前事故' }
      },
      {
        path: 'index',
        component: () => import('@/views/accident/all/historyAccident'),
        name: 'historyAccident',
        meta: { title: '历史事故' }
      }
      // {
      //   path: 'complex-table',
      //   component: () => import('@/views/accident/all/complex-table'),
      //   name: 'ComplexTable',
      //   meta: { title: '历史事故' }
      // }
    ]
  },
  // {
  //   path: '/accident',
  //   component: Layout,
  //   redirect: '/accident/all',
  //   name: 'accident',
  //   alwaysShow: true,
  //   meta: { title: '事故报告', icon: 'tab' },
  //   children: [
  //     {
  //       path: 'all',
  //       name: 'accident',
  //       component: () => import('@/views/accident/all/index'),
  //       meta: { title: '所有事故', icon: 'sellingAll'
  //       }
  //     }
  //     // {
  //     //   path: 'me',
  //     //   name: 'accidentMe',
  //     //   component: () => import('@/views/accident/me/index'),
  //     //   meta: { roles: ['editor'], title: '我发起的', icon: 'sellingMe'
  //     //   }
  //     // },
  //     // {
  //     //   path: 'post',
  //     //   name: 'accidentBuy',
  //     //   component: () => import('@/views/accident/post/index'),
  //     //   meta: { roles: ['editor'], title: '我转发的', icon: 'sellingBuy'
  //     //   }
  //     // }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Charts',
  //   meta: {
  //     title: '图表',
  //     icon: 'chart'
  //   },
  //   children: [
  //     {
  //       path: 'keyboard',
  //       component: () => import('@/views/charts/keyboard'),
  //       name: 'KeyboardChart',
  //       meta: { title: 'Keyboard Chart', noCache: true }
  //     },
  //     {
  //       path: 'line',
  //       component: () => import('@/views/charts/line'),
  //       name: 'LineChart',
  //       meta: { title: '折线图', noCache: true }
  //     },
  //     {
  //       path: 'mix-chart',
  //       component: () => import('@/views/charts/mix-chart'),
  //       name: 'MixChart',
  //       meta: { title: '混合图表', noCache: true }
  //     }
  //   ]
  // },

  // 自己加的
  {
    path: '/risk',
    component: Layout,
    redirect: '/risk/2DView',
    name: 'Donating',
    alwaysShow: true,
    meta: {
      title: '风险管理',
      icon: 'tab'
    },
    children: [{
      path: '2DView',
      name: '2DView',
      component: () => import('@/views/riskmanager/2dView.vue'),
      meta: {
        title: '信息流图2D',
        // icon: 'donatingAll'
      }
    },
    {
      path: '3DView',
      name: '3DView',
      component: () => import('@/views/riskmanager/3dView.vue'),
      meta: {
        title: '信息流图3D',
        // icon: 'donatingDonor'
      }
    }, {
      path: 'AccessControl',
      name: 'AccessControl',
      component: () => import('@/views/riskmanager/AccessControl.vue'),
      meta: {
        roles: ['admin'],
        title: '接入控制',
        // icon: 'donatingGrantee'
      }
    }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '新闻发布管理',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit', roles: ['admin'],}
      },
      // 编辑已发布的新闻
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: '导出Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: '选中导出Export' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: '导出混合头部Excel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: '上传Excel' }
      }
    ]
  },

  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: '使用帮助', icon: 'guide', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
