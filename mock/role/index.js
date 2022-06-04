const Mock = require('mockjs')
const { deepClone } = require('../utils')
const { asyncRoutes, constantRoutes } = require('./routes.js')

const routes = deepClone([...constantRoutes, ...asyncRoutes])
const users = []
for (let i = 0; i < 8; i++) {
  users.push(Mock.Random.first())
}
Mock.Random.extend({
  usersForRole: users,
  'newUsers': function() {
    return this.pick(this.usersForRole, 1, 5)
  }
})

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: '超级管理员，可以访问所有的界面。',
    status: '启用',
    routes: routes,
    users: '@newUsers'
  },
  {
    key: 'editor',
    name: 'editor',
    description: '普通管理员，可以看到自己拥有的所有界面。',
    status: '启用',
    routes: routes.filter(i => i.path !== '/permission'), // just a mock
    users: '@newUsers'
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: '普通访问者，只能查看系统首页。',
    status: '启用',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }],
    users: '@newUsers'
  }
]

module.exports = [
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: roles.length,
          roles: roles,
          users: users
        }
      }
    }
  },

  // add role
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)'),
        result: true
      }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        result: true
      }
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        result: true
      }
    }
  },

  // 分配用户
  {
    url: '/role/assign-users',
    type: 'post',
    response: {
      code: 20000,
      data: {
        result: true
      }
    }
  },

  // 分配权限
  {
    url: '/role/assign-permissions',
    type: 'post',
    response: {
      code: 20000,
      data: {
        result: true
      }
    }
  }
]
