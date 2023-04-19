import client from "../client";

class User {
	static getStaffList(){
		return client.get('/staff')
	}
}

export default User