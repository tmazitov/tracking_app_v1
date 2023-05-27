import { IOrderUpdateMessage } from "@/assets/orderUpdateHub";
import { IOrderState } from "./order-store";
import Order from "@/assets/order";

function wsRouter(state: IOrderState, message:IOrderUpdateMessage) {
	let order = state.orders.find(order => order.orderId == message.orderId)
	if (order && message.type == 1){
		wsUpdateStartAtFact(order, message.data)
	}
}

function wsUpdateStartAtFact(order:Order, data:any){
	if (data["startAtFact"]){
		order.statusId = Number(data["statusId"])
		order.startAtFact = new Date(data["startAtFact"])
	}
}

export {
	wsRouter
}