import TMS from '@/api/tms'
import Vuex from 'vuex'
import order from './order'
import User from '@/assets/user'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'

interface userState{
	user: User,
	workers: Array<User>
	managers: Array<User>
	isShowTabs: boolean
	isShowHeader: boolean
	offerId:number|null|undefined
}

function getDefaultState():userState{
	return {
		user: new User({}),
		workers: [],
		managers: [],
		isShowTabs: true,
		isShowHeader: true,
		offerId:undefined
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
		'toggle-tabs': (state, value) => {
			state.isShowTabs = value
		},
		'update-offer': (state, value) => {
			state.offerId = value
		},
		'add-worker': (state, staff) => {
			state.workers.push(staff)
		},
		'add-manager': (state, staff) => {
			state.managers.push(staff)
		},
		'update-show-header': (state, value) => {
			state.isShowHeader = value
		} 
	},
	getters: {
		userMainInfo(state){
			return state.user
		},
		staffWorkers(state){
			return state.workers
		},
		staffManagers(state){
			return state.managers
		},
		isShowTabs(state){
			return state.isShowTabs
		},
		isShowHeader(state){
			return state.isShowHeader
		},
		userOffer(state){
			return state.offerId
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
		'setup-offer': (store, offerId) => {
			if (offerId) {
				store.commit("update-offer", offerId)
				return
			}

			TMS.user().offerGet().then((response) => {
				if (response.data && response.data.err ) throw response.data.err
				let offerId = response.data.offerId

				store.commit("update-offer", offerId ?? null)
			})
		},
		'setup-user': (store, route: RouteLocationNormalizedLoaded) => {
			TMS.getUserInfo().then(userInfo => {
				if (userInfo.data["err"]){
				  throw new userInfo.data["err"]
				}
				
				store.commit('save-user', new User(userInfo.data))
				let roleId:number = userInfo.data["roleId"]
				if (roleId == 2 || roleId == 3){
					store.dispatch('setup-staff')		
				}
				if (roleId == 0) {
					store.dispatch('setup-offer')
				}
			})
		},
		'toggle-tabs': (store, value) => {
			store.commit('toggle-tabs', value)
		},
		'add-staff' : (store, staff:User) => {
			if (staff.roleId == 1) {
				store.commit('add-worker', staff)
			}
			else if (staff.roleId == 2){
				store.commit('add-manager', staff)
			}
		},
		'update-show-header': (store, value) => {
			store.commit('update-show-header', value)
		}
	}
})

export default store