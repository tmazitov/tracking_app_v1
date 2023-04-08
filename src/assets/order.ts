import Point from "./point"

interface StatusMessage {
	message:string
	colorName:string
}

const ORDER_STATUS_MESSAGES:Array<StatusMessage> = [
	{message:"Отменён",					colorName:"danger"},
	{message:"Ожидает подтверждения",	colorName:"primary"},
	{message:"Подтверждён",				colorName:"secondary"},
	{message:"В процессе",				colorName:"tertiary"},
	{message:"Выполенен",				colorName:"success"},
]

class Order {
	details:Object|null
	orderId:bigint
	startAt:Date
	endAt:Date|null
	statusId:number
	points:Array<Point>
	ownerId:bigint
	workerId:bigint|null
	managerId:bigint|null
	helpers: number|null
	comment: string|null
	isFragileCargo: boolean|null
	constructor(details:any) {
		this.details = details
		this.orderId = details["orderId"]
		this.startAt = new Date(details["startAt"])
		this.endAt = new Date(details["endAt"])
		this.statusId = details["statusId"]
		this.ownerId = details["ownerId"]
		this.workerId = details["workerId"]
		this.managerId = details["managerId"]
		this.helpers = details["helpers"]
		this.comment = details["comment"]
		this.isFragileCargo = details["isFragileCargo"]
		
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
		return this.points[0].title
	}

	getTime(){
		let hour = this.startAt.getHours()
		let minute = this.startAt.getHours()
		let minuteString 
		if (minute < 10){
			minuteString = '0' + minute
		} else {
			minuteString = '' + minute
		}
		return `${hour}:${minute}`
	}
}

export default Order