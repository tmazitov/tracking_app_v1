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
	orderId:bigint
	startAt:Date
	endAt:Date|null
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
		this.endAt = new Date(details["endAt"])
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

	getTime(){
		let hour = this.startAt.getHours()
		let minute = this.startAt.getMinutes()
		let minuteString 
		if (minute < 10){
			minuteString = '0' + minute
		} else {
			minuteString = '' + minute
		}
		return `${hour}:${minuteString}`
	}
}

export default Order