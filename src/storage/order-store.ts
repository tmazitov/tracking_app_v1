import Order from "@/assets/order"
import OrderUpdateHub from "@/assets/orderUpdateHub"

interface IOrderState {
	ordersWebSocket: OrderUpdateHub|null
	orders:Array<Order>
}

function getDefaultState():IOrderState{
	return {
		orders: [],
		ordersWebSocket: null,
	}
}

export {
	getDefaultState
}
export type { IOrderState }
