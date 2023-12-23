import Order from "@/assets/order"
import OrderUpdateHub from "@/assets/orderUpdateHub"
import { key } from "ionicons/icons"

interface IOrderState {
	orderToUpdate:Order|null,
	ordersWebSocket: OrderUpdateHub|null
	orders:Array<Order>
	ordersMap:Array<Order>
}

function getDefaultState():IOrderState{
	return {
		orders: [],
		ordersMap: [],
		ordersWebSocket: null,
		orderToUpdate: null,
	}
}

export {
	getDefaultState
}
export type { IOrderState }
