import Point from "@/assets/point"
import { yyyymmddRegexp, hhmmRegexp } from "@/assets/regexp"
import * as yup from "yup"

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

class OrderCreateForm {
	title: string
	date: string
	start: string
	duration: number

	comment: string

	points: Array<Point>
	currentWorkerId:number
	currentOrderType:Array<number>

	isRegularCustomer:boolean
	price: IOrderBill

	constructor() {
		this.title = "",
		this.date = "",
		this.start = "",
		this.duration = 0,
		this.comment = "",
		this.points = [],
		this.currentWorkerId = 0,
		this.currentOrderType = [1],
		this.isRegularCustomer = false,
		this.price = {
			total: 0,
			carPrice: 0,
			carHours: 2,
			carTypeId: 0,
			helperPrice:0,
			helperCount:0,
			helperHours:0,
			kmCount: 0,
			kmPrice: 0,
			isFragileCargo: false,
		}
	}

	static schema(){
		return yup.object({
			title: yup
				.string()
				.required('Укажите название заказа')
				.max(100),
			date: yup
				.string()
				.required('Укажите дату заказа')
				.matches(yyyymmddRegexp, 'Неправильная дата'),
			start: yup
				.string()
				.required('Укажите время начала заказа')
				.matches(hhmmRegexp, 'Неправильное время'),
			duration: yup
				.number()
				.required('Укажите длительность заказа')
				.min(2).max(1000),
			comment: yup
				.string()
				.max(250),
			points: yup
				.array(Point.toYup())
				.required('Укажите точки заказа')
				.min(2, "Нужно как минимум 2 точки"),
			currentOrderType: yup
				.array(yup.number())
				.default([1]).max(3).min(1, "Нужно укакать как минимум 1 тип заказа"),
			isRegularCustomer: yup.
				bool().default(false),
			price: yup.object({
				total: yup
					.number()
					.required()
					.min(0),
				carPrice: yup
					.number()
					.required()
					.min(0),
				carHours: yup
					.number()
					.required()
					.min(2),
				carTypeId: yup
					.number().min(0),
				helperPrice: yup
					.number().min(0),
				helperCount: yup
					.number().min(0),
				helperHours: yup
					.number().min(0),
				kmCount:  yup
					.number().min(0),
				kmPrice:  yup
					.number().min(0),
				isFragileCargo: yup
					.bool().default(false),
			})
		})
	}
}

interface IOrderCreateForm {
	title: string
	date: string
	start: string
	duration: number

	comment: string

	points: Array<Point>
	currentWorkerId:number
	currentOrderType:Array<number>

	isRegularCustomer:boolean
	price: IOrderBill
}
export type {
	IOrderCreateForm
}
export default OrderCreateForm