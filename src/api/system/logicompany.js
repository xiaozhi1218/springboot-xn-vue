import request from '@/utils/request'
export function page(query){
  return request({
    url:'/logicompany/page',
    method:'get',
    params:query
  })
}

export function remove(query) {
  return request({
    url:'/logicompany/remove',
    method:'post',
    data:query
  });
}

export function submit(query) {
  return request({
    url:'/logicompany/submit',
    data:query,
    method:'post'
  })
}
