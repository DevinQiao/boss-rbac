import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import db from '@/utils/localstorage'
import request from '@/utils/request'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const constRoutes = [
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
        name: '系统首页',
        meta: { title: '系统首页', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/personal-center',
    component: Layout,
    redirect: '/personal-center/show',
    name: 'PersonalCenter',
    meta: { title: '个人中心', icon: 'user' },
    children: [
      {
        path: 'show',
        component: () => import('@/views/personal-center/index'),
        name: 'Show',
        meta: { title: '个人信息', icon: 'user' }
      },
      {
        path: 'resetPwd',
        component: () => import('@/views/personal-center/reset-password'),
        name: 'ResetPassword',
        meta: { title: '重置密码', icon: 'password' }
      }
    ]
  }
]

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constRoutes
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const token = db.get('ACCESS_TOKEN')
    const user = db.get('USER')
    const userRouter = get('USER_ROUTER')
    if (token.length && user) {
      if (!asyncRouter) {
        if (!userRouter) {
          request.get(`system/user/getMenuList`).then((res) => {
            const permissions = user.authorities
            store.commit('account/setPermissions', permissions)
            asyncRouter = res.data.data
            store.commit('account/setRoutes', asyncRouter)
            save('USER_ROUTER', asyncRouter)
            go(to, next)
          })
        } else {
          asyncRouter = userRouter
          go(to, next)
        }
      } else {
        next()
      }
    } else {
      if (to.path === '/login') {
        next()
      } else {
        next('/login')
        NProgress.done()
      }
    }
  }
})

router.afterEach((to, from) => {
  if (to.path === '/login') {
    asyncRouter = null
  }
  NProgress.done()
})

function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({ ...to, replace: true })
}

function save(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function get(name) {
  return JSON.parse(localStorage.getItem(name))
}

function filterAsyncRouter(routes) {
  return routes.filter((route) => {
    const component = route.component
    if (component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

function view(path) {
  return (resolve) => require([`@/views${path}.vue`], resolve)
}

export default router
