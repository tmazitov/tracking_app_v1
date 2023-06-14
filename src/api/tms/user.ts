import { yyyymmdd } from "@/assets/date";
import client from "../client";

class User {
	static getStaffList(){
		return client.get('/staff')
	}

	static holidayCreate(workerId:number, date:Date){
		return client.get(`/user/${workerId}/holiday?d=${yyyymmdd(date)}`)	
	}

	static holidayList(date:Date){ 
		return client.get(`/holiday-list?d=${yyyymmdd(date)}`)	
	}

	static holidayDelete(workerId:number, date:Date){
		return client.delete(`/user/${workerId}/holiday?d=${yyyymmdd(date)}`)	
	}
}

export default User