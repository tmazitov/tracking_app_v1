import OrderPriceList from "@/assets/orderPriceList"
import admClient from "./client"
import StaffWorkTime from "@/assets/staffWorkTime"

class AdminAPI {
	static offerList(){
		return admClient.get("/offer/list")
	}

	static offerAccept(offerId:number) {
		return admClient.get(`/offer/${offerId}/accept`)
	}

	static offerReject(offerId:number) {
		return admClient.get(`/offer/${offerId}/reject`)
	}

	static workerDel(userId:number){
		return admClient.post("/staff/remove", {
			userId: userId
		})
	}

	static updatePriceList(priceList:OrderPriceList){
		return admClient.put("/order/price-list", priceList)
	}

	static staffUpdateWorkTime(workTime:StaffWorkTime){
		return admClient.put("/staff/work-time", workTime.toSubmit())
	}
}

export {
	AdminAPI
}