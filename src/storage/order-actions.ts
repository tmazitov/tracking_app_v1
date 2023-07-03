import { IOrderUpdateMessage } from "@/assets/orderUpdateHub";

import TMS from "@/api/tms";

function setupOrderPriceList(store:any) {
	TMS.order().priceList().then((response) => {
		if (response.data.err) {
			throw response.data.err
		}

		let priceList:{[key:string]:number} = {}
		response.data["prices"]
		.forEach((item:{
			name:string, 
			val: number
		}) => {
			priceList[item.name] = item.val
		})

	})
}

export {
	setupOrderPriceList
}