import { reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { isEqual, yyyymmdd } from "./date"
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

interface OrderListFiltersOptions {
	nonDate: boolean|undefined
}

class OrderListFiltersInstance {
	date: Date|null = null
	title: string = ""
	page: number = 0
	workerId: number = -1
	status: Array<number> = []
	type: Array<number> = []
	isRegularCustomer: boolean = false
	options: OrderListFiltersOptions|undefined
	constructor(options:OrderListFiltersOptions|undefined) {
		const route = useRoute()
		this.options = options
		if ((options && !options.nonDate) || !options) {
			this.date = new Date()
		}
		if (((options && !options.nonDate) || !options) && route.query["d"]){
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
		this.title = ""
		this.status = []
		this.type = []
		this.isRegularCustomer = false
	}
	
	copy():OrderListFiltersInstance{
		return new OrderListFiltersInstance(this.options)
	}

	isEqual(original:OrderListFiltersInstance):Boolean{
		return this.workerId == original.workerId &&
		this.status == original.status &&
		this.type == original.type && 
		this.isRegularCustomer == original.isRegularCustomer
	}

	toPageUrlQuery(){
		const query: {[id: string] : string|number} = {}
		if (this.date)					query["d"] = yyyymmdd(this.date)
		if (this.title.length > 0)		query["n"] = this.title
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
		
		if (this.date) 					filterItems.push(`d=${yyyymmdd(this.date)}`)
		if (this.title.length > 0) 		filterItems.push(`n=${this.title}`)
		if (this.page != -1)			filterItems.push(`p=${this.page}`)
		if (this.workerId != -1)		filterItems.push(`w=${this.workerId}`)
		if (this.status.length != 0)	filterItems.push(`s=${sum(this.status)}`)
		if (this.type.length != 0)		filterItems.push(`t=${sum(this.type)}`)
		if (this.isRegularCustomer)		filterItems.push(`is_reg=1`)
	
		filterString += filterItems.join("&")
		return filterString
	}

	toRequestData():{[key:string]: any}{
		let filterData:{[key:string]: any} = {
			date: this.date,
			title: this.title,
			statuses: this.status,
			types: this.type,
			isRegularCustomer: this.isRegularCustomer
		}

		if (this.page != -1){
			filterData.page = this.page
		}
		if (this.workerId != -1){
			filterData.workerId = this.workerId
		}

		return filterData
	}

	// difference(anotherFilters:OrderListFiltersInstance){
	// 	let difference:{[key:string]:boolean} = {}
	// 	if ((this.date && anotherFilters.date && !isEqual(this.date, anotherFilters.date)) || this.date != anotherFilters.date){
	// 		difference["date"] = true
	// 	} 
	// 	if (this.title != anotherFilters.title) difference["title"] = true
	// 	if (this.page != anotherFilters.page) difference["page"] = true
	// 	if (this.workerId != anotherFilters.workerId) difference["workerId"] = true
	// 	if (this.status != anotherFilters.status) difference["status"] = true
	// 	if (this.type != anotherFilters.type) difference["type"] = true
	// 	if (this.isRegularCustomer != anotherFilters.isRegularCustomer) difference["isRegularCustomer"] = true
	// 	if (this.type != anotherFilters.type) difference["type"] = true

	// 	return difference
	// }
}

function newOrderListFilters(options:OrderListFiltersOptions|undefined=undefined):OrderListFiltersInstance{

	const filters = new OrderListFiltersInstance(options)
	
	return reactive(filters)
}


export {
	OrderListFiltersInstance,
	newOrderListFilters,
	orderStatuses,
	orderTypes,
}