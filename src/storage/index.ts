import TMS from '@/api/tms'
import Vuex from 'vuex'
import order from './order'

const store = new Vuex.Store({
	state: {
		user: null,
		isShowTabs: true,
	},
	modules:{
		order,
	},
	mutations: {
		'save-user': (state, payload) => {
			state.user = payload
		},
		'toggle-tabs': (state) => {
			state.isShowTabs = !state.isShowTabs
		}
	},
	getters: {
		userMainInfo(state){
			return state.user
		},
		isShowTabs(state){
			return state.isShowTabs
		}
	},
	actions: {
		'setup-user': (store) => {
			TMS.getUserInfo().then(userInfo => {
				if (userInfo.data["err"]){
				  throw new userInfo.data["err"]
				}
				
				store.commit('save-user', userInfo.data)
			})
		},
		'toggle-tabs': (store) => {
			store.commit('toggle-tabs')
		}
	}
})

export default store