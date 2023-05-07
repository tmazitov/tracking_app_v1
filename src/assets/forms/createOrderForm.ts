interface CreatablePoint {
	stepId: number
	title: 	string
	lat:	number
	lon:	number
}

interface CreatableOrder {
	startAt:			string
	endAt: 				string|undefined
	points:				Array<CreatablePoint>
	title:				string|undefined
	workerId:			number|undefined
	helpers:			number|undefined
	orderType:			number|undefined
	comment:			string|undefined
	isFragileCargo:		boolean|undefined
	isRegularCustomer:	boolean|undefined
}

export default CreatableOrder