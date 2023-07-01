import { reactive, watch } from "vue";
import Order from "./order";
import { OrderListFiltersInstance, OrderListFiltersOptions } from "./orderListFilters";
import OrderUpdateHub from "./orderUpdateHub";
import TMS from "@/api/tms";
import { useRouter } from "vue-router";

interface IOrderStorageOptions {
	filtersOptions: OrderListFiltersOptions | undefined
}

interface IOrdersUpdateOptions {
	saveOldOrders: boolean
}

class OrderStorage {

	orders: Array<Order> = []
	name:string = "default"

	filters:OrderListFiltersInstance
	private updateHub:OrderUpdateHub
	
	constructor(options:IOrderStorageOptions|undefined=undefined) {
		this.filters = new OrderListFiltersInstance(options?.filtersOptions)
		this.updateHub = new OrderUpdateHub(this)
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


			if (options && options.saveOldOrders){
				this.orders.push(...orderList)
			}
			else {
				this.orders = orderList
			}

			return orderList
		})
	}

	updateFilter(){
		this.updateHub.updateFilters(this.filters)
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