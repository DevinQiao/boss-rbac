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
      const { username } = config.body
      let token
      users.forEach((u) => {
        if (u.username === username) {
          token = u.token
        }
      })

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
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
    response: config => {
      const items = users
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
