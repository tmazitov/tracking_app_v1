import client from './client'

class TMS {
	static getUserInfo(){
		return client.get("/user")
	}
	static putUserInfo(shortName:string){
		return client.put("/user", {
			shortName: shortName
		})
	}
}

export default TMS