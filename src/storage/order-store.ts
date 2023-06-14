import Order from "@/assets/order"
import OrderUpdateHub from "@/assets/orderUpdateHub"
import { key } from "ionicons/icons"

interface IOrderState {
	ordersWebSocket: OrderUpdateHub|null
	orders:Array<Order>
	ordersMap:Array<Order>
	ordersPriseList: {[key:string]:number}
}

function getDefaultState():IOrderState{
	return {
		orders: [],
		ordersMap: [],
		ordersWebSocket: null,
		ordersPriseList: {},
	}
}

export {
	getDefaultState
}
export type { IOrderState }
