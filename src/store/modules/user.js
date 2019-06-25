import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {nav} from '@/api/system/menu'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
		menus:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
		SET_MENUS: (state,menus)=>{
		  state.menus=menus;
		},
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
					var token=data;
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_NAME', data.username)
					console.log("set username")
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
		GetMenus({commit,state}){
		  return new Promise((resolve,reject)=>{
		    nav().then(response=>{
          console.log("********************");
          console.log(response);
          console.log("********************");
		      const menus=response.data;
					menus.forEach((item)=>{
						item.meta={
							title: item.name,
							icon: item.icon
						}
						if(item.children&&item.children.length>0){
							item.children.forEach((child)=>{
								child.meta={
									title: child.name,
									icon: child.icon
								}
							})
						}
					});
		      commit('SET_MENUS',menus);
		      resolve(response);
		    }).catch(error=>{
		      reject(error);
		    });
		  });
		},
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
