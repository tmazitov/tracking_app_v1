import tmsClient from './client'
import Order from './order'
import User from './user'

class TMS {
	static getUserInfo(){
		return tmsClient.get("/user")
	}
	static putUserInfo(shortName:string){
		return tmsClient.put("/user", {
			shortName: shortName
		})
	}

	static user = () => User

	static order = () => Order
}

export default TMS