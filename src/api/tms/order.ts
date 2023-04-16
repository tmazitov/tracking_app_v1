import CreatableOrder from "@/assets/forms/createOrderForm";
import client from "../client";

class Order {
	static list(){
		return client.get('/order/list')
	}

	static create(orderData:CreatableOrder ){
		return client.post('/order', orderData)
	}
}

export default Order