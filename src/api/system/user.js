import request from '@/utils/request'

export function page(query){
	return request({
		url:"/adminuser/page",
		method:"get",
		params:query
	});
}
//查找区域负责人
export function findAdminFromRegions(query){
  return request({
    url:"/adminuser/findAdminFromRegions",
    method:"get",
    params:query
  });
}

//修改区域负责人
export function changeRegionAdmin(query){
  return request({
    url:"/adminuser/changeRegionAdmin",
    method:"get",
    params:query
  });
}


export function save(obj){
	return request({
		url:"/adminuser/save",
		method:"post",
		data:obj
	});
}

export function remove(obj){
	return request({
		url:'/adminuser/remove',
		method:'post',
		data:obj
	});
}
