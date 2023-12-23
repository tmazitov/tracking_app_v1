import TMS from "@/api/tms";
import { UTCString } from "@/assets/data";
import { isEqual } from "@/assets/date";
import Order from "@/assets/order";
import OrderCreateForm from "./instanse";
import { FormContext } from "vee-validate";


// Submit order form
function orderSubmit(form:FormContext<OrderCreateForm>, orderId:number=-1) {
	let values = form.values;

	let start = new Date(values.date + " " + values.start);
	let end = new Date(start.getTime());
	end.setHours(start.getHours() + values.duration);
	
	if ( orderId > -1) {
		return orderEdit(orderId, start, end, values)
	}
	return (orderCreate(start, end, values))
}

// Create order
function orderCreate(start:Date, end:Date, formData:OrderCreateForm){
	let orderType = 0
	formData.currentOrderType.forEach(type => orderType += type)
	return TMS.order()
		.create({
			title: formData.title,
			startAt: UTCString(start),
			endAt: UTCString(end),
			points: formData.points,
			workerId: formData.currentWorkerId,
			orderType: orderType,
			comment: formData.comment,
			isRegularCustomer: formData.isRegularCustomer,
			price: formData.price,
		})
}

// Edit order
function orderEdit(orderId:number, start:Date, end:Date, formData:OrderCreateForm){
	let orderType = 0
	formData.currentOrderType.forEach(type => orderType += type)
	return TMS.order()
		.edit(orderId,{
			title: formData.title,
			startAt: UTCString(start),
			endAt: UTCString(end),
			points: formData.points,
			workerId: formData.currentWorkerId,
			orderType: orderType,
			comment: formData.comment,
			isRegularCustomer: formData.isRegularCustomer,
			price: formData.price,
		})
}

export {
	orderSubmit
}