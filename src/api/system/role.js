import request from '@/utils/request'

export function getRole(query){
  return request({
    url:"/role/page",
    method:"get",
    params:query
  });
}


export function save(obj){
  return request({
    url:"/role/submit",
    method:"post",
    data:obj
  });
}

export function remove(obj){
  return request({
    url:'/role/remove',
    method:'post',
    data:obj
  });
}

export function getRoleMenu(query) {
  return request({
    url:"/menu/MenuTreeByRole",
    method:'get',
    params:query
  });
}
