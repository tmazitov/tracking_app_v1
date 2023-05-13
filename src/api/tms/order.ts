import CreatableOrder from "@/assets/forms/createOrderForm";
import client from "../client";
import { OrderListFiltersInstance } from "@/assets/orderListFilters";

class Order {
	static list(filters:OrderListFiltersInstance){
		return client.get('/order/list'+filters.toRequestQuery())
	}

	static create(orderData:CreatableOrder ){
		return client.post('/order', orderData)
	}

	static start(orderId:bigint){
		
	} 

	static end(orderId:bigint){
		
	} 

	static setWorker(orderId:bigint, workerId:bigint){

	}
}

export default Order