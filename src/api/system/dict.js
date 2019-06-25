import request from '@/utils/request'

export function dicts(){
	return request({
		url:"/dict/list",
		method:"get",
	});
}

export function dictData(query){
	return request({
		url:"/dictdata/page",
		method:"get",
		params:query
	});
}