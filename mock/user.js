const sha256 = require('js-sha256')
const Mock = require('mockjs')

const rolesArray = ['admin', 'editor']
Mock.Random.extend({
  rowsForUser: rolesArray,
  'newRoles': function() {
    return this.pick(this.rowsForUser, 1, this.rowsForUser.length)
  }
})

const otherUsers = Mock.mock({
  'items|20': [{
    id: '@id',
    username: '@first',
    password: '1234qwer',
    roles: '@newRoles',
    'status|1': ['启用', '禁用'],
    phone: /^1[34578]\d{9}$/,
    'age|20-50': 1,
    address: '@county(true)',
    'avatar|1': ['a-ziyuan80', 'a-ziyuan85', 'a-ziyuan87', 'a-ziyuan88', 'a-ziyuan89', 'a-ziyuan90', 'a-ziyuan92', 'a-ziyuan95', 'a-ziyuan97', 'a-ziyuan98', 'a-ziyuan100', 'a-ziyuan101', 'a-ziyuan102', 'a-ziyuan103', 'a-ziyuan104', 'a-ziyuan105', 'a-ziyuan106', 'a-ziyuan107', 'a-ziyuan108', 'a-ziyuan112']
  }]
})

const admin = Mock.mock({
  id: 'Admin',
  username: 'admin',
  password: '1234qwer',
  roles: ['admin'],
  status: '启用',
  phone: /^1[34578]\d{9}$/,
  'age|20-50': 1,
  address: '@county(true)',
  avatar: 'a-ziyuan80'
})

const editor = Mock.mock({
  id: 'Editor',
  username: 'editor',
  password: '1234qwer',
  roles: ['editor'],
  status: '启用',
  phone: /^1[34578]\d{9}$/,
  'age|20-50': 1,
  address: '@county(true)',
  avatar: 'a-ziyuan89'
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
      const tempInfo = { username, password }
      let token
      users.forEach((u) => {
        if (u.username === username && u.password === password) {
          token = sha256(JSON.stringify(tempInfo))
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
        const { username, password } = u
        const temp = { username, password }
        if (sha256(JSON.stringify(temp)) === token) {
          info = u
        }
      })

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '登录失败，无法获得用户信息。'
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
  },

  // 返回修改用户角色操作的结果
  {
    url: '/user/updateRole',
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
  }
]
