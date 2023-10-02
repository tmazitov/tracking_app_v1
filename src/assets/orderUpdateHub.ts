import AuthAPI, { AccessTokenPairAPI } from "@/api/auth/auth"
import Order from "./order";
import { failedQueue, isRefreshing, updateRefreshing } from "@/api/failedQueue";
import User from "./user";
import { OrderListFiltersInstance } from "./orderListFilters";
import { isEqual } from "./date";
import OrderStorage from "./orderStorage";

interface IUpdateMessage {
	orderId:number     
	type:number
	status?: number  
	data?:any
}

type UpdateAction = (order:Order, message:IUpdateMessage) => void
type RejectAction = (message:IUpdateMessage) => void

const UpdateStartAtFact:number = 1
const UpdateEndAtFact:number = 2
const UpdateWorker:number = 3

const ClientMessageUpdateFilters:number = 1


class OrderUpdateHub {
	ws: WebSocket
	storage: OrderStorage
	isAuthorized:boolean = false
	isRefreshAttempt:boolean = false
	onAuthWaitList:Array<{reject:Function, resolve:Function}> = []
	constructor(storage:OrderStorage) {
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

	private router(message:IUpdateMessage){
		switch (message.type){
			case UpdateStartAtFact:
				this.updateStartAtFact(message)
				break
			case UpdateEndAtFact:
				this.updateEndAtFact(message)	
				break
			case UpdateWorker:
				this.updateWorker(message)
				break
		}
	}

	private updateStartAtFact(message:IUpdateMessage){
		if (!message.data["startAtFact"])
			return
		this.updateOrder(message, (order:Order, message:IUpdateMessage) => {
			order.statusId = Number(message.data["statusId"])
			order.startAtFact = new Date(message.data["startAtFact"])
		})
	}
	private updateEndAtFact(message:IUpdateMessage){
		if (!message.data["endAtFact"])
			return
		this.updateOrder(message, (order:Order, message:IUpdateMessage) => {
			order.statusId = Number(message.data["statusId"])
			order.startAtFact = new Date(message.data["endAtFact"])	
		})
	}
	private updateWorker(message:IUpdateMessage){
		if (!message.data["worker"]) 
			return
		this.updateOrder(message, 
			(order:Order, message:IUpdateMessage) => {
				order.statusId = Number(message.data["statusId"])
				order.worker = new User(message.data["worker"])
			}, 
			(message:IUpdateMessage) => {
				let order:Order = new Order(message.data)
				if (this.storage.respondByFilters(order))
					this.storage.orders.value.push(order)
			} 
		)
	}


	private printLog(data:any) {
		console.log(`ws received : ${(new Date()).toLocaleTimeString()} : ${data}`)
	}	

	private onmessage(event:MessageEvent<any>) {
		this.printLog(event.data)

		let message:IUpdateMessage = JSON.parse(event.data)
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

	private updateOrder(message:IUpdateMessage, updateAction:UpdateAction, notFoundAction:RejectAction|null = null)
	{
		let order:Order|undefined = this.storage.orders.value.find((o:Order) => {
			return o.orderId == message.orderId
		})

		if (!order && notFoundAction)
			return notFoundAction(message)
		if (!order) 
			return

		updateAction(order, message)
	}
} 

export type {
	IUpdateMessage
}

export default OrderUpdateHub 