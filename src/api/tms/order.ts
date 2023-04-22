import CreatableOrder from "@/assets/forms/createOrderForm";
import client from "../client";
import { yyyymmdd } from "@/assets/date";

interface OrderListFilters{
	date: Date,
	page: number|undefined,
	workerId: number|undefined,	
	statusId: number|undefined,
	typeId:   number|undefined,
	isRegularCustomer: boolean|undefined,
}



function orderListFiltersToString(filters:OrderListFilters){
	let filterString:string = "?"
	let filterItems:Array<string> = []
	
	filterItems.push(`d=${yyyymmdd(filters.date)}`)

	if (filters.page){
		filterItems.push(`p=${filters.page}`)
	}
	if (filters.workerId){
		filterItems.push(`w=${filters.workerId}`)
	}
	if (filters.statusId){
		filterItems.push(`s=${filters.statusId}`)
	}
	if (filters.typeId){
		filterItems.push(`t=${filters.typeId}`)
	}
	if (filters.isRegularCustomer){
		filterItems.push(`is_reg`)
	}

	filterString += filterItems.join("&")
	return filterString
}

class Order {
	static list(filters:OrderListFilters){
		return client.get('/order/list'+orderListFiltersToString(filters))
	}

	static create(orderData:CreatableOrder ){
		return client.post('/order', orderData)
	}
}

export default Order