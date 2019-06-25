import request from '@/utils/request'


export function nav() {
  return request({
    url:"/regions/tree",
    method:'get'
  });
}

export function detail(id){
  return request({
    url:"/regions/detail",
    method:"get",
    params:id
  });
}
export function saveOrUpdate(obj) {
  return request({
    url:"/regions/saveOrUpdate",
    data:obj,
    method:"post"
  });
}

export function regionsDelete(obj) {
  return request({
    url:"/regions/deleteRegions",
    method:'post',
    data: obj
  });
}
