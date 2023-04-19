import TMS from '@/api/tms'
import Vuex from 'vuex'
import order from './order'
import User from '@/assets/user'

interface userState{
	user: User,
	workers: Array<User>
	managers: Array<User>
	isShowTabs: boolean
}

function getDefaultState():userState{
	return {
		user: new User({}),
		workers: [],
		managers: [],
		isShowTabs: true,
	}
}

const store = new Vuex.Store({
	state: getDefaultState(),
	modules:{
		order,
	},
	mutations: {
		'save-user': (state, payload) => {
			state.user = payload
		},
		'save-staff': (state, staff:Array<User>) => {
			state.workers = staff.filter((user:User) => user.roleId == 1)
			state.managers = staff.filter((user:User) => user.roleId == 2)
		},
		'toggle-tabs': (state) => {
			state.isShowTabs = !state.isShowTabs
		}
	},
	getters: {
		userMainInfo(state){
			return state.user
		},
		staffWorkers(state){
			return state.workers
		},
		isShowTabs(state){
			return state.isShowTabs
		}
	},
	actions: {
		'setup-staff': (store) => {
			TMS.user().getStaffList().then(response => {
				if (response.data["err"]){
					throw new response.data["err"]
				}

				let staffList:Array<User> = []
				const staffInfo:Array<Object> = response.data
				staffInfo.forEach((orderInfo) => {
					staffList.push(new User(orderInfo))
				})
				store.commit('save-staff', staffList)
			})
		},
		'setup-user': (store) => {
			TMS.getUserInfo().then(userInfo => {
				if (userInfo.data["err"]){
				  throw new userInfo.data["err"]
				}
				
				store.commit('save-user', new User(userInfo.data))
				let roleId:number = userInfo.data["roleId"]
				if (roleId == 2 || roleId == 3){
					store.dispatch('setup-staff')		
				}
			})
		},
		'toggle-tabs': (store) => {
			store.commit('toggle-tabs')
		}
	}
})

export default store