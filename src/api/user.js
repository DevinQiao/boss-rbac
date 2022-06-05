import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUserList() {
  return request({
    url: '/vue-element-admin/user/list',
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/vue-element-admin/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/vue-element-admin/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(token) {
  return request({
    url: '/vue-element-admin/user/delete',
    method: 'post',
    token
  })
}

export function updateUserRole(data) {
  return request({
    url: '/user/updateRole',
    method: 'post',
    data
  })
}

export function updateUserPwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data
  })
}
