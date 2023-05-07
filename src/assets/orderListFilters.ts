import { reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { yyyymmdd } from "./date"
import { powerOfTwo, sum } from "./array"

const orderStatuses = [
	{title: "Выполнен", 	value: 1},
	{title: "Отменён",		value: 2},
	{title: "В обработке", 	value: 4},
	{title: "Подтверждён", 	value: 8},
	{title: "В процессе", 	value: 16},
]

const orderTypes = [
	{title: "Город",		value: 1},
	{title: "Пригород",		value: 2},
	{title: "Межгород",		value: 4},
]

class OrderListFiltersInstance {
	date: Date
	page: number = -1
	workerId: number = -1
	status: Array<number> = []
	type: Array<number> = []
	isRegularCustomer: boolean = false
	constructor() {
		const route = useRoute()
		this.date = new Date()
		if (route.query["d"]){
			this.date = new Date(route.query["d"].toString())
		}

		if (route.query["w"]){
			this.workerId = Number(route.query["w"])
		}
	
		if (route.query["s"]){
			let totalStatus = Number(route.query["s"])
			if (totalStatus >= 0) {
				this.status = powerOfTwo(totalStatus)
			}
		}
	
		if (route.query["t"]){
			let totalType = Number(route.query["t"])
			if (totalType >= 0) {
				this.type = powerOfTwo(totalType)
			}
		}
		
		if (route.query["is_reg"] == "1"){
			this.isRegularCustomer = true
		}
	}

	clear(){
		this.workerId = -1
		this.status = []
		this.type = []
		this.isRegularCustomer = false
	}
	
	copy():OrderListFiltersInstance{
		return new OrderListFiltersInstance()
	}

	isEqual(original:OrderListFiltersInstance):Boolean{
		return this.workerId == original.workerId &&
		this.status == original.status &&
		this.type == original.type && 
		this.isRegularCustomer == original.isRegularCustomer
	}

	toPageUrlQuery(){
		const query: {[id: string] : string|number} = {
			"d" : yyyymmdd(this.date),
		}
		if (this.workerId != -1) 		query["w"] = this.workerId
		if (this.status.length != 0) 	query["s"] = sum(this.status)
		if (this.type.length != 0) 		query["t"] = sum(this.type)
		if (this.page	  != -1) 		query["p"] = this.page
		if (this.isRegularCustomer)     query["is_reg"] = "1"

		return query
	}

	toRequestQuery():string{
		let filterString:string = "?"
		let filterItems:Array<string> = []
		
		filterItems.push(`d=${yyyymmdd(this.date)}`)
	
		if (this.page != -1){
			filterItems.push(`p=${this.page}`)
		}
		if (this.workerId != -1){
			filterItems.push(`w=${this.workerId}`)
		}
		if (this.status.length != 0){
			filterItems.push(`s=${sum(this.status)}`)
		}
		if (this.type.length != 0){
			filterItems.push(`t=${sum(this.type)}`)
		}
		if (this.isRegularCustomer){
			filterItems.push(`is_reg=1`)
		}
	
		filterString += filterItems.join("&")
		return filterString
	}
}

function newOrderListFilters():OrderListFiltersInstance{

	const filters = new OrderListFiltersInstance()
	
	return reactive(filters)
}


export {
	OrderListFiltersInstance,
	newOrderListFilters,
	orderStatuses,
	orderTypes,
}