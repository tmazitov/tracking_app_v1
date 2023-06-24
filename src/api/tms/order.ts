import CreatableOrder from "@/assets/forms/createOrderForm";
import { OrderListFiltersInstance } from "@/assets/orderListFilters";
import tmsClient from "./client";

class Order {
	static list(filters:OrderListFiltersInstance){
		return tmsClient.get('/order/list'+filters.toRequestQuery())
	}

	static create(orderData:CreatableOrder ){
		return tmsClient.post('/order', orderData)
	}

	static start(orderId:number){
		return tmsClient.get(`/order/${orderId}/start`)
	} 

	static end(orderId:number){
		return tmsClient.get(`/order/${orderId}/end`)		
	} 

	static setWorker(orderId:number, workerId:number){
		return tmsClient.patch(`/order/${orderId}/worker/update`, {
			workerId
		})
	}

	static priceList() {
		return tmsClient.get(`/order/price-list`)
	}
}

export default Order