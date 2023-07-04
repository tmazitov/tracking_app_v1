import Order from "@/assets/order";
import StaffWorkTime from "@/assets/staffWorkTime";
import User from "@/assets/user";

interface OrderStyle {
	'border-color' : string
}

const orderStyles = (order:Order, isValid:Boolean):OrderStyle => {
	if (!isValid) return {
		'border-color' : 'var(--ion-color-danger)'
	}

	let borderColor = ""

	switch (order.getStatusMessage().colorName) {
		case "primary":
			borderColor = '#FFC107'
			break;
		case "secondary":
			borderColor = '#4CAF50'
			break
		case "tertiary":
			borderColor = '#1976D2'
			break
		case "success":
			borderColor = '#009688'
			break
		case "danger":
			borderColor = 'grey'
			break
	}

	return {
		'border-color' : borderColor,
	}
}

const orderPosition = (order:Order, workTime:StaffWorkTime) => {
	
	let workTimeStartHour:number = workTime.startHour()

	let top:number = (order.startAt.getHours() - workTimeStartHour + order.startAt.getMinutes() / 60) * 42
	let bot:number = (order.endAt.getHours() - workTimeStartHour + order.endAt.getMinutes() / 60) * 42 
	let height:number = bot - top

	return {
		top: `${top}px`,
		height: `${height}px`,
	}
}

export {
	orderStyles,
	orderPosition,
}