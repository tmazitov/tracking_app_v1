
class OrderPriceList {
	bigCarPrice		: number
	bigCarTime		: number
	helperPrice		: number
	helperTime		: number
	fragilePrice	: number
	kmPrice			: number
	constructor(params:any) {
		this.bigCarPrice = params["bigCarPrice"]
		this.bigCarTime = params["bigCarTime"]
		this.helperPrice = params["helperPrice"]
		this.helperTime = params["helperTime"]
		this.fragilePrice = params["fragilePrice"]
		this.kmPrice = params["kmPrice"]
	}

	compare(anotherPriceList:OrderPriceList) {
		if (this.bigCarPrice != anotherPriceList.bigCarPrice) return false
		if (this.bigCarTime != anotherPriceList.bigCarTime) return false
		if (this.helperPrice != anotherPriceList.helperPrice) return false
		if (this.helperTime != anotherPriceList.helperTime) return false
		if (this.fragilePrice != anotherPriceList.fragilePrice) return false
		if (this.kmPrice != anotherPriceList.kmPrice) return false
		
		return true
	}

	clone(){
		return new OrderPriceList({
			bigCarPrice	: this.bigCarPrice,	
			bigCarTime	: this.bigCarTime,	
			helperPrice	: this.helperPrice,	
			helperTime	: this.helperTime,	
			fragilePrice: this.fragilePrice,
			kmPrice		: this.kmPrice,		
		})
	}
}

export default OrderPriceList