import request from '@/utils/request'


export function nav() {
  return request({
    url: "/menu/tree",
    method: 'get'
  });
}

export function detail(id) {
  return request({
    url: "/menu/detail",
    method: "get",
    params: id
  });
}
export function saveOrUpdate(obj) {
  return request({
    url: "/menu/saveOrUpdate",
    data: obj,
    method: "post"
  });
}

export function iconFont(obj) {
  return request({
    url: "/menu/iconfont/page",
    params: obj,
    method: "get"
  });
}

export function menuDelete(id) {
  return request({
    url: "/menu/delete/" + id,
    method: 'post'
  });
}
