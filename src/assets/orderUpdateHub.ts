import AuthAPI, { AccessTokenPairAPI } from "@/api/auth/auth"
import Order from "./order";
import { failedQueue, isRefreshing, updateRefreshing } from "@/api/failedQueue";
import User from "./user";
import { OrderListFiltersInstance } from "./orderListFilters";

interface IOrderUpdateMessage {
	orderId:number       
	type:number 
	data:any 
}

const UpdateStartAtFact:number = 1
const UpdateEndAtFact:number = 2
const UpdateWorker:number = 3

const ClientMessageUpdateFilters:number = 1

interface IOrderStorage {
	orders: Array<Order>
}

class OrderUpdateHub {
	ws: WebSocket
	storage: IOrderStorage
	isAuthorized:boolean = false
	isRefreshAttempt:boolean = false
	onAuthWaitList:Array<{reject:Function, resolve:Function}> = []
	constructor(storage:IOrderStorage) {
		this.ws = new WebSocket('ws://localhost:5001/tms/ws/order/updates')
		this.ws.onmessage = (e)=>this.onmessage(e)
		this.ws.onopen    = (e)=>this.onopen(e)
		this.ws.onclose = this.onclose
		this.ws.onerror = this.onerror
		this.storage = storage
		console.log("ws created")
	}

	updateFilters(filters: OrderListFiltersInstance){
		let message = {
			access: AccessTokenPairAPI.getAccess(),
			type: ClientMessageUpdateFilters,
			data: filters.toRequestData()
		}

		if (!this.isAuthorized) {
			this.onAuthWaitList.push({
				resolve: (access:string) => {
					message.access = access
					this.ws.send(JSON.stringify(message))
				},
				reject: () => {throw new Error("Fail to update filters")}
			})
			return
		}

		this.ws.send(JSON.stringify(message))
	}

	private router(message:IOrderUpdateMessage){
		let order:Order|undefined = this.storage.orders.find(order => order.orderId == message.orderId)
		this.routerUpdater(order, this.storage.orders, message)
	}	

	private routerUpdater(order:Order|undefined, orders:Array<Order>, message:IOrderUpdateMessage){
		switch (message.type){
			case UpdateStartAtFact:
				if (!order) return
				this.updateStartAtFact(order, message.data)
				break
			case UpdateEndAtFact:
				if (!order) return
				this.updateEndAtFact(order, message.data)	
				break
			case UpdateWorker: 
				if (order) {
					this.updateWorker(order, message.data)
				} else if (message.data["startAt"]) {
					orders.push(new Order(message.data))
				}
				break
		}
	}

	private updateStartAtFact(order:Order, data:any){
		if (data["startAtFact"]){
			order.statusId = Number(data["statusId"])
			order.startAtFact = new Date(data["startAtFact"])
		}
	}
	private updateEndAtFact(order:Order, data:any){
		if (data["endAtFact"]){
			order.statusId = Number(data["statusId"])
			order.startAtFact = new Date(data["endAtFact"])
		}
	}

	private updateWorker(order:Order, data:any){
		if (data["worker"]){
			order.statusId = Number(data["statusId"])
			order.worker = new User(data["worker"])
		}
	}


	private printLog(data:any) {
		console.log(`ws received : ${(new Date()).toLocaleTimeString()} : ${data}`)
	}	

	private onmessage(event:MessageEvent<any>) {
		this.printLog(event.data)

		let message = JSON.parse(event.data)
		if (message["status"] == 200){
			this.isAuthorized = true
			if (this.onAuthWaitList.length > 0){
				this.onAuthWaitList.forEach((p) => {
					p.resolve()
				})	
				this.onAuthWaitList = []
			}
		}
		if (message["status"] == 401){
			this.isAuthorized = false
			if (isRefreshing) {
				let prom = {
					reject: (err:any) => console.log("fail to refresh for ws", err),
					resolve: (access:string) => {
						this.ws.send(JSON.stringify({access}))
						this.isRefreshAttempt = false
						this.isAuthorized = true
					}
				}
				failedQueue.push(prom)
				updateRefreshing(true)
				return
			}

			if (!this.isRefreshAttempt) {
				let accessMessage = {
					access: AccessTokenPairAPI.getAccess(),
				}
				this.ws.send(JSON.stringify(accessMessage))
				this.isRefreshAttempt = true
			} else {
				AuthAPI.refresh().then(response => {
					if (response.data.err){
						throw response.data.err
					}

					let accessMessage = {
						access: response.data["access"],
					}
					this.ws.send(JSON.stringify(accessMessage))
					this.isRefreshAttempt = false
					this.isAuthorized = true
				})
				
			}
		} else if (message["data"]) {
			this.router(message)
		} 
	}


	private onopen(event:Event) {

		let accessMessage = {
			access: AccessTokenPairAPI.getAccess(),
		}
		this.ws.send(JSON.stringify(accessMessage))

	}

	private onerror(event:Event){
		console.log(`ws error : ${(new Date()).toLocaleTimeString()} : ${event}`)
	}

	private onclose(event:Event){
		console.log("ws closed");
	}
} 

export type {
	IOrderUpdateMessage
}

export default OrderUpdateHub 