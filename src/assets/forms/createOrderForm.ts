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
	orderType:			number|undefined
	comment:			string|undefined
	isRegularCustomer:	boolean|undefined
	price: {
		total:number,
		carPrice:number,
		carHours:number,
		carTypeId:number,
		helperPrice:number,
		helperCount:number,
		helperHours:number,
		km: number,
		isFragileCargo:		boolean|undefined
	}
}

export default CreatableOrder