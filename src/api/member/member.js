import request from '@/utils/request'

export function memberPage(query) {
    return request({
		url:"/member/page",
		method:"get",
		params:query
	});
}