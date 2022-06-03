import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * 公共路由
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
      }
    ]
  }
]

/**
 * 异步路由（权限路由）
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '用户管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/index'),
        name: 'UserList',
        meta: { title: '用户信息管理', icon: 'peoples' }
      },
      {
        path: 'user-role',
        component: () => import('@/views/user/user-role'),
        name: 'UserRoleList',
        meta: { title: '用户角色分配', icon: 'peoples' }
      }
    ]
  },

  {
    path: '/role',
    component: Layout,
    redirect: '/role/list',
    name: 'Role',
    meta: { title: '角色管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: 'list',
        component: () => import('@/views/role/index'),
        name: 'RoleList',
        meta: { title: '角色管理', icon: 'user' }
      }
    ]
  },

  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/list',
    name: 'Resource',
    meta: { title: '资源管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: 'list',
        component: () => import('@/views/resource/index'),
        name: 'ResourceList',
        meta: { title: '资源管理', icon: 'user' }
      }
    ]
  },

  // 404 必须放在最后面
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
