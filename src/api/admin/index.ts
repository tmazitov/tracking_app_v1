import admClient from "./client"

class AdminAPI {
	static offerList(){
		return admClient.get("/offer/list")
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