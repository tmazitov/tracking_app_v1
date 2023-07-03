import Point from "@/assets/point"

interface IOrderBill {
	total:number,
	carPrice:number,
	carHours:number,
	carTypeId:number,
	helperPrice:number,
	helperCount:number,
	helperHours:number,
	kmCount: number,
	kmPrice: number,
	isFragileCargo:boolean,
}

interface IOrderCreateForm {
	title: string
	date: string
	start: string
	duration: number

	comment: string

	points: Array<Point>
	selectedTab: number
	currentWorkerId:number
	currentOrderType:Array<number>

	isRegularCustomer:boolean
	price: IOrderBill
}

function getDefaultForm():IOrderCreateForm{
	return {
		title: "",
		date: "",
		start: "",
		duration: 0,
		comment: "",
		points: [],
		selectedTab: 0,
		currentWorkerId: 0,
		currentOrderType: [1],
		isRegularCustomer:false,
		price: {
			total: 0,
			carPrice: 0,
			carHours: 0,
			carTypeId: 0,
			helperPrice:0,
			helperCount:0,
			helperHours:0,
			kmCount: 0,
			kmPrice: 0,
			isFragileCargo: false,
		}
	}
}

export type {
	IOrderCreateForm
}

export {
	getDefaultForm
}