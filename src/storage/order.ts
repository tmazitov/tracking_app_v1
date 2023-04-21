import TMS from "@/api/tms"
import Order from "@/assets/order"
import { Store, Module } from "vuex"

interface OrderState {
	list:Array<Order>
}

function getDefaultState():OrderState{
	return {
		list: []
	}
}

const module:Module<OrderState,any> = {
	state: getDefaultState(),
	mutations:{
		'setup-order-list': (state:OrderState, list:Array<Order>) => {
			state.list = list
		}
	},
	getters:{
		orderList(state:OrderState){
			return state.list
		}
	},
	
	actions:{
		'setup-order-list': ({commit}, filters) => {
			TMS.order().list(filters).then((response) => {
				if (response.data && response.data["err"] != null){
					throw response.data["err"]
				}

				let orderList:Array<Order> = []
				const ordersInfo:Array<Object> = response.data
				ordersInfo.forEach((orderInfo) => {
					orderList.push(new Order(orderInfo))
				})
				commit('setup-order-list', orderList)
			})
		}
	},
}

export default module