const Mock = require('mockjs')

const otherUsers = Mock.mock({
  'items|20': [{
    token: '@id',
    username: '@first',
    password: '1234qwer',
    'roles|1': ['admin', 'editor'],
    phone: /^1[34578]\d{9}$/,
    'age|11-50': 1,
    address: '@county(true)',
    avatar() {
      return Mock.Random.image('100×100', Mock.Random.color(), '#757575', 'png', this.nickName)
    }
  }]
})

const admin = Mock.mock({
  token: 'Admin',
  username: 'admin',
  password: '1234qwer',
  roles: 'admin',
  phone: /^1[34578]\d{9}$/,
  'age|11-50': 1,
  address: '@county(true)',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
})

const editor = Mock.mock({
  token: 'Editor',
  username: 'editor',
  password: '1234qwer',
  roles: 'editor',
  phone: /^1[34578]\d{9}$/,
  'age|11-50': 1,
  address: '@county(true)',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
})

let users = []
users = users.concat(admin, editor, otherUsers.items)

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      let token
      users.forEach((u) => {
        if (u.username === username && u.password === password) {
          token = u.token
        }
      })

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '用户名或者密码不正确'
        }
      }

      return {
        code: 20000,
        data: { token }
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      let info
      users.forEach((u) => {
        if (u.token === token) {
          info = u
        }
      })

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // 获得用户列表
  {
    url: '/vue-element-admin/user/list',
    type: 'get',
    response: _ => {
      const items = users
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },

  // 返回添加用户操作的结果
  {
    url: '/vue-element-admin/user/add',
    type: 'post',
    response: config => {
      // 后端添加用户的操作，假设添加是成功的
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  },

  // 返回修改用户操作的结果
  {
    url: '/vue-element-admin/user/update',
    type: 'post',
    response: config => {
      // 后端修改用户的操作，假设修改是成功的
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  },

  // 返回删除用户操作的结果
  {
    url: '/vue-element-admin/user/delete',
    type: 'post',
    response: config => {
      // 后端删除用户的操作，假设删除是成功的
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  }
]
