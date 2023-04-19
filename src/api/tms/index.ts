import client from '../client'
import Order from './order'
import User from './user'

class TMS {
	static getUserInfo(){
		return client.get("/user")
	}
	static putUserInfo(shortName:string){
		return client.put("/user", {
			shortName: shortName
		})
	}

	static user = () => User

	static order = () => Order
}

export default TMS