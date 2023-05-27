import AuthAPI, { AccessTokenPairAPI } from "@/api/auth/auth"
import { IOrderState } from "@/storage/order-store";
import Order from "./order";
import { failedQueue, isRefreshing } from "@/api/client";

interface IOrderUpdateMessage {
	orderId:number       
	type:number 
	data:any 
}

const UpdateStartAtFact:number = 1
const UpdateEndAtFact:number = 2



interface IOnMessageFunction {
	(message:IOrderUpdateMessage):void;
}


class OrderUpdateHub {
	ws: WebSocket
	state: IOrderState
	isRefreshAttempt:boolean = false
	constructor(path:string, state:IOrderState) {
		this.ws = new WebSocket(path)
		this.ws.onmessage = (e)=>this.onmessage(e)
		this.ws.onopen    = (e)=>this.onopen(e)
		this.ws.onclose = this.onclose
		this.ws.onerror = this.onerror
		this.state = state
		console.log("ws created")
	}

	private router(message:IOrderUpdateMessage){
		let order = this.state.orders.find(order => order.orderId == message.orderId)
		if (!order) return

		switch (message.type){
			case UpdateStartAtFact:
				this.updateStartAtFact(order, message.data)
				break
			case UpdateEndAtFact:
				this.updateEndAtFact(order, message.data)	
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


	private printLog(data:any) {
		console.log(`ws received : ${(new Date()).toLocaleTimeString()} : ${data}`)
	}

	private onmessage(event:MessageEvent<any>) {
		this.printLog(event.data)

		let message = JSON.parse(event.data)

		if (message["status"] == 401){
			if (!this.isRefreshAttempt) {
				let accessMessage = {
					access: AccessTokenPairAPI.getAccess(),
				}
				this.ws.send(JSON.stringify(accessMessage))
				this.isRefreshAttempt = true
			} else {
				if (isRefreshing) {
					let prom = {
						reject: (err:any) => console.log("fail to refresh for ws", err),
						resolve: (access:string) => {
							this.ws.send(JSON.stringify({access}))
							this.isRefreshAttempt = false
						}
					}
					failedQueue.push(prom)
				}
				else {
					AuthAPI.refresh().then(response => {
						if (response.data.err){
							throw response.data.err
						}

						let accessMessage = {
							access: response.data["access"],
						}
						this.ws.send(JSON.stringify(accessMessage))
						this.isRefreshAttempt = false
					})
				}
				
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