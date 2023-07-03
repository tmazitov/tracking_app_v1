import { AccessTokenPairAPI } from "@/api/auth/auth"
import TMS from "@/api/tms"
import Order from "@/assets/order"
import OrderUpdateHub from "@/assets/orderUpdateHub"
import User from "@/assets/user"
import { Module } from "vuex"
import { setupOrderPriceList } from "./order-actions"
import { IOrderState, getDefaultState } from "./order-store"
import { OrderListFiltersInstance } from "@/assets/orderListFilters"



const module:Module<IOrderState,any> = {
	state: getDefaultState(),
	mutations:{
		'setup-order-list': (state:IOrderState, list:Array<Order>) => {
			state.orders = list
		},
		'setup-order-map': (state:IOrderState, list:Array<Order>) => {
			state.ordersMap = list
		},
		'add-order': (state:IOrderState, order:Order) => {
			state.orders.push(order)
		},
	},
	getters:{
		orderList(state:IOrderState){
			return state.orders
		},
		orderMap(state:IOrderState){
			return state.ordersMap
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
		},
		'setup-order-map': ({commit}, filters) => {
			TMS.order().list(filters).then((response) => {
				if (response.data && response.data["err"] != null){
					throw response.data["err"]
				}

				let orderList:Array<Order> = []
				const ordersInfo:Array<Object> = response.data
				ordersInfo.forEach((orderInfo) => {
					orderList.push(new Order(orderInfo))
				})
				commit('setup-order-map', orderList)
			})
		},
		'add-order': ({commit}, order:Order) => commit('add-order', order),
	},
}

export default module