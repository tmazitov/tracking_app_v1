import CreatableOrder from "@/assets/forms/createOrderForm";
import client from "../client";

interface OrderListFilters{
	date: Date,
	page: number|undefined,
	workerId: number|undefined,	
	statusId: number|undefined,
	typeId:   number|undefined,
	isRegularCustomer: boolean|undefined,
}

class Order {
	static list(filters:OrderListFilters){
		return client.post('/order/list', filters)
	}

	static create(orderData:CreatableOrder ){
		return client.post('/order', orderData)
	}
}

export default Order