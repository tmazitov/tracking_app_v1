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

	static start(orderId:number){
		return client.get(`/order/${orderId}/start`)
	} 

	static end(orderId:number){
		return client.get(`/order/${orderId}/end`)		
	} 

	static setWorker(orderId:number, workerId:number){
		return client.patch(`/order/${orderId}/worker/update`, {
			workerId
		})
	}
}

export default Order