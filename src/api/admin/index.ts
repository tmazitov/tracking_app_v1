import admClient from "./client"

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
}

export {
	AdminAPI
}