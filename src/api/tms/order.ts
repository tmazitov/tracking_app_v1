import client from "../client";

class Order {
	static list(){
		return client.get('/order/list')
	}
}

export default Order