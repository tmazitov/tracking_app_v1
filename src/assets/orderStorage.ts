import { Ref, reactive, ref, toRaw, watch } from "vue";
import Order from "./order";
import { OrderListFiltersInstance, OrderListFiltersOptions } from "./orderListFilters";
import OrderUpdateHub from "./orderUpdateHub";
import TMS from "@/api/tms";
import { useRouter } from "vue-router";
import { isEqual } from "./date";
import { filter } from "ionicons/icons";
import { compare, powerOfTwo, sum } from "./array";

interface IOrderStorageOptions {
	filtersOptions: OrderListFiltersOptions | undefined
}

interface IOrdersUpdateOptions {
	saveOldOrders: boolean
}

class OrderStorage {

	orders: Ref<Array<Order>>
	name:string = "default"

	filters:OrderListFiltersInstance
	private updateHub:OrderUpdateHub
	
	constructor(options:IOrderStorageOptions|undefined=undefined) {
		this.orders = ref([])
		this.filters = new OrderListFiltersInstance(options?.filtersOptions)
		this.updateHub = new OrderUpdateHub(this)
		this.updateFilter()
	}

	updateOrders(options:IOrdersUpdateOptions|undefined = undefined){
		return TMS.order().list(this.filters).then((response) => {
			if (response.data && response.data["err"] != null){
				throw response.data["err"]
			}

			let orderList:Array<Order> = []
			const ordersInfo:Array<Object> = response.data
			ordersInfo.forEach((orderInfo) => {
				orderList.push(new Order(orderInfo))
			})
			if (options?.saveOldOrders && orderList.length == 0)
				return []

			// console.log('options && options.saveOldOrders && this.orders.value :>> ', );
			if (options && options.saveOldOrders && 
				this.orders.value && this.orders.value.length){
				this.orders.value.push(...orderList)
			}
			else {
				this.orders = ref(orderList)
			}

			return orderList
		})
	}

	updateFilter(){
		this.updateHub.updateFilters(this.filters)
	}
	
	respondByFilters(order:Order){
		let filters = this.filters
		let isRespond = true

		// Date
		if (filters.date)
			isRespond = isRespond && isEqual(filters.date, order.startAt)
		if (!isRespond)
			return false

		// Title
		if (filters.title.length)
			isRespond = isRespond && order.title
				.toLowerCase()
				.includes(filters.title.toLowerCase())
		if (!isRespond)
			return false
		
		// Worker
		if (filters.workerId != -1 && order.worker)
			isRespond = isRespond && filters.workerId == order.worker?.id
		if (!isRespond)
			return false
		
		// Status
		if (filters.status.length)
			isRespond = isRespond && filters.status
				.includes(order.statusId)
		if (!isRespond)
			return false

		// Type
		if (filters.type.length)
			isRespond = isRespond && (compare(
				filters.type,
				powerOfTwo(order.orderType)
			) == undefined)
		if (!isRespond)
			return false

		// Regular customer
		if (filters.isRegularCustomer)
			isRespond = isRespond && 
				order.isRegularCustomer == filters.isRegularCustomer
		if (!isRespond)
			return false

		return true
	}

	onFilterUpdate():Promise<{[key:string]:any}>{
		return new Promise<{[key:string]:any}>((resolve) => {
			this.updateOrders()
			this.updateFilter()

			resolve(this.filters.toPageUrlQuery())
		})
	}
}

export default OrderStorage