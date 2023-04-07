import TMS from '@/api/tms'
import Vuex from 'vuex'

const store = new Vuex.Store({
	state: {
		user: null
	},
	mutations: {
		'save-user': (state, payload) => {
			state.user = payload
		}
	},
	getters: {
		userMainInfo(state){
			return state.user
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
		}
	}
})

export default store