module.exports = [

  {
    url: '/vue-element-admin/permissions/add',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  },

  {
    url: '/vue-element-admin/permissions/update',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  },

  {
    url: '/vue-element-admin/permissions/delete',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  },

  {
    url: '/permissions/assign-roles',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          result: true
        }
      }
    }
  }
]
