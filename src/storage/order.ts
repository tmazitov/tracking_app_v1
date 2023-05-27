import { AccessTokenPairAPI } from "@/api/auth/auth"
import TMS from "@/api/tms"
import Order from "@/assets/order"
import OrderUpdateHub from "@/assets/orderUpdateHub"
import User from "@/assets/user"
import { Store, Module } from "vuex"
import { wsRouter } from "./order-actions"
import { IOrderState, getDefaultState } from "./order-store"



const module:Module<IOrderState,any> = {
	state: getDefaultState(),
	mutations:{
		'setup-order-list': (state:IOrderState, list:Array<Order>) => {
			state.orders = list
		},
		'setup-order-websocket': (state:IOrderState) => {
			let access = AccessTokenPairAPI.getAccess()
			if (access) {
				state.ordersWebSocket = new OrderUpdateHub('ws://localhost:5001/tms/ws/order/updates', state)
			}
		}
	},
	getters:{
		orderList(state:IOrderState){
			return state.orders
		},
		orderListByWorker: (state:IOrderState) => (worker:User) => {
			return state.orders.filter((order:Order) => {
				return order.worker && worker.id == order.worker.id
			})
		},
		orderListByDate: (state:IOrderState) => (date:Date) => {
			return state.orders.filter((order:Order) => {
				return order.startAt.getDate() == date.getDate() &&
					order.startAt.getMonth() == date.getMonth() &&
					order.startAt.getFullYear() == date.getFullYear() 
			})
		},
	},
	
	actions:{
		'setup-order-websocket': ({commit}) => {
			commit('setup-order-websocket')
		},
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