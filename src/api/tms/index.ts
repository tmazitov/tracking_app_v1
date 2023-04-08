import client from '../client'
import Order from './order'

class TMS {
	static getUserInfo(){
		return client.get("/user")
	}
	static putUserInfo(shortName:string){
		return client.put("/user", {
			shortName: shortName
		})
	}

	static order = () => Order
}

export default TMS