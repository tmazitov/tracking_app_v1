import TMS from "@/api/tms"
import Point from "./point"
import User from "./user"

interface StatusMessage {
	message:string
	colorName:string
}

const ORDER_STATUS_MESSAGES:Array<StatusMessage> = [
	{message: "",				colorName:""},
	{message: "Выполенен",		colorName:"success"},
	{message: "Отменён",		colorName:"danger"},
	{message: "В обработке",	colorName:"primary"},
	{message: "Подтверждён",	colorName:"secondary"},
	{message: "В процессе",		colorName:"tertiary"},
]

class Order {
	details:Object|null
	title:string
	orderId:number

	startAt:Date
	startAtFact:Date|undefined
	endAt:Date
	endAtFact:Date|undefined
	
	statusId:number
	points:Array<Point>
	owner:User
	orderType:number
	worker:User|undefined
	manager:User|undefined
	helpers: number|null
	comment: string|null
	isFragileCargo: boolean|null
	isRegularCustomer: boolean|undefined
	constructor(details:any) {
		this.details = details
		this.orderId = details["orderId"]
		this.title = details["title"]
		this.orderType = details["orderType"]

		this.startAt = new Date(details["startAt"])
		if (details["startAtFact"]){
			this.startAtFact = new Date(details["startAtFact"])
		}
		this.endAt = new Date(details["endAt"])
		if (details["endAtFact"]){
			this.endAtFact = new Date(details["endAtFact"])
		}
		this.statusId = details["statusId"]
		this.owner = new User(details["owner"])
		if (details["worker"]){
			this.worker = new User(details["worker"])
		}
		if (details["manager"]){
			this.manager = new User(details["manager"])
		}
		this.helpers = details["helpers"]
		this.comment = details["comment"]
		this.isFragileCargo = details["isFragileCargo"]
		this.isRegularCustomer = details["isRegularCustomer"]
		
		this.points = []
		let pointsData:Array<any> = details["points"]
		pointsData.forEach((pointInfo) => {
			this.points.push(new Point(pointInfo))
		}) 
	}

	getStatusMessage(){
		return ORDER_STATUS_MESSAGES[this.statusId]
	}

	getTitle(){
		return this.title
	}

	getTime():string{
		let timeString = ""
		let hour = this.startAt.getHours()
		let minute = this.startAt.getMinutes()
		let minuteString 
		if (minute < 10){
			minuteString = '0' + minute
		} else {
			minuteString = '' + minute
		}
		timeString += `${hour}:${minuteString}`

		if (this.endAt){
			hour = this.endAt.getHours()
			minute = this.endAt.getMinutes() 
			if (minute < 10){
				minuteString = '0' + minute
			} else {
				minuteString = '' + minute
			}
			timeString += ` - ${hour}:${minuteString}`
		}

		return timeString
	}

	getDetailAction(user:User):OrderDetailAction|undefined{
		let now:Date = new Date()
		switch(user.roleId){
			case 1:	// worker
				/**
				 * 1. Can start the order
				 * 2. Can end the order 
				 */
				if (this.statusId == 4 && this.worker && this.worker.id == user.id && this.startAt.getMinutes() - now.getMinutes() < 7*60*1000){
					return {
						id:1,
						action: () => this.start(),
						title: "Начать"
					}
				}

				if (this.statusId == 5 && this.worker && this.worker.id == user.id) {
					return {
						id:2,
						action: () => this.end(),
						title: "Закончить"
					}
				}

				break;
			case 2: // manager
				/**
				 * 1. Can set the worker if is not already set 
				 * */ 
				if (!this.worker && this.manager && this.manager.id == user.id ){
					return {
						id:3,
						action: TMS.order().setWorker,
						title: "Назначить водителя"
					}
				}
				break;

			case 3: // admin
				/**
				 * 1. Can set the worker if is not already set  
				 */

				if (!this.worker && this.manager && this.manager.id == user.id ){
					return {
						id:3,
						action: TMS.order().setWorker,
						title: "Назначить водителя"
					}
				}

				break;
		}
	}
	private start(){
		TMS.order().start(this.orderId).then((response) => {
			if (response.data["err"]){
				throw response.data["err"]
			}	
			this.statusId = 5
			this.startAtFact = new Date(response.data["startAtFact"])
		})
	} 
	private end(){
		TMS.order().end(this.orderId).then((response) => {
			if (response.data["err"]){
				throw response.data["err"]
			}	
			this.statusId = 1
			this.endAtFact = new Date(response.data["endAtFact"])
		})
	} 
}

interface OrderDetailAction {
	id:number
	action:Function
	title:string
}

export default Order