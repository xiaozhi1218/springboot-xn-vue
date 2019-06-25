import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/login',
    method: 'post',
		type:"form",
    data: {
      username:username,
      password:password
    }
  })
}

export function getInfo() {
  return request({
    url: '/adminuser/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
