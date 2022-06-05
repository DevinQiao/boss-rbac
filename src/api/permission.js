import request from '@/utils/request'

export function getPermisions() {
  return request({
    url: '/vue-element-admin/permissions',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/vue-element-admin/permissions/add',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: `/vue-element-admin/permissions/update`,
    method: 'post',
    data
  })
}

export function deletePermission() {
  return request({
    url: `/vue-element-admin/permissions/delete`,
    method: 'post'
  })
}

export function assignRoles(key) {
  return request({
    url: '/permissions/assign-roles',
    method: 'post',
    key
  })
}
